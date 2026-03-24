import { getAuthUser } from './auth';
import { clearUserCartApi, fetchUserCart, removeUserCartItem, upsertUserCartItem } from './cartApi';

const FAVOURITES_KEY = 'favourites';
const CART_KEY = 'cart';
export const SHOP_DATA_EVENT = 'shop-data-updated';

const getScopedFavouriteKey = () => {
  const user = getAuthUser();
  return user?.id ? `${FAVOURITES_KEY}:${user.id}` : FAVOURITES_KEY;
};

const getScopedCartKey = () => {
  const user = getAuthUser();
  return user?.id ? `${CART_KEY}:${user.id}` : CART_KEY;
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(SHOP_DATA_EVENT));
};

export const getFavouriteIds = () => readJSON(getScopedFavouriteKey(), []);

export const isFavourite = (productId) => getFavouriteIds().includes(productId);

export const toggleFavourite = (productId) => {
  const favourites = getFavouriteIds();
  const exists = favourites.includes(productId);
  const updated = exists
    ? favourites.filter((id) => id !== productId)
    : [...favourites, productId];

  writeJSON(getScopedFavouriteKey(), updated);
  return !exists;
};

export const getCartItems = () => readJSON(getScopedCartKey(), []);

export const hydrateCartFromBackend = async () => {
  const user = getAuthUser();
  if (!user?.id) {
    return [];
  }

  try {
    const rows = await fetchUserCart(Number(user.id));
    const serverItems = rows.map((item) => ({ id: Number(item.id), quantity: Number(item.quantity || 0) }));
    const localItems = getCartItems().map((item) => ({ id: Number(item.id), quantity: Number(item.quantity || 0) }));

    const mergedMap = new Map();

    for (const item of serverItems) {
      if (item.id && item.quantity > 0) {
        mergedMap.set(item.id, item.quantity);
      }
    }

    // Keep local quantity when available so rapid route changes don't drop unsynced adds.
    for (const item of localItems) {
      if (item.id && item.quantity > 0) {
        mergedMap.set(item.id, item.quantity);
      }
    }

    const merged = Array.from(mergedMap.entries()).map(([id, quantity]) => ({ id, quantity }));
    writeJSON(getScopedCartKey(), merged);

    for (const item of merged) {
      upsertUserCartItem({ userId: Number(user.id), productId: item.id, quantity: item.quantity }).catch(() => {});
    }

    return merged;
  } catch {
    return getCartItems();
  }
};

export const getCartQuantity = (productId) => {
  const item = getCartItems().find((entry) => entry.id === productId);
  return item ? item.quantity : 0;
};

export const addToCart = (productId, quantity = 1) => {
  const cartItems = getCartItems();
  const index = cartItems.findIndex((item) => item.id === productId);

  if (index >= 0) {
    cartItems[index] = {
      ...cartItems[index],
      quantity: cartItems[index].quantity + quantity,
    };
  } else {
    cartItems.push({ id: productId, quantity });
  }

  writeJSON(getScopedCartKey(), cartItems);

  const user = getAuthUser();
  if (user?.id) {
    const updatedQty = cartItems.find((item) => item.id === productId)?.quantity || quantity;
    upsertUserCartItem({ userId: Number(user.id), productId, quantity: updatedQty }).catch(() => {});
  }
};

export const setCartQuantity = (productId, quantity) => {
  const cartItems = getCartItems();

  if (quantity <= 0) {
    const filtered = cartItems.filter((item) => item.id !== productId);
    writeJSON(getScopedCartKey(), filtered);

    const user = getAuthUser();
    if (user?.id) {
      removeUserCartItem({ userId: Number(user.id), productId }).catch(() => {});
    }
    return;
  }

  const index = cartItems.findIndex((item) => item.id === productId);
  if (index >= 0) {
    cartItems[index] = { ...cartItems[index], quantity };
  } else {
    cartItems.push({ id: productId, quantity });
  }

  writeJSON(getScopedCartKey(), cartItems);

  const user = getAuthUser();
  if (user?.id) {
    upsertUserCartItem({ userId: Number(user.id), productId, quantity }).catch(() => {});
  }
};

export const removeFromCart = (productId) => {
  const cartItems = getCartItems().filter((item) => item.id !== productId);
  writeJSON(getScopedCartKey(), cartItems);

  const user = getAuthUser();
  if (user?.id) {
    removeUserCartItem({ userId: Number(user.id), productId }).catch(() => {});
  }
};

export const clearCart = () => {
  writeJSON(getScopedCartKey(), []);

  const user = getAuthUser();
  if (user?.id) {
    clearUserCartApi(Number(user.id)).catch(() => {});
  }
};

export const getCartCount = () =>
  getCartItems().reduce((sum, item) => sum + item.quantity, 0);
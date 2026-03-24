import React, { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProducts } from '../lib/productsApi';
import {
  SHOP_DATA_EVENT,
  clearCart,
  getCartItems,
  removeFromCart,
  setCartQuantity,
} from '../lib/shopStorage';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateCart = () => setCartItems(getCartItems());

    window.addEventListener(SHOP_DATA_EVENT, updateCart);
    window.addEventListener('storage', updateCart);

    return () => {
      window.removeEventListener(SHOP_DATA_EVENT, updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const rows = await fetchProducts();
        setProducts(rows);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const itemsWithDetails = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter(Boolean),
    [cartItems, products]
  );

  const total = useMemo(
    () => itemsWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [itemsWithDetails]
  );

  const updateQuantity = (productId, quantity) => {
    setCartQuantity(productId, quantity);
  };

  const removeItem = (productId) => {
    removeFromCart(productId);
    toast.success('Removed from cart');
  };

  const clearAll = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900">My Cart</h1>
            <p className="mt-2 text-sm text-neutral-600">{itemsWithDetails.length} products in your cart</p>
          </div>
          {itemsWithDetails.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              Clear Cart
            </button>
          )}
        </div>

        {itemsWithDetails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <ShoppingCart className="mx-auto mb-3 text-neutral-400" size={30} />
            <h2 className="text-xl font-medium text-neutral-800">Your cart is empty</h2>
            <p className="mt-2 text-neutral-600">Add products from the catalog and they will appear here.</p>
            <button
              type="button"
              onClick={() => navigate('/product')}
              className="mt-5 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {itemsWithDetails.map((item) => (
                <article key={item.id} className="grid grid-cols-[100px_1fr] gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:grid-cols-[120px_1fr]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-full rounded-lg object-cover sm:h-28"
                  />

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-500">{item.department}</p>
                        <h3 className="text-base font-semibold text-neutral-900">{item.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-2 text-neutral-600 transition hover:bg-neutral-100"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-neutral-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 text-neutral-700 transition hover:bg-neutral-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium text-neutral-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 text-neutral-700 transition hover:bg-neutral-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-neutral-500">Subtotal</p>
                        <p className="text-lg font-semibold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-max rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{itemsWithDetails.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="mt-3 border-t border-neutral-200 pt-3 flex items-center justify-between text-base font-semibold text-neutral-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/payment')}
                className="mt-5 w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

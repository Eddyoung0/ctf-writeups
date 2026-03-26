import React, { useEffect, useMemo, useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProducts } from '../lib/productsApi';
import { SHOP_DATA_EVENT, addToCart, getFavouriteIds, toggleFavourite } from '../lib/shopStorage';
import BackButton from '../components/BackButton';

const Favourite = () => {
  const navigate = useNavigate();
  const [favouriteIds, setFavouriteIds] = useState(() => getFavouriteIds());
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateFavourites = () => setFavouriteIds(getFavouriteIds());

    window.addEventListener(SHOP_DATA_EVENT, updateFavourites);
    window.addEventListener('storage', updateFavourites);

    return () => {
      window.removeEventListener(SHOP_DATA_EVENT, updateFavourites);
      window.removeEventListener('storage', updateFavourites);
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

  const favouriteProducts = useMemo(
    () => products.filter((product) => favouriteIds.includes(product.id)),
    [favouriteIds, products]
  );

  const removeFromFavourites = (productId) => {
    toggleFavourite(productId);
    toast.success('Removed from favourites');
  };

  const moveToCart = (productId) => {
    addToCart(productId);
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-24 pb-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <BackButton fallback="/product" />
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900">My Favourites</h1>
            <p className="mt-2 text-sm text-neutral-600">{favouriteProducts.length} saved products</p>
          </div>
        </div>

        {favouriteProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <Heart className="mx-auto mb-3 text-neutral-400" size={30} />
            <h2 className="text-xl font-medium text-neutral-800">No favourites yet</h2>
            <p className="mt-2 text-neutral-600">Tap the heart icon on any product to save it here.</p>
            <button
              type="button"
              onClick={() => navigate('/product')}
              className="mt-5 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favouriteProducts.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
                <div className="cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                  <img src={item.image} alt={item.name} className="h-60 w-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wider text-neutral-500">{item.department}</p>
                  <h3 className="mt-1 text-base font-semibold text-neutral-900">{item.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-semibold text-neutral-900">${item.price}</span>
                    <span className="text-sm text-neutral-400 line-through">${item.oldPrice}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveToCart(item.id)}
                      className="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 inline-flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromFavourites(item.id)}
                      className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 transition hover:bg-neutral-100"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourite;

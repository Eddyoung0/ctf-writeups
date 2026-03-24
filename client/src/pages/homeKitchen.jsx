import React, { useMemo, useState, useEffect } from 'react';
import { Star, SlidersHorizontal, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCart, getFavouriteIds, toggleFavourite } from '../lib/shopStorage';
import { fetchProducts } from '../lib/productsApi';

const ratingOptions = [4, 3, 2];

const HomeKitchen = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [priceLimit, setPriceLimit] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [favourites, setFavourites] = useState(() => getFavouriteIds());
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const rows = await fetchProducts('home-kitchen');
        setProducts(rows);

        const numericPrices = rows
          .map((item) => Number(item.price))
          .filter((value) => Number.isFinite(value));

        if (numericPrices.length) {
          const min = Math.floor(Math.min(...numericPrices));
          const max = Math.ceil(Math.max(...numericPrices));
          setPriceRange({ min, max });
          setPriceLimit(max);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const departmentOptions = useMemo(
    () => ['All', ...new Set(products.map((item) => item.department).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const departmentMatch = selectedDepartment === 'All' ? true : item.department === selectedDepartment;
      const priceMatch = priceRange.max === 0 ? true : item.price <= priceLimit;
      const ratingMatch = item.rating >= minRating;
      return departmentMatch && priceMatch && ratingMatch;
    });
  }, [selectedDepartment, priceLimit, minRating, products, priceRange.max]);

  const openProduct = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product/${productId}`);
  };

  const handleToggleFavourite = (event, productId) => {
    event.stopPropagation();
    const added = toggleFavourite(productId);
    setFavourites(getFavouriteIds());
    toast.success(added ? 'Added to favourites' : 'Removed from favourites');
  };

  const handleAddToCart = (productId) => {
    addToCart(productId);
    toast.success('Added to cart');
  };

  return (
    <div className="bg-[#f8f8f6] min-h-screen pt-24 pb-14">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-10">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#f7efe6] via-[#fbf6f0] to-[#f4e9dc] px-6 py-10 sm:px-10 lg:px-14 lg:py-14 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-600 mb-3">Home & Kitchen Collection</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 leading-tight">
                Upgrade Your Home
                <span className="block italic font-light">Essentials With Style</span>
              </h1>
              <p className="mt-4 text-neutral-600 max-w-xl leading-relaxed">
                Discover practical, beautiful products for your home and kitchen with quality you can trust.
              </p>
              <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700">
                Browse Home & Kitchen
                <ShoppingBag size={16} />
              </button>
            </div>

            <div className="hidden lg:flex justify-end">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80"
                alt="Home and kitchen banner"
                className="h-[280px] w-[380px] rounded-2xl object-cover shadow-[0_14px_28px_rgba(0,0,0,0.14)]"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-max rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-neutral-200/70">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="mb-5 flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 lg:hidden"
            >
              Filter Products
              <SlidersHorizontal size={17} />
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-7`}>
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase mb-4">Department</h2>
                <div className="space-y-2.5">
                  {departmentOptions.map((department) => (
                    <button
                      key={department}
                      type="button"
                      onClick={() => setSelectedDepartment(department)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        selectedDepartment === department
                          ? 'bg-neutral-900 text-white shadow-md'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {department}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase mb-4">Price</h2>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max || 1}
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(Number(e.target.value))}
                  className="range range-sm"
                />
                <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
                  <span>${priceRange.min}</span>
                  <span className="font-semibold text-neutral-900">Up to ${priceLimit}</span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold tracking-wide text-neutral-900 uppercase mb-4">Rating</h2>
                <div className="space-y-2.5">
                  {ratingOptions.map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMinRating(rating)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                        minRating === rating
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{rating}+ Stars</span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="fill-current" />
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMinRating(0)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-left text-sm text-neutral-600 transition hover:bg-neutral-100"
                  >
                    Clear Rating Filter
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Home & Kitchen</h2>
                <p className="text-sm text-neutral-500 mt-1">{filteredProducts.length} items found</p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-neutral-600">
                Loading products...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((item) => (
                  <article key={item.id} className="group rounded-2xl bg-white border border-neutral-200/70 shadow-[0_8px_24px_rgba(0,0,0,0.05)] overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]">
                    <div className="relative overflow-hidden cursor-pointer" onClick={() => openProduct(item.id)}>
                      <img src={item.image} alt={item.name} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                      <button
                        type="button"
                        onClick={(event) => handleToggleFavourite(event, item.id)}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-neutral-700 shadow transition hover:bg-white hover:text-red-500"
                      >
                        <Heart size={16} className={favourites.includes(item.id) ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                    </div>

                    <div className="p-4">
                      <p className="text-xs uppercase tracking-wider text-neutral-500">{item.department}</p>
                      <h3 className="mt-1 text-base font-semibold text-neutral-900 cursor-pointer hover:underline" onClick={() => openProduct(item.id)}>
                        {item.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-1.5 text-[#007E5D]">
                        <Star size={15} className="fill-current" />
                        <span className="text-sm font-medium text-neutral-700">{item.rating}</span>
                        <span className="text-sm text-neutral-500">({item.reviews})</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-neutral-900">${item.price}</span>
                          {item.oldPrice !== null && (
                            <span className="text-sm text-neutral-400 line-through">${item.oldPrice}</span>
                          )}
                        </div>
                        <button type="button" onClick={() => handleAddToCart(item.id)} className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-900 transition hover:bg-neutral-900 hover:text-white">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
                <p>No products match your selected filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDepartment('All');
                    setMinRating(0);
                    setPriceLimit(priceRange.max || 0);
                  }}
                  className="mt-4 rounded-full bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeKitchen;

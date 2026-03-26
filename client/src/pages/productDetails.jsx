import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, MapPin, Star, ChevronDown, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart, getFavouriteIds, toggleFavourite } from '../lib/shopStorage';
import { fetchProductById } from '../lib/productsApi';
import BackButton from '../components/BackButton';

const sizes = ['6', '8', '10', '12', '14', '16', '18', '20', '22'];

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('6');
  const [activeTab, setActiveTab] = useState('details');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize('6');
    setActiveTab('details');

    const loadProduct = async () => {
      try {
        const row = await fetchProductById(id);
        setProduct(row);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    setIsWishlisted(product ? getFavouriteIds().includes(product.id) : false);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product.id);
    toast.success('Added to cart');
  };

  const handleToggleWishlist = () => {
    const added = toggleFavourite(product.id);
    setIsWishlisted(added);
    toast.success(added ? 'Added to favourites' : 'Removed from favourites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Product not found</h1>
          <p className="text-gray-500 mt-2">The selected product does not exist.</p>
          <button
            type="button"
            onClick={() => navigate('/product')}
            className="mt-6 px-5 py-2.5 rounded-lg bg-black text-white hover:opacity-90 transition"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const primaryImage = String(product.image || '').trim();
  const fallbackGalleryImage = Array.isArray(product.images)
    ? product.images
      .map((img) => String(img || '').trim())
      .find(Boolean)
    : '';
  const displayImage = primaryImage || fallbackGalleryImage;
  const showSizeSelector = product.department === 'clothing';

  const reviews = [
    {
      id: 1,
      name: 'Sara M.',
      rating: 5,
      comment: 'Great quality and fit. The fabric feels premium and looks exactly like the photos.',
    },
    {
      id: 2,
      name: 'Nadia K.',
      rating: 4,
      comment: 'Very comfortable and stylish. Delivery was fast and packaging was neat.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4] pt-24 pb-14">
      <div className="max-w-[1100px] mx-auto px-4">
        <BackButton fallback="/product" />
        <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8">
          <div className="text-xs text-gray-500 mb-6">
            Home / {product.department} / {product.name}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            <div className="bg-[#f5f5f5] rounded-md overflow-hidden h-[360px] sm:h-[430px]">
              <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold text-gray-800">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <div className="flex items-center text-[#007E5D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-current' : ''} />
                  ))}
                </div>
                <span>{product.rating}</span>
                <span>({product.reviews} reviews)</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                {product.oldPrice !== null && (
                  <span className="text-xl text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-3 text-sm">
                <span className="text-gray-600">Color: <strong>{product.color}</strong></span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>

              {showSizeSelector && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Size: {selectedSize}</div>
                  <div className="grid grid-cols-9 gap-1.5">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-8 text-xs border rounded ${
                          selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
                <button onClick={handleAddToCart} className="h-12 bg-black text-white rounded font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2">
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button onClick={handleToggleWishlist} className="h-12 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition inline-flex items-center gap-2">
                  <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
                  <span className="hidden sm:inline">{isWishlisted ? 'Remove from Wish List' : 'Add to Wish List'}</span>
                </button>
              </div>

              <button className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition">
                <MapPin size={14} /> Find in store
              </button>

              <div className="mt-5 text-sm text-gray-500 bg-[#f7f7f7] p-3 rounded">
                Enjoy FREE express and returns on eligible orders. Place your order before 6pm for next-day processing.
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex gap-5 text-sm border-b border-gray-200 pb-3 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('details')}
                className={activeTab === 'details' ? 'text-gray-900 font-medium' : 'text-gray-500'}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={activeTab === 'care' ? 'text-gray-900 font-medium' : 'text-gray-500'}
              >
                Care Guide
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={activeTab === 'reviews' ? 'text-gray-900 font-medium' : 'text-gray-500'}
              >
                Reviews
              </button>
            </div>

            {activeTab === 'details' && (
              <div>
                <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
                <ul className="mt-4 list-disc pl-5 text-sm text-gray-600 space-y-1">
                  <li>Premium fabric blend with breathable comfort</li>
                  <li>Designed for daily wear and long-lasting structure</li>
                  <li>Modern silhouette with versatile styling</li>
                </ul>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="text-sm text-gray-600 space-y-2">
                <p>Follow these care instructions to maintain quality:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Machine wash cold on gentle cycle</li>
                  <li>Wash with similar colors</li>
                  <li>Do not bleach</li>
                  <li>Hang dry or tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">{review.name}</h3>
                      <div className="flex items-center text-[#007E5D]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'fill-current' : ''} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

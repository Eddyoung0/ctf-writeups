import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const HomeReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackReviews = [
    {
      id: 'fallback-1',
      comment: 'Great quality and very fast delivery. The product matched the description perfectly.',
      user_name: 'Quickkart Customer',
      product_name: 'Home Essentials',
    },
    {
      id: 'fallback-2',
      comment: 'Checkout was smooth and support was helpful. I will definitely order again.',
      user_name: 'Happy Shopper',
      product_name: 'Electronics',
    },
    {
      id: 'fallback-3',
      comment: 'Pricing was great and packaging was secure. The experience felt reliable end-to-end.',
      user_name: 'Verified Buyer',
      product_name: 'Kitchen Products',
    },
    {
      id: 'fallback-4',
      comment: 'The product quality exceeded my expectations and delivery arrived right on time.',
      user_name: 'Aarav Singh',
      product_name: 'Vacuum Cleaner',
    },
    {
      id: 'fallback-5',
      comment: 'Customer support solved my issue quickly. Shopping here feels easy and trustworthy.',
      user_name: 'Neha Verma',
      product_name: 'Portable Speaker',
    },
    {
      id: 'fallback-6',
      comment: 'Excellent value for money. Product looked exactly like the photos on the website.',
      user_name: 'Rohan Mehta',
      product_name: 'Gaming Console',
    },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        const reviewRows = Array.isArray(response.data?.data) ? response.data.data : [];
        setReviews(reviewRows);
      } catch (error) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const minReviews = 6;
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const displayReviews = safeReviews.length >= minReviews
    ? safeReviews.slice(0, minReviews)
    : [...safeReviews, ...fallbackReviews.slice(0, minReviews - safeReviews.length)];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">What customers say</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Reviews</h2>
          {loading && (
            <p className="text-sm text-gray-500 mt-2">Loading customer reviews...</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayReviews.map((review) => (
            <article key={review.id} className="bg-[#faf8f5] border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-1 text-[#007E5D] mb-3">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={14} className="fill-current" />
                ))}
              </div>

              <p className="text-sm text-gray-700 leading-6 mb-4">"{review.comment}"</p>

              <div className="text-xs text-gray-500">
                <p className="font-semibold text-gray-800">{review.user_name}</p>
                <p>{review.product_name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeReviewsSection;

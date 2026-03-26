import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Package, ArrowRight } from "lucide-react";
import HomeReviewsSection from "../components/HomeReviewsSection";
import { fetchProducts } from '../lib/productsApi';

const Home = () => {
  const [likedProducts, setLikedProducts] = useState({});
  const [products, setProducts] = useState([]);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const navigate = useNavigate();
  const recentlyViewedRef = useRef(null);

  const categories = [
    {
      id: 1,
      name: "Clothing",
      link: '/product',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      name: "Electronics",
      link: '/product/electronics',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      name: "Groceries",
      link: '/product/groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
    },
    {
      id: 4,
      name: "Home & Kitchen",
      link: '/product/home-kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop',
    },
  ];

  const heroSlides = [
    {
      id: 1,
      title: 'SHOP COMPUTERS',
      subtitle: '& ACCESSORIES',
      bullets: [
        'Shop laptops, desktops, monitors, tablets, PC gaming',
        'Hard drives and storage, accessories and more',
      ],
      ctaLink: '/product/electronics',
      ctaLabel: 'View Electronics',
      image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Featured electronics',
      productName: 'JBL T450BT Black Headphones',
      price: '$125.00',
      oldPrice: '$258.00',
      badge: '50%',
      accent: '#007E5D',
      bgGradient: 'linear-gradient(120deg, #e5edf9 0%, #f2f6ff 55%, #e8eef9 100%)',
    },
    {
      id: 2,
      title: 'SHOP FASHION',
      subtitle: '& CLOTHING',
      bullets: [
        'Explore modern outfits, essentials, and seasonal arrivals',
        'Discover premium styles for daily comfort and confidence',
      ],
      ctaLink: '/product',
      ctaLabel: 'View Clothing',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Featured clothing',
      productName: 'Premium Casual Collection',
      price: '$89.00',
      oldPrice: '$139.00',
      badge: '35%',
      accent: '#8A3B12',
      bgGradient: 'linear-gradient(120deg, #ebe9e4 0%, #f4f3ef 55%, #e7e4dd 100%)',
    },
    {
      id: 3,
      title: 'SHOP FRESH',
      subtitle: '& GROCERIES',
      bullets: [
        'Stock up on daily essentials and pantry favorites',
        'Fresh picks with value-focused bundles every week',
      ],
      ctaLink: '/product/groceries',
      ctaLabel: 'View Groceries',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Featured groceries',
      productName: 'Fresh Grocery Basket',
      price: '$45.00',
      oldPrice: '$68.00',
      badge: '30%',
      accent: '#1D7A2E',
      bgGradient: 'linear-gradient(120deg, #e7f5e9 0%, #f3fbf4 55%, #e7f5ea 100%)',
    },
    {
      id: 4,
      title: 'SHOP HOME',
      subtitle: '& KITCHEN',
      bullets: [
        'Upgrade your home with practical daily-use essentials',
        'Kitchen and home products designed for comfort and style',
      ],
      ctaLink: '/product/home-kitchen',
      ctaLabel: 'View Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Featured home and kitchen',
      productName: 'Home Essentials Set',
      price: '$72.00',
      oldPrice: '$110.00',
      badge: '25%',
      accent: '#5E4A2F',
      bgGradient: 'linear-gradient(120deg, #f7efe6 0%, #fbf6f0 55%, #f4e9dc 100%)',
    },
  ];

  const quickLinks = [
    { label: "Recommendations for you", icon: "🎁", action: 'recent' },
    { label: "Your Orders", icon: "📦", action: 'orders' },
    { label: "Electronics\nBig Sale 20%", icon: "🔌", action: 'electronics' },
    { label: "Home & Kitchen\nBig Sale 30%", icon: "🏠", action: 'home-kitchen' },
  ];

  const categoryStrip = [
    { name: "Vacuum cleaners", label: "Big Sale 25%", icon: "🧹" },
    { name: "Xbox & Consoles", label: "Big Sale 30%", icon: "🎮" },
    { name: "Portable speakers", label: "", icon: "🔊" },
    { name: "Projectors", label: "", icon: "📽️" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [heroSlides.length]);

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

  const shuffledProducts = useMemo(() => {
    return [...products].sort(() => Math.random() - 0.5);
  }, [products]);

  const recentProducts = useMemo(() => shuffledProducts.slice(0, 5), [shuffledProducts]);
  const topSellers = useMemo(() => shuffledProducts.slice(5, 10), [shuffledProducts]);

  const toggleLike = (id) => {
    setLikedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openProduct = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product/${productId}`);
  };

  const handleQuickLinkClick = (action) => {
    if (action === 'recent') {
      recentlyViewedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (action === 'orders') {
      navigate('/orders');
      return;
    }

    if (action === 'electronics') {
      navigate('/product/electronics');
      return;
    }

    if (action === 'home-kitchen') {
      navigate('/product/home-kitchen');
    }
  };

  const openTrendyDeals = () => {
    navigate('/product/electronics');
  };

  const openPromotions = () => {
    navigate('/product/home-kitchen');
  };

  const openDeliveryInfo = () => {
    navigate('/about-us');
  };

  const ProductCard = ({ product }) => (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
      onClick={() => openProduct(product.id)}
    >
      <div className="relative overflow-hidden h-52 bg-gray-50 flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {product.saleTag && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">
            Sale
          </span>
        )}
        {product.tag && !product.saleTag && (
          <span className="absolute top-3 left-3 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded">
            {product.tag}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(product.id);
          }}
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm hover:shadow transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart
            size={16}
            className={likedProducts[product.id] ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-10">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < Math.floor(product.rating)
                  ? "fill-[#007E5D] text-[#007E5D]"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">{product.reviews}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">${Number(product.price || 0).toFixed(2)}</span>
          {product.oldPrice !== null && product.oldPrice !== undefined && (
            <span className="text-sm text-gray-400 line-through">${Number(product.oldPrice).toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );

  const currentHeroSlide = heroSlides[activeHeroSlide];

  return (
    <>
      {/* Hero Section */}
      <section
        className="pt-20 transition-all duration-500"
        style={{ backgroundImage: currentHeroSlide.bgGradient }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                {currentHeroSlide.title}
                <br />{currentHeroSlide.subtitle}
              </h1>
              <ul className="space-y-2 text-gray-600 mb-8 text-sm md:text-base">
                {currentHeroSlide.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                onClick={() => navigate(currentHeroSlide.ctaLink)}
              >
                {currentHeroSlide.ctaLabel}
              </button>

              <div className="mt-6 flex items-center gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to ${slide.title}`}
                    onClick={() => setActiveHeroSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeHeroSlide === index ? 'w-8 bg-neutral-900' : 'w-2.5 bg-neutral-300 hover:bg-neutral-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex justify-center animate-fade-in">
              <div className="relative">
                <div
                  className="absolute -top-2 right-4 lg:right-8 text-white font-bold text-lg w-16 h-16 rounded-full flex items-center justify-center z-10 shadow-lg"
                  style={{ backgroundColor: currentHeroSlide.accent }}
                >
                  {currentHeroSlide.badge}
                </div>
                <img
                  src={currentHeroSlide.image}
                  alt={currentHeroSlide.imageAlt}
                  className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-3xl drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Row */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <div
                key={i}
                onClick={() => handleQuickLinkClick(link.action)}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-sm font-medium text-gray-700 whitespace-pre-line">
                  {link.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Discover</p>
              <h2 className="text-2xl font-bold text-gray-900">Shop by categories</h2>
            </div>
            <a
              href="/product"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              All Departments <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="group cursor-pointer" onClick={() => navigate(cat.link)}>
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 h-48 md:h-56 mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 group-hover:text-[#007E5D] transition-colors text-center">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-[#f5f0e8] rounded-2xl p-6 md:p-8 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              onClick={openTrendyDeals}
            >
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                  Quickkart Basics
                </p>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                  Shop Trendy Deals, Lightning Deals,
                </h3>
                <p className="text-sm text-gray-600 mb-4">and best low-price discounts.</p>
                <span className="text-sm font-medium text-[#007E5D] hover:text-[#016B4F] flex items-center gap-1 cursor-pointer">
                  See more <ArrowRight size={14} />
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop"
                alt="Basics"
                className="w-28 h-20 md:w-32 md:h-24 object-cover rounded-xl hidden sm:block"
              />
            </div>
            <div
              className="bg-[#faf5ef] rounded-2xl p-6 md:p-8 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              onClick={openPromotions}
            >
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                  Deals & Promotions
                </p>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                  Best Deals Finder, Lightning Deals and
                </h3>
                <p className="text-sm text-gray-600 mb-4">limited-time discounts.</p>
                <span className="text-sm font-medium text-[#007E5D] hover:text-[#016B4F] flex items-center gap-1 cursor-pointer">
                  See more <ArrowRight size={14} />
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop"
                alt="Deals"
                className="w-28 h-20 md:w-32 md:h-24 object-cover rounded-xl hidden sm:block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="bg-[#faf8f5] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer hover:shadow-md transition-shadow"
            onClick={openDeliveryInfo}
          >
            <div className="max-w-lg">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Discover Quickkart</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                QUICKKART DELIVERS
                <br />TO YOU
              </h2>
              <p className="text-gray-500 mb-6 text-sm md:text-base">
                Worldwide shipping. We ship to over 100 countries and
                regions, right here on Quickkart.
              </p>
              <button
                type="button"
                onClick={openDeliveryInfo}
                className="border-2 border-gray-900 text-gray-900 px-6 py-2.5 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all text-sm"
              >
                View more
              </button>
            </div>
            <div className="shrink-0">
              <Package size={100} className="text-[#007E5D] md:w-[120px] md:h-[120px]" strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <section ref={recentlyViewedRef} className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Last viewed</p>
              <h2 className="text-2xl font-bold text-gray-900">Recently viewed</h2>
            </div>
            <a
              href="/product"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              More items <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Sellers */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Discover</p>
              <h2 className="text-2xl font-bold text-gray-900">Quickkart Top Sellers</h2>
            </div>
            <a
              href="/product"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              More items <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {topSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Comfy Styles */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-1/2 h-56 sm:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop"
                    alt="Comfy styles for her"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Comfy styles for her</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Shop Quickkart Fashion including clothing, shoes, jewelry, watches, bags and more.
                  </p>
                  <span className="text-sm font-medium text-[#007E5D] hover:text-[#016B4F] flex items-center gap-1 cursor-pointer">
                    See more <ArrowRight size={14} />
                  </span>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs bg-gray-100 rounded-full px-3 py-1 text-gray-600">Top Handbags</span>
                    <span className="text-xs text-gray-400">Big Sale 30%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-1/2 h-56 sm:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                    alt="Comfy styles for him"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Comfy styles for him</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Shop Quickkart Fashion including clothing, shoes, jewelry, watches, bags and more.
                  </p>
                  <span className="text-sm font-medium text-[#007E5D] hover:text-[#016B4F] flex items-center gap-1 cursor-pointer">
                    See more <ArrowRight size={14} />
                  </span>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs bg-gray-100 rounded-full px-3 py-1 text-gray-600">Checkered shirt</span>
                    <span className="text-xs text-gray-400">Big Sale 30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Strip */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {categoryStrip.map((cat, i) => (
              <div key={i} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow transition-shadow">
                  <span className="text-xl leading-none">{cat.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-[#007E5D] transition-colors">
                    {cat.name}
                  </p>
                  {cat.label && <p className="text-xs text-gray-400">{cat.label}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeReviewsSection />
    </>
  );
};

export default Home;
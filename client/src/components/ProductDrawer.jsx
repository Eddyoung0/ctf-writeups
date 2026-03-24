import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid } from 'lucide-react';
import ProductGrid from './ProductGrid';

const ProductDrawer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [likedProducts, setLikedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState('grid');

  // Categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Living' },
    { id: 'beauty', name: 'Beauty & Care' },
    { id: 'sports', name: 'Sports & Outdoors' },
    { id: 'books', name: 'Books & Media' },
  ];

  // All Products Data
  const allProducts = [
    // Electronics
    {
      id: 1,
      name: 'Wireless Noise-Canceling Headphones',
      price: '2,499',
      originalPrice: '4,999',
      category: 'electronics',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 1240,
      discount: 50,
      stock: 15,
      specs: ['40hr battery', 'ANC tech', 'Premium build'],
    },
    {
      id: 2,
      name: 'Premium 4K Webcam',
      price: '4,999',
      originalPrice: '8,999',
      category: 'electronics',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 856,
      discount: 44,
      stock: 22,
      specs: ['4K resolution', 'Auto focus', 'Wide angle'],
    },
    {
      id: 3,
      name: 'Smart Watch Pro Max',
      price: '6,999',
      originalPrice: '12,999',
      category: 'electronics',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 2103,
      discount: 46,
      stock: 28,
      specs: ['AMOLED display', 'GPS+5G', 'Health tracking'],
    },
    {
      id: 4,
      name: 'Portable SSD 1TB',
      price: '3,999',
      originalPrice: '7,999',
      category: 'electronics',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 945,
      discount: 50,
      stock: 35,
      specs: ['1TB storage', 'USB 3.1', 'Compact design'],
    },

    // Fashion
    {
      id: 5,
      name: 'Premium Cotton T-Shirt',
      price: '599',
      originalPrice: '1,199',
      category: 'fashion',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 523,
      discount: 50,
      stock: 50,
      specs: ['100% cotton', 'Breathable', 'Machine washable'],
    },
    {
      id: 6,
      name: 'Designer Denim Jeans',
      price: '1,499',
      originalPrice: '2,999',
      category: 'fashion',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 834,
      discount: 50,
      stock: 42,
      specs: ['Premium denim', 'Comfortable fit', 'Fading resistant'],
    },
    {
      id: 7,
      name: 'Elegant Leather Handbag',
      price: '2,999',
      originalPrice: '5,999',
      category: 'fashion',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 712,
      discount: 50,
      stock: 18,
      specs: ['Genuine leather', 'Spacious', 'Multi-compartment'],
    },
    {
      id: 8,
      name: 'Sport Running Shoes',
      price: '1,999',
      originalPrice: '3,999',
      category: 'fashion',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 1205,
      discount: 50,
      stock: 60,
      specs: ['Breathable mesh', 'Cushioned sole', 'Lightweight'],
    },

    // Home & Living
    {
      id: 9,
      name: 'Smart LED Light Bulbs (Pack of 3)',
      price: '1,299',
      originalPrice: '2,599',
      category: 'home',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1565636192335-14a6e9ff0768?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 645,
      discount: 50,
      stock: 75,
      specs: ['WiFi enabled', '16M colors', 'Voice control'],
    },
    {
      id: 10,
      name: 'Ultra-Soft Memory Foam Pillow',
      price: '899',
      originalPrice: '1,799',
      category: 'home',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1578748519223-d1a81d5f69fa?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 2341,
      discount: 50,
      stock: 120,
      specs: ['Hypoallergenic', 'Cooling gel', 'Adjustable height'],
    },
    {
      id: 11,
      name: 'Stainless Steel Cookware Set',
      price: '3,999',
      originalPrice: '7,999',
      category: 'home',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 834,
      discount: 50,
      stock: 28,
      specs: ['10-piece set', 'Induction ready', 'Heat resistant handles'],
    },

    // Beauty & Care
    {
      id: 12,
      name: 'Organic Face Care Kit',
      price: '1,599',
      originalPrice: '3,199',
      category: 'beauty',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 923,
      discount: 50,
      stock: 85,
      specs: ['All natural', '5-piece set', 'Dermatologist tested'],
    },
    {
      id: 13,
      name: 'Premium Hair Growth Serum',
      price: '899',
      originalPrice: '1,799',
      category: 'beauty',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 1456,
      discount: 50,
      stock: 110,
      specs: ['Biotin enriched', 'Paraben free', 'Fast results'],
    },

    // Sports
    {
      id: 14,
      name: 'Professional Yoga Mat',
      price: '799',
      originalPrice: '1,599',
      category: 'sports',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 1203,
      discount: 50,
      stock: 95,
      specs: ['6mm thickness', 'Non-slip', 'Eco-friendly rubber'],
    },
    {
      id: 15,
      name: 'Professional Dumbbells Set',
      price: '3,999',
      originalPrice: '7,999',
      category: 'sports',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1534438327276-ce75b9c5c0a6?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 834,
      discount: 50,
      stock: 22,
      specs: ['10-50 lbs range', 'Rubber coated', 'Ergonomic handles'],
    },

    // Books & Media
    {
      id: 16,
      name: 'Bestseller Book Bundle (5 Books)',
      price: '999',
      originalPrice: '1,999',
      category: 'books',
      isNew: true,
      image: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 645,
      discount: 50,
      stock: 65,
      specs: ['Classic literature', 'Hardcover', 'Premium binding'],
    },
    {
      id: 17,
      name: 'E-Reader Device Pro',
      price: '4,999',
      originalPrice: '9,999',
      category: 'books',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1491841573634-28fb526ea074?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 834,
      discount: 50,
      stock: 31,
      specs: ['7-inch display', 'Adjustable lighting', '8GB storage'],
    },
  ];

  useEffect(() => {
    let filtered = allProducts.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const price = parseInt(product.price.replace(/,/g, ''));
      const matchPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchCategory && matchSearch && matchPrice;
    });

    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.isNew - a.isNew);
    } else if (sortBy === 'price-low') {
      filtered = filtered.sort((a, b) => parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, '')));
    } else if (sortBy === 'price-high') {
      filtered = filtered.sort((a, b) => parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, '')));
    } else if (sortBy === 'rating') {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy, priceRange]);

  const toggleLike = (productId) => {
    setLikedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const addToCart = (product) => {
    alert(`Added "${product.name}" to cart!`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 ">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 relative right-20 w-90">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 h-fit">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Filter size={20} /> Filters
              </h3>

              {/* Search in Filters */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-8 pb-8 border-b">
                <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase">Category</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-green-500 cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm group-hover:text-green-600 transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8 pb-8 border-b">
                <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase">Price</h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-1/2 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-1/2 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Max"
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Rs {priceRange[0].toLocaleString()} - Rs {priceRange[1].toLocaleString()}
                </p>
              </div>

              {/* Sort Filter */}
              <div className="mb-8 pb-8 border-b">
                <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase">View</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Grid size={20} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Products Area */}
          <div className="lg:col-span-4">
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
                <p className="text-gray-600 mt-1">
                  Showing <span className="font-bold text-green-600">{filteredProducts.length}</span> products
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                likedProducts={likedProducts}
                onToggleLike={toggleLike}
                onAddToCart={addToCart}
              />
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-xl mb-4">No products found matching your criteria</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setPriceRange([0, 10000]);
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDrawer;

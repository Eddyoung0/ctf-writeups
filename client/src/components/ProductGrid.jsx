import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductGrid = ({ products, likedProducts, onToggleLike, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
          {/* Product Image */}
          <div className="relative overflow-hidden h-64 bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                NEW
              </div>
            )}
            {product.discount && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                -{product.discount}%
              </div>
            )}
            {/* Wishlist Button */}
            <button
              onClick={() => onToggleLike(product.id)}
              className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            >
              <Heart
                size={20}
                className={likedProducts[product.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-5">
            {/* Title */}
            <h3 className="font-bold text-gray-800 line-clamp-2 text-sm mb-3 min-h-10">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({product.reviews})</span>
            </div>

            {/* Specs - shown on hover */}
            {product.specs && (
              <div className="mb-3 hidden group-hover:block max-h-20 overflow-hidden">
                <ul className="text-xs text-gray-600 space-y-1">
                  {product.specs.slice(0, 3).map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xl font-bold text-gray-900">Rs {product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through ml-2">
                    Rs {product.originalPrice}
                  </span>
                )}
              </div>
              {product.stock && (
                <span className={`text-xs font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-[#007E5D]'}`}>
                  {product.stock} in stock
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

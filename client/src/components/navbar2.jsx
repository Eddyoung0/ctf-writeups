import React, { useState, useEffect } from 'react'
import { ChevronDown, Menu, X, ShoppingCart, Heart, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { clearAuthSession } from '../lib/auth';
import { getCartCount, getFavouriteIds, SHOP_DATA_EVENT } from '../lib/shopStorage';

const navbar2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1100);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [favouriteCount, setFavouriteCount] = useState(() => getFavouriteIds().length);
  const [cartCount, setCartCount] = useState(() => getCartCount());

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1100);
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateCounts = () => {
      setFavouriteCount(getFavouriteIds().length);
      setCartCount(getCartCount());
    };

    window.addEventListener(SHOP_DATA_EVENT, updateCounts);
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener(SHOP_DATA_EVENT, updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const menuItems = [
    {label: 'Home', dropdown: false, link: '/' },
    { label: 'Products', dropdown: true, link: '/product' },
    { label: 'About Us', dropdown: false, link: '/about-us' },
    { label: 'Contact', dropdown: false, link: '/contact' },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to log out?');
    if (!shouldLogout) return;

    clearAuthSession();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="mx-auto flex items-center justify-between w-full px-20 h-18">
        
        {/* Logo and Menu - Left Side */}
        <div className="flex items-center gap-20 h-full">
          {/* Logo */}
          <div className="flex items-center h-full cursor-pointer relative right-8" onClick={() => navigate('/')}>
            <span><FontAwesomeIcon icon={faShoppingCart} className='text-2xl px-2'/></span>
            <span className='text-gray-900 text-2xl font-bold'>Quick</span>
            <span className='text-[#007E5D] text-2xl font-bold'>kart</span>
          </div>

          {/* Left Menu */}
          <div className={`${isSmallScreen ? 'hidden' : 'flex'} items-center gap-8 h-full`}>
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                <button className="flex items-center gap-2 text-gray-700 hover:text-[#007E5D] transition-colors duration-200 text-md"
                onClick={() => {
                  if (!item.dropdown) {
                    navigate(item.link);
                  }
                }}>
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300 " />
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-10 border border-gray-200">
                    <button onClick={() => navigate('/product/electronics')} className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                      Electronics
                    </button>
                    <button onClick={() => navigate('/product/groceries')} className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                      Groceries
                    </button>
                    <button onClick={() => navigate('/product/home-kitchen')} className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                      Home & Kitchen
                    </button>
                    <button onClick={() => navigate('/product')} className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                      Clothing 
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-8 h-full">
          {/* Favourite */}
          <button className={`${isSmallScreen ? 'hidden' : 'flex'} relative items-center gap-2 text-gray-700 hover:text-[#007E5D] transition-colors duration-200`}
          onClick={() => navigate('/favourite')}
          title="Favourite">
            <Heart size={24} />
            {favouriteCount > 0 && (
              <span className="absolute -right-2 -top-1 min-w-5 h-5 px-1 rounded-full bg-[#007E5D] text-[10px] text-white grid place-items-center">
                {favouriteCount}
              </span>
            )}
          </button>

          {/* Shopping Cart */}
          <button className={`${isSmallScreen ? 'hidden' : 'flex'} relative items-center gap-2 text-gray-700 hover:text-[#007E5D] transition-colors duration-200`}
          onClick={() => navigate('/cart')}
          title="Cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 min-w-5 h-5 px-1 rounded-full bg-[#007E5D] text-[10px] text-white grid place-items-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className={`${isSmallScreen ? 'hidden' : 'relative'} profile-dropdown`}>
            <button 
              className="flex items-center gap-2 text-gray-700 hover:text-[#007E5D] transition-colors duration-200"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              title="Profile"
            >
              <User size={24} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                  View Profile
                </button>
                <button 
                  onClick={() => {
                    navigate('/orders');
                    setProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                  Your Orders
                </button>
                <button 
                  onClick={() => {
                    navigate('/change-password');
                    setProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                  Change Password
                </button>
                <button 
                  onClick={() => {
                    navigate('/help');
                    setProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors">
                  Help & Support
                </button>
                <hr className="my-1" />
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Icon - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${isSmallScreen ? 'block' : 'hidden'} text-gray-700 hover:text-gray-900 transition-colors`}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && isSmallScreen && (
        <div className="bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-4 profile-dropdown">
            {menuItems.map((item) => (
              <div key={item.label}>
                <button
                  className="w-full text-left flex items-center justify-between text-gray-700 hover:text-gray-900 py-2 text-sm"
                  onClick={() => {
                    if (!item.dropdown) {
                      navigate(item.link);
                      setProfileDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={16} />}
                </button>
                {item.dropdown && (
                  <div className="pl-4 space-y-2 py-2">
                    <button onClick={() => { navigate('/product/electronics'); setMobileMenuOpen(false); }} className="block text-left text-gray-600 hover:text-gray-900 text-sm py-1">
                      Electronics
                    </button>
                    <button onClick={() => { navigate('/product/groceries'); setMobileMenuOpen(false); }} className="block text-left text-gray-600 hover:text-gray-900 text-sm py-1">
                      Groceries
                    </button>
                    <button onClick={() => { navigate('/product/home-kitchen'); setMobileMenuOpen(false); }} className="block text-left text-gray-600 hover:text-gray-900 text-sm py-1">
                      Home & Kitchen
                    </button>
                    <button onClick={() => { navigate('/product'); setMobileMenuOpen(false); }} className="block text-left text-gray-600 hover:text-gray-900 text-sm py-1">
                      Clothing
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile Action Buttons */}
            <div className="border-t border-gray-200 pt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="min-h-11 rounded-lg border border-gray-200 flex items-center justify-center gap-2 text-gray-700 hover:text-[#007E5D] hover:border-[#007E5D] text-sm font-medium transition-colors"
                onClick={() => {
                  navigate('/favourite');
                  setProfileDropdownOpen(false);
                  setMobileMenuOpen(false);
                }}
              >
                <Heart size={20} />
                <span className="leading-none">Favourite {favouriteCount > 0 ? `(${favouriteCount})` : ''}</span>
              </button>
              <button
                type="button"
                className="min-h-11 rounded-lg border border-gray-200 flex items-center justify-center gap-2 text-gray-700 hover:text-[#007E5D] hover:border-[#007E5D] text-sm font-medium transition-colors"
                onClick={() => {
                  navigate('/cart');
                  setProfileDropdownOpen(false);
                  setMobileMenuOpen(false);
                }}
              >
                <ShoppingCart size={20} />
                <span className="leading-none">Cart {cartCount > 0 ? `(${cartCount})` : ''}</span>
              </button>
              <button
                type="button"
                className="min-h-11 rounded-lg border border-gray-200 flex items-center justify-center gap-2 text-gray-700 hover:text-[#007E5D] hover:border-[#007E5D] text-sm font-medium transition-colors"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <User size={20} />
                <span className="leading-none">Profile</span>
              </button>
            </div>

            {/* Mobile Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setProfileDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors rounded">
                  View Profile
                </button>
                <button 
                  onClick={() => {
                    navigate('/orders');
                    setProfileDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors rounded">
                  Your Orders
                </button>
                <button 
                  onClick={() => {
                    navigate('/change-password');
                    setProfileDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors rounded">
                  Change Password
                </button>
                <button 
                  onClick={() => {
                    navigate('/help');
                    setProfileDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#007E5D] hover:bg-gray-100 text-sm transition-colors rounded">
                  Help & Support
                </button>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm transition-colors rounded"
                  >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default navbar2
import React, { useState, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { label: 'Home', link: '/' },
    { label: 'Products', link: '/product', dropdown: true },
    { label: 'About Us', link: '/about-us' },
    { label: 'Contact', link: '/contact' },
  ];

  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 cursor-pointer flex items-center" onClick={goToLogin}>
            <span><FontAwesomeIcon icon={faShoppingCart} className='text-xl px-1.5'/></span>
            <span className='text-gray-900 text-xl font-bold'>Quick</span>
            <span className='text-[#007E5D] text-xl font-bold'>kart</span>
          </div>

          {/* Nav Links - Desktop */}
          <div className={`${isSmallScreen ? 'hidden' : 'flex'} items-center gap-6`}>
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  onClick={goToLogin}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                </button>
                {item.dropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-10 border border-gray-100">
                    <button onClick={goToLogin} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm">Electronics</button>
                    <button onClick={goToLogin} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm">Groceries</button>
                    <button onClick={goToLogin} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm">Home & Kitchen</button>
                    <button onClick={goToLogin} className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm">Clothing</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Auth Buttons */}
          <div className="flex items-center gap-4">
            <div className={`${isSmallScreen ? 'hidden' : 'flex'} items-center gap-5`}>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#007E5D] border border-[#007E5D] hover:bg-[#007E5D] hover:text-white transition-colors"
                onClick={goToLogin}
              >
                Sign In
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#007E5D] text-white hover:bg-[#006B4D] transition-colors"
                onClick={goToLogin}
              >
                Login
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isSmallScreen ? 'block' : 'hidden'} text-gray-700 hover:text-gray-900 transition-colors`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && isSmallScreen && (
        <div className="bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg py-2.5 px-3 text-sm font-medium transition-colors"
                onClick={goToLogin}
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-3 flex items-center gap-3 px-3">
              <button
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-[#007E5D] border border-[#007E5D] hover:bg-[#007E5D] hover:text-white transition-colors"
                onClick={goToLogin}
              >
                Sign In
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[#007E5D] text-white hover:bg-[#006B4D] transition-colors"
                onClick={goToLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
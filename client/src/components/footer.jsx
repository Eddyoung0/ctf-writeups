import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedInWithValidSession } from '../lib/auth';

const Footer = () => {
  const navigate = useNavigate();
  const isLoggedIn = isLoggedInWithValidSession();
  const guardedPath = (path) => (isLoggedIn ? path : '/login');

  const handleExternalClick = (event) => {
    if (isLoggedIn) return;
    event.preventDefault();
    navigate('/login');
  };

  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Quick<span className="text-[#007E5D]">kart</span>
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Your daily essentials delivered fast, fresh, and hassle free.
            </p>
            <p className="mt-3 text-sm text-gray-500">support@quickkart.com</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-gray-900">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to={guardedPath('/product')} className="hover:text-[#007E5D] transition-colors">Clothing</Link></li>
              <li><Link to={guardedPath('/product/electronics')} className="hover:text-[#007E5D] transition-colors">Electronics</Link></li>
              <li><Link to={guardedPath('/product/groceries')} className="hover:text-[#007E5D] transition-colors">Groceries</Link></li>
              <li><Link to={guardedPath('/product/home-kitchen')} className="hover:text-[#007E5D] transition-colors">Home & Kitchen</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-gray-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to={guardedPath('/about-us')} className="hover:text-[#007E5D] transition-colors">About Us</Link></li>
              <li><Link to={guardedPath('/contact')} className="hover:text-[#007E5D] transition-colors">Contact</Link></li>
              <li><Link to={guardedPath('/help')} className="hover:text-[#007E5D] transition-colors">Help Center</Link></li>
              <li><Link to={guardedPath('/previewpage')} className="hover:text-[#007E5D] transition-colors">Preview</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-gray-900">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link to="/login" className="hover:text-[#007E5D] transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-[#007E5D] transition-colors">Register</Link></li>
              <li><Link to="/forgot-password" className="hover:text-[#007E5D] transition-colors">Forgot Password</Link></li>
              <li><Link to={guardedPath('/change-password')} className="hover:text-[#007E5D] transition-colors">Change Password</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Quickkart. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" onClick={handleExternalClick} className="text-gray-500 hover:text-[#007E5D] transition-colors">Facebook</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" onClick={handleExternalClick} className="text-gray-500 hover:text-[#007E5D] transition-colors">Instagram</a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" onClick={handleExternalClick} className="text-gray-500 hover:text-[#007E5D] transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
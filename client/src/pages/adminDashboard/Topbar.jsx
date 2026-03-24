import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../../lib/auth';

const Topbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to log out?');
    if (!shouldLogout) return;

    clearAuthSession();
    navigate('/');
  };

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  return (
    <header className="h-[70px] bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-7 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-700 p-2"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Admin profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2.5 cursor-pointer px-2.5 py-1.5 rounded-[10px] hover:bg-[#F5F6FA] transition"
          >
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=007E5D&color=fff&size=36"
              alt="Admin"
              className="w-9 h-9 rounded-[10px] object-cover"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold">Admin User</span>
              <span className="text-[0.72rem] text-gray-500">Super Admin</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 hidden md:block transition-transform ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {profileOpen && (
            <div className="absolute top-[50px] right-0 w-[180px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-2 animate-[fadeSlideDown_0.2s_ease]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left text-sm px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

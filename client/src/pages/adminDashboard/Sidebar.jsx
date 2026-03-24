import React from 'react';
import {
  LayoutDashboard, ShoppingBag, Users, BoxIcon, Tags,
  Truck, X, Zap, ShieldCheck, UserCircle2
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: ShoppingBag, label: 'Orders', key: 'orders' },
  { icon: Users, label: 'Users', key: 'users' },
  { icon: BoxIcon, label: 'Products', key: 'products' },
  { icon: Tags, label: 'Categories', key: 'categories' },
  { icon: Truck, label: 'Delivery Tracking', key: 'delivery' },
];

const Sidebar = ({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-gray-100 flex flex-col justify-between z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Top section */}
        <div className="px-5 pt-7">
          {/* Brand */}
          <div className="flex items-center justify-between mb-9">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-[#007E5D] to-[#00E4A8] rounded-xl flex items-center justify-center text-white">
                <Zap size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">QuickKart</span>
            </div>
            <button
              className="md:hidden p-1 text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {menuItems.map(({ icon: Icon, label, key }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveMenu(key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 px-4 py-[11px] rounded-[10px] text-[0.935rem] font-medium transition-all duration-200 w-full text-left ${
                  activeMenu === key
                    ? 'bg-[#007E5D] text-white shadow-[0_4px_14px_rgba(0,126,93,0.35)]'
                    : 'text-gray-500 hover:bg-[rgba(0,126,93,0.08)] hover:text-[#007E5D]'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom profile section */}
        <div className="px-5 pb-6">
          <div className="rounded-2xl bg-linear-to-br from-[#007E5D] via-[#00B98A] to-[#00E4A8] p-4 text-white shadow-[0_10px_28px_rgba(0,126,93,0.32)]">
            <div className="flex items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=ffffff&color=007E5D&size=80"
                alt="Admin profile"
                className="w-11 h-11 rounded-xl border border-white/50 object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-[0.72rem] text-white/85 truncate">admin@quickcart.com</p>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide uppercase">
              <ShieldCheck size={12} /> Super Admin
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveMenu('profile');
                setSidebarOpen(false);
              }}
              className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition border ${
                activeMenu === 'profile'
                  ? 'bg-white text-[#007E5D] border-white'
                  : 'bg-white/10 text-white border-white/40 hover:bg-white/20'
              }`}
            >
              <UserCircle2 size={16} /> Profile
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

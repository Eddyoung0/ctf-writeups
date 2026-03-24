import React from 'react';
import { Mail, ShieldCheck, UserCircle2, BadgeCheck } from 'lucide-react';
import { getAuthUser } from '../../lib/auth';

const AdminProfilePage = () => {
  const user = getAuthUser() || {};
  const fullName = user.name || user.fullName || 'Admin User';
  const email = user.email || 'admin@quickkart.com';
  const role = String(user.role || 'admin').toLowerCase() === 'admin' ? 'Admin' : 'User';

  return (
    <main className="flex-1 p-4 sm:p-7">
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-bold tracking-tight">Admin Profile</h1>
        <p className="text-gray-500 text-sm mt-1">View your administrator account information.</p>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_8px_28px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="bg-linear-to-r from-[#007E5D] via-[#00B98A] to-[#00E4A8] px-6 py-7 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">Administrator</p>
          <h2 className="mt-2 text-2xl font-semibold">Profile Overview</h2>
          <p className="mt-1 text-sm text-white/85">Secure account details for admin operations.</p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="rounded-xl border border-[#cfeee4] bg-[#eefbf6] p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white text-[#007E5D] border border-[#bde8d9] flex items-center justify-center">
              <UserCircle2 size={32} />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{fullName}</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
              <p className="mt-2 text-sm font-medium text-gray-900 inline-flex items-center gap-2">
                <UserCircle2 size={16} /> {fullName}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
              <p className="mt-2 text-sm font-medium text-gray-900 inline-flex items-center gap-2 break-all">
                <Mail size={16} /> {email}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
              <p className="mt-2 text-sm font-medium text-gray-900 inline-flex items-center gap-2">
                <ShieldCheck size={16} /> {role}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
              <p className="mt-2 text-sm font-medium text-gray-900 inline-flex items-center gap-2">
                <BadgeCheck size={16} /> Verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminProfilePage;

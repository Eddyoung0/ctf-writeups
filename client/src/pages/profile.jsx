import React, { useEffect, useMemo } from 'react';
import { Mail, User, CalendarDays, ShieldCheck, UserCircle2, BadgeCheck } from 'lucide-react';
import { getAuthUser, isAuthenticated } from '../lib/auth';
import BackButton from '../components/BackButton';

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userInfo = useMemo(() => {
    if (!isAuthenticated()) return {};

    const sessionUser = getAuthUser();
    return sessionUser && typeof sessionUser === 'object' ? sessionUser : {};
  }, []);

  const rawRole = String(userInfo.role || userInfo.userRole || '').toLowerCase();
  const isAdminProfile = rawRole === 'admin';

  const extractedName =
    userInfo.name || userInfo.fullName || userInfo.username || userInfo.userName || '';
  const extractedEmail = userInfo.email || userInfo.userEmail || userInfo.mail || '';

  // Keep this page user-only: never show admin identity details in the profile section.
  const fullName = !isAdminProfile && extractedName ? extractedName : 'QuickKart User';
  const email = !isAdminProfile && extractedEmail ? extractedEmail : 'No email available';

  const avatarUrl = userInfo.avatar || userInfo.avatarUrl || userInfo.profileImage || '';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e8f8f3_0,#f7fbfa_35%,#f8f8f6_70%)] pt-24 pb-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
        <BackButton fallback="/" />
        <div className="rounded-3xl bg-white border border-emerald-100 shadow-[0_18px_48px_rgba(10,77,58,0.12)] overflow-hidden">
          <div className="bg-linear-to-r from-[#0a6b53] via-[#0b8b69] to-[#15b184] px-6 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.24em] opacity-80">Account Center</p>
            <h1 className="mt-2 text-3xl font-semibold">My Profile</h1>
            <p className="mt-2 text-sm opacity-90">Manage your personal details and keep your account up to date.</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="rounded-2xl border border-emerald-100 bg-linear-to-r from-emerald-50 to-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-white shadow-lg bg-emerald-100 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`${fullName} profile`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <UserCircle2 size={48} className="text-emerald-700" />
                  )}
                  {initials ? (
                    <span className="absolute -bottom-2 -right-2 rounded-full bg-emerald-700 text-white text-xs font-semibold px-2 py-1">
                      {initials}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">Welcome Back</p>
                <h2 className="mt-1 text-2xl font-semibold text-neutral-900 truncate">{fullName}</h2>
                <p className="mt-1 text-sm text-neutral-600 break-all">{email}</p>
              </div>

              <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-emerald-700 text-white px-3 py-1.5 text-xs font-medium">
                <BadgeCheck size={14} /> Verified User
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 hover:bg-white hover:shadow-md transition">
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Full Name</p>
              <p className="mt-2 text-base font-medium text-neutral-900 inline-flex items-center gap-2">
                <User size={16} /> {fullName}
              </p>
            </div>

              <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 hover:bg-white hover:shadow-md transition">
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Email</p>
              <p className="mt-2 text-base font-medium text-neutral-900 inline-flex items-center gap-2 break-all">
                <Mail size={16} /> {email}
              </p>
            </div>

              <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 hover:bg-white hover:shadow-md transition">
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Account Type</p>
              <p className="mt-2 text-base font-medium text-neutral-900 inline-flex items-center gap-2">
                <ShieldCheck size={16} /> Customer
              </p>
            </div>

              <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 hover:bg-white hover:shadow-md transition">
              <p className="text-xs text-neutral-500 uppercase tracking-wide">Joined</p>
              <p className="mt-2 text-base font-medium text-neutral-900 inline-flex items-center gap-2">
                <CalendarDays size={16} /> Active member
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

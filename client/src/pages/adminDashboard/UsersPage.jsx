import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data?.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const adminUsers = users.filter((user) => String(user.role || '').toLowerCase() === 'admin');
  const normalUsers = users.filter((user) => String(user.role || '').toLowerCase() !== 'admin');

  const handleDeleteUser = async (id) => {
    const shouldDelete = window.confirm('Delete this user account? This action cannot be undone.');
    if (!shouldDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const renderRows = (items, emptyMessage) => {
    if (!items.length) {
      return (
        <tr>
          <td colSpan={7} className="py-3.5 px-4 text-sm text-gray-400">
            {emptyMessage}
          </td>
        </tr>
      );
    }

    return items.map((user, index) => (
      <tr key={user.id} className="border-b border-gray-50 last:border-b-0">
        <td className="py-3.5 px-4 text-sm text-gray-700">{index + 1}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700">{user.id}</td>
        <td className="py-3.5 px-4 text-sm font-semibold text-gray-800">{user.name || '-'}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700">{user.email || '-'}</td>
        <td className="py-3.5 px-4 text-sm text-gray-700 capitalize">{user.role || 'user'}</td>
        <td className="py-3.5 px-4 text-sm text-gray-500">
          {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}
        </td>
        <td className="py-3.5 px-4 text-sm text-gray-700">
          <button
            type="button"
            onClick={() => handleDeleteUser(user.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={12} /> Delete
          </button>
        </td>
      </tr>
    ));
  };

  const renderMobileCards = (items, emptyMessage) => {
    if (!items.length) {
      return <p className="text-sm text-gray-400 px-1">{emptyMessage}</p>;
    }

    return items.map((user, index) => (
      <article key={user.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500">No. {index + 1}</p>
            <h3 className="text-sm font-semibold text-gray-800 mt-1 wrap-break-word">{user.name || '-'}</h3>
            <p className="text-xs text-gray-500 mt-0.5">ID: {user.id}</p>
          </div>
          <span className="text-[0.68rem] px-2 py-1 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide">
            {user.role || 'user'}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-gray-700">
          <p className="break-all"><span className="font-medium text-gray-600">Email:</span> {user.email || '-'}</p>
          <p><span className="font-medium text-gray-600">Created:</span> {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</p>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => handleDeleteUser(user.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </article>
    ));
  };

  return (
    <main className="flex-1 p-4 sm:p-7">
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-bold tracking-tight">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Existing user data (excluding passwords), separated by role.</p>
      </div>

      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No users found.</div>
        ) : (
          <>
            <div className="md:hidden p-4 space-y-5 bg-[#F9FAFC]">
              <section>
                <p className="mb-3 py-2 px-3 text-xs font-semibold tracking-wider text-teal-700 uppercase bg-teal-50 rounded-lg border border-teal-100">
                  Admins ({adminUsers.length})
                </p>
                <div className="space-y-3">
                  {renderMobileCards(adminUsers, 'No admin accounts found.')}
                </div>
              </section>

              <section>
                <p className="mb-3 py-2 px-3 text-xs font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-50 rounded-lg border border-emerald-100">
                  Users ({normalUsers.length})
                </p>
                <div className="space-y-3">
                  {renderMobileCards(normalUsers, 'No user accounts found.')}
                </div>
              </section>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F9FAFC]">
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">No</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">ID</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Name</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Email</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Role</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Created</th>
                    <th className="text-left text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-teal-50/60 border-y border-teal-100">
                    <td colSpan={7} className="py-2.5 px-4 text-xs font-semibold tracking-wider text-teal-700 uppercase">
                      Admins ({adminUsers.length})
                    </td>
                  </tr>
                  {renderRows(adminUsers, 'No admin accounts found.')}

                  <tr className="bg-emerald-50/70 border-y border-emerald-100">
                    <td colSpan={7} className="py-2.5 px-4 text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                      Users ({normalUsers.length})
                    </td>
                  </tr>
                  {renderRows(normalUsers, 'No user accounts found.')}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </main>
  );
};

export default UsersPage;

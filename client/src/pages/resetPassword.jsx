import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const email = useMemo(() => String(location.state?.email || '').trim(), [location.state?.email]);
  const resetToken = useMemo(() => String(location.state?.resetToken || '').trim(), [location.state?.resetToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !resetToken) {
      setError('Reset session is missing. Please restart forgot password flow.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        resetToken,
        newPassword: password,
      });
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white px-6 py-24">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Password Updated</h1>
          <p className="mt-3 text-sm text-gray-600">
            Your password has been changed successfully. Please login with your new password.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-full bg-[#007E5D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#006B4D]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Set a new password for {email || 'your account'}.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#007E5D]"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#007E5D]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#007E5D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#006B4D] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

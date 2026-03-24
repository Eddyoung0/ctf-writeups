import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailFromState = useMemo(
    () => String(location.state?.email || '').trim(),
    [location.state?.email]
  );

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError('');

    if (!emailFromState) {
      setError('Missing email. Please restart from change password page.');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-password-otp', {
        email: emailFromState,
        otp,
      });
      const resetToken = String(response.data?.resetToken || '');
      if (!resetToken) {
        throw new Error('Reset token missing from server response.');
      }
      navigate('/change-password/reset', { state: { email: emailFromState, resetToken } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit OTP sent to {emailFromState || 'your email'}.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-700">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-full border border-gray-300 px-4 py-3 text-center tracking-[0.35em] text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#007E5D]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#007E5D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#006B4D] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/change-password')}
          className="mt-5 w-full text-sm text-gray-600 transition hover:text-[#007E5D]"
        >
          Back to Change Password
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;

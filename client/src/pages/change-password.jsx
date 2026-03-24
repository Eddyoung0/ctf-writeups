import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import forgotPasswordSvg from "../img/forgotpass.png";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const targetEmail = email.trim();
      await axios.post("http://localhost:5000/api/auth/change-password", { email: targetEmail });
      setEmail("");
      navigate('/change-password/otp', { state: { email: targetEmail } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white transition-colors duration-300">
      {/* Header with Logo and Register Link */}
      {/* Main Content */}
      <div className="grow flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Illustration */}
          <div className="text-center mb-12">
            <img
              src={forgotPasswordSvg}
              alt="Change password"
              className="h-64 mx-auto"
            />
          </div>

          {/* Content */}
          <div className="text-center flex flex-col relative bottom-10">
            {/* Heading */}
            <h1 className="text-4xl font-bold text-black mb-4">
              Change your password
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm">
              Enter your email to receive a one-time password (OTP) for resetting your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. username@quickkart.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none 
                focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007E5D] hover:bg-gray-900 text-white font-semibold py-3 rounded-full transition duration-200"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="text-black text-md flex w-full items-center justify-center gap-2 transition-colors duration-300 hover:underline hover:text-[#007E5D]"
            >
              <span>← Back to home page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forgotPassword;

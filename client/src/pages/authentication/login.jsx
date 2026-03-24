import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, EyeOff, ChevronDown} from 'lucide-react'
import LoginSvg from '../../img/authenticationImg/login.png';
import { setAuthSession } from '../../lib/auth';
import { hydrateCartFromBackend } from '../../lib/shopStorage';

const login = () => {
  const [showPassword, setShowPassword] = useState(false); 
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('user');

  const handleLogin = async(e) =>{
    e.preventDefault();

    try{
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });

      if (response.data.success) {
        setAlertMessage(response.data.message);
        setShowAlert(true);

        // Store session with a 3-day expiry
        if (response.data.token) {
          setAuthSession(
            response.data.token,
            response.data.user || {},
            undefined,
            response.data.serverSessionId || ''
          );
          await hydrateCartFromBackend();
        }

        const redirectPath = String(response.data?.user?.role || '').toLowerCase() === 'admin'
          ? '/admin/dashboard'
          : '/';

        setTimeout(() => {
          setShowAlert(false);
          window.location.href = redirectPath;
        }, 1000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="h-screen w-full flex relative">
    {/*Success message */}
    {showAlert && (
      <div role="alert" className="alert alert-success fixed top-4 right-4 z-50 w-120 max-w-sm shadow-lg animate-slide-in-right">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-10 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{alertMessage}</span>
          <button 
            onClick={() => setShowAlert(false)}
            className="btn btn-sm btn-ghost"
          >
            ✕
          </button>
        </div>
    )}
      {/* Left section - Gradient background */}
      <div className="w-[50%] hidden lg:flex justify-center p-20 flex-col items-center sm:px-20 py-15 animate-fade-in"
        style={{ background: 'linear-gradient(135deg, #007E5D 40%, #00E4A8 100%)' }}>
        <div className="px-5 py-3 w-auto text-center text-white animate-fade-in-delay-2">
          <h1 className="text-3xl font-normal tracking-wide w-60 mt-5">Welcome Back to Quickkart</h1>
        </div>
        <img src={LoginSvg} alt="Login" width={400} className="animate-fade-in-delay-3" />
        <div className="px-5 py-3 w-auto text-center text-white animate-fade-in-delay-4">
          <p className="text-md mt-5 w-100 font-extralight">Your daily essentials are just a click away. Log in to continue shopping, track your orders, and enjoy fast and hassle-free grocery delivery.</p>
        </div>
      </div>

      {/* Right section - Login form */}
      <div className="w-full lg:w-[45%] flex justify-center items-center px-8 sm:px-20 py-24 animate-fade-in">
        <div className="w-750 max-w-md animate-slide-up">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 animate-fade-in-delay-1">
            <ShoppingCart className="w-8 h-8 text-[#007E5D]" />
            <span className="text-2xl font-bold">Quick<span className="text-[#007E5D]">kart</span></span>
          </div>

          {/* Welcome text */}
          <h1 className="text-4xl font-semibold mb-2 animate-fade-in-delay-2">Welcome,</h1>
          <h1 className="text-4xl font-semibold mb-6 animate-fade-in-delay-2">Back!</h1>
          
          {/* Sign up link */}
          <p className="text-gray-600 mb-8 font-light animate-fade-in-delay-3">
            Don't have an account? <Link to="/register" className="text-[#007E5D] hover:underline">Sign Up</Link>
          </p>

          {/* Form */}
          <form className="animate-fade-in-delay-4" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E5D] focus:border-transparent"
                id="email"
                type="email"
                placeholder=""
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E5D] focus:border-transparent"
                  id="password"
                  type={showPassword? "text" : "password"}
                  placeholder=""
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className = 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007E5D] focus:outline-none cursor-pointer'>
                 {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="login-role">
                Login As
              </label>
              <div className="relative">
                <select
                  id="login-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none py-3 pl-4 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E5D] focus:border-transparent bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="text-right mb-6">
              <Link to="/forgot-password" className="text-sm text-[#007E5D] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              className="w-full bg-[#007E5D] hover:bg-[#006B4D] text-white font-light py-3 px-4 rounded-lg transition duration-300 cursor-pointer"
              type="submit" 
              >
              Sign In
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default login
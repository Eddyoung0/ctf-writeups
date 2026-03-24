import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, EyeOff, ChevronDown } from 'lucide-react'
import registerSvg from '../../img/authenticationImg/register.png';
import axios from 'axios';
import { setAuthSession } from '../../lib/auth';


const register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const [role, setRole] = useState('user');

const clickRegister = async(e) =>{
  e.preventDefault(); // Prevent form refresh
  
  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
      role,
    });
    alert(response.data.message);
    
    if(response.data.success){
      // Store session with a 3-day expiry if token is returned
      if (response.data.token) {
        setAuthSession(response.data.token, response.data.user || {});
      }
      //redirect to login page
      window.location.href = "/login";
    }
  } catch (err){ 
    alert(err.response?.data?.message || "Registration failed");    
  }
}
  return (
    <>
     <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left section - Login form */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-4 sm:px-8 py-8 sm:py-12 animate-fade-in">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 animate-fade-in-delay-1">
            <ShoppingCart className="w-8 h-8 text-[#007E5D]" />
            <span className="text-2xl font-bold">Quick<span className="text-[#007E5D]">kart</span></span>
          </div>

          {/* Welcome text */}
          <h1 className="text-4xl font-semibold mb-2 animate-fade-in-delay-2">Create an</h1>
          <h1 className="text-4xl font-semibold mb-6 animate-fade-in-delay-2">account</h1>
          
          {/* Sign up link */}
          <p className="text-gray-600 mb-8 font-light animate-fade-in-delay-3">
            Already have an account? <Link to="/login" className="text-[#007E5D] hover:underline cusor-pointer">Sign In</Link>
          </p>

          {/* Form */}
          <form className="animate-fade-in-delay-4"
          onSubmit={clickRegister}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="email">
                Username
              </label>
              <input
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E5D] focus:border-transparent"
                id="username"
                type="text"
                placeholder=""
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  required
                  onChange = {(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007E5D] focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-2" htmlFor="register-role">
                Register As
              </label>
              <div className="relative">
                <select
                  id="register-role"
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

            <div className="text-left mb-5 gap-2 flex items-center">
              {/* add a checkbox icon */}
               <input type="checkbox" className='cursor-pointer'/>
              <p className="text-sm text-gray-500">
                Remember Me
              </p>
            </div>

            <button
              className="w-full bg-[#007E5D] hover:bg-[#006B4D] text-white font-light py-3 px-4 rounded-lg transition duration-300 cursor-pointer"
              type="submit"
              >
              Sign Up
            </button>
          </form>
        </div>
      </div>

       {/* Right section - Gradient background */}
      <div className="w-full md:w-1/2 hidden md:flex justify-center p-8 md:p-20 flex-col items-center animate-fade-in-right"
        style={{ background: 'linear-gradient(135deg, #007E5D 40%, #00E4A8 100%)' }}>
        <div className="px-5 py-3 w-auto text-center text-white animate-fade-in-delay-2">
          <h1 className="text-3xl font-medium tracking-wide w-80 mt-5">Create Your Quickkart Account</h1>
        </div>
        <img src={registerSvg} alt="Register" width={400} className="animate-fade-in-delay-3 max-w-xs md:max-w-sm" />
        <div className="px-5 py-3 w-auto text-center text-white animate-fade-in-delay-4">
          <p className="text-md mt-5 w-100 font-extralight">Join QuickKart to shop fresh groceries anytime, anywhere. Sign up to get instant access to exclusive deals, quick checkout, and real-time order tracking.</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default register;
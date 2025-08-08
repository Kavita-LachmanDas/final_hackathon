import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { setToken, setUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, Sparkles, ArrowRight, AlertCircle, CheckCircle, X } from 'lucide-react';

const AnimatedLoginForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success', 'error'
    message: ''
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  const hideNotification = () => {
    setNotification({ show: false, type: '', message: '' });
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isLogin) {
      await handleLogin(e);
    } else {
      await handleSignup(e);
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    try {
      console.log("Sending formData:", formData);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        formData
      );

      console.log("Response:", data.message);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: ""
        });
        showNotification('success', 'Account created successfully! Welcome aboard! 🎉');
        setTimeout(() => navigate("/"), 1500);
      } else {
        showNotification('error', data.message || 'Signup failed. Please try again.');
        console.log("Signup Fail ", data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Network error. Please check your connection.';
      showNotification('error', errorMessage);
      console.log("Signup Failed: ", error.message);
    }
  };

  const handleLogin = async (e) => {
    try {
      console.log("Sending formData:", formData);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {email: formData.email, password: formData.password}
      );

      console.log("Response login>>>>:", data.message);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: ""
        });
        showNotification('success', `Welcome back! Redirecting... 🚀`);
        setTimeout(() => navigate("/"), 1500);
      } else {
        showNotification('error', data.message || 'Login failed. Please check your credentials.');
        console.log("login Fail ", data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Network error. Please check your connection.';
      showNotification('error', errorMessage);
      console.log("login Failed: ", error.message);
    }
  };

  const handleForgetPassword = async () => {
    if (!formData.email) {
      showNotification('error', 'Please enter your email address first.');
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forget-password`, {
        email: formData.email
      });

      if (data.success) {
        showNotification('success', 'Reset password email sent! Check your inbox. 📧');
        setFormData({
          ...formData,
          email: "",
        });
      } else {
        showNotification('error', data.message || 'Failed to send reset email.');
        console.log("Forget password failed>>>>>>>>>:", data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Network error. Please try again.';
      showNotification('error', errorMessage);
      console.log("Forget password failed:", error.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", contact: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500/90 text-white' 
            : 'bg-red-500/90 text-white'
        } backdrop-blur-sm animate-slide-in`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button 
            onClick={hideNotification}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all duration-500 hover:scale-105">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in">
              {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
            </h2>
            <p className="text-gray-300 animate-fade-in-delay">
              {isLogin ? 'Sign in to your account' : 'Create your new account'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name Field (Signup Only) */}
            <div className={`transform transition-all duration-500 ${!isLogin ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 h-0 overflow-hidden'}`}>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Contact Field (Signup Only) */}
            <div className={`transform transition-all duration-500 ${!isLogin ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 h-0 overflow-hidden'}`}>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  type="text"
                  placeholder="Contact Number"
                  className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
            </div>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgetPassword}
                  className="text-sm text-purple-300 hover:text-purple-100 transition-colors hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div
              onClick={handleSubmit}
              className={`w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer group relative overflow-hidden ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </div>

            {/* Toggle Mode */}
            <div className="text-center pt-4">
              <p className="text-gray-300 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <div
                onClick={toggleMode}
                className="text-purple-300 hover:text-purple-100 font-semibold transition-colors hover:underline mt-1 cursor-pointer"
              >
                {isLogin ? 'Sign Up Now' : 'Sign In Instead'}
              </div>
            </div>
            </div>
        </div>

        {/* Social Login Options */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-110">
              <span className="text-xl">🌟</span>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-110">
              <span className="text-xl">🚀</span>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-110">
              <span className="text-xl">✨</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateX(100%); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AnimatedLoginForm;
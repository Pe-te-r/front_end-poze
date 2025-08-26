import { createFileRoute } from '@tanstack/react-router'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sun, Moon, Phone, Lock } from 'lucide-react';

const LoginPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Apply theme class to body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Login attempted with:', { phoneNumber, password });
    // Here you would typically integrate with your API
  };

  // Format Kenyan phone number
  const formatPhoneNumber = (value: any) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Kenyan phone number format: +254 XXX XXX XXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `+254 ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 9) {
      return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else {
      return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 12)}`;
    }
  };

  const handlePhoneChange = (e: any) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDark ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Sign in to your account
          </motion.p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <div className={`relative rounded-md shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="+254 XXX XXX XXX"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className={`block w-full pl-10 pr-3 py-3 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                required
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className={`relative rounded-md shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-10 py-3 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <Eye size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </button>
            </div>
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className={`font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Forgot password?
              </a>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Sign in
            </button>
          </motion.div>
        </form>

        {/* Sign Up Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <a href="#" className={`font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};


export const Route = createFileRoute('/(auth)/Login')({
  component: LoginPage,
})


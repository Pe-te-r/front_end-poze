import { createFileRoute, Link } from '@tanstack/react-router'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Phone, Lock, User, Key } from 'lucide-react';
import { useTheme } from '@/utility/ThemeProvider';

const RegisterPage = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    invitationCode: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    invitationCode: ''
  });

  // Get invitation code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const invitationCode = urlParams.get('invitation_code');
    if (invitationCode) {
      setFormData(prev => ({ ...prev, invitationCode }));
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Format Kenyan phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      invitationCode: ''
    };

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+254 \d{3} \d{3} \d{3}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Invitation code validation
    if (!formData.invitationCode.trim()) {
      newErrors.invitationCode = 'Invitation code is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Registration data:', formData);
      // Here you would typically integrate with your API
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2"
          >
            Create Account
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Join us and start your journey
          </motion.p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <div className={`relative rounded-md shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${errors.firstName ? 'ring-2 ring-red-500' : ''}`}
                required
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </motion.div>

          {/* Phone Number Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
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
                name="phone"
                type="tel"
                placeholder="+254 XXX XXX XXX"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`block w-full pl-10 pr-3 py-3 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                required
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-10 py-3 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${errors.password ? 'ring-2 ring-red-500' : ''}`}
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-2"
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <div className={`relative rounded-md shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-10 py-3 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <Eye size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </motion.div>

          {/* Invitation Code Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <label htmlFor="invitationCode" className="block text-sm font-medium">
              Invitation Code
            </label>
            <div className={`relative rounded-md shadow-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="invitationCode"
                name="invitationCode"
                type="text"
                placeholder="Enter your invitation code"
                value={formData.invitationCode}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border-0 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-300 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} ${errors.invitationCode ? 'ring-2 ring-red-500' : ''}`}
                required
              />
            </div>
            {errors.invitationCode && (
              <p className="text-red-500 text-xs mt-1">{errors.invitationCode}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Create Account
            </button>
          </motion.div>
        </form>

        {/* Login Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/Login" className={`font-medium hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};


export const Route = createFileRoute('/(auth)/Register')({
  component: RegisterPage,
})


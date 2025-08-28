// components/Header.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Users, 
  ClipboardList, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Wallet,
  CreditCard
} from 'lucide-react';
import { useTheme } from '@/utility/ThemeProvider';
import { useAuthStore } from '@/store/authStore';
import { Link } from '@tanstack/react-router';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { data, isAuthenticated, logoutUserState } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Navigation items - easily customizable
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Levels', path: '/levels', icon: <BarChart3 size={18} /> },
    { name: 'Team', path: '/team', icon: <Users size={18} /> },
    { name: 'Task', path: '/task', icon: <ClipboardList size={18} /> },
  ];

  // Account dropdown items for authenticated users
  const authenticatedAccountItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Profile', path: '/profile', icon: <User size={16} /> },
    { name: 'Deposit', path: '/deposit', icon: <CreditCard size={16} /> },
    { name: 'Withdraw', path: '/withdraw', icon: <Wallet size={16} /> },
    { 
      name: 'Logout', 
      action: () => {
        logoutUserState();
        setIsAccountDropdownOpen(false);
      }, 
      icon: <LogOut size={16} /> 
    },
  ];

  // Account dropdown items for unauthenticated users
  const unauthenticatedAccountItems = [
    { name: 'Login', path: '/login', icon: <LogIn size={16} /> },
    { name: 'Register', path: '/register', icon: <UserPlus size={16} /> },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-yellow-400 text-yellow-900'} shadow-md`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-yellow-500' : 'bg-yellow-600'}`}>
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-xl font-bold">Logo</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-300 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-yellow-300'}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} transition-colors`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Account Dropdown - Only show if user is authenticated */}
            {isAuthenticated && (
              <div className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-md ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'} transition-colors`}
                  aria-label="Account options"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {data?.userId ? `User #${data.userId.slice(-4)}` : 'Account'}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isAccountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${isDark ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5`}
                    >
                      {authenticatedAccountItems.map((item) => (
                        <div key={item.name}>
                          {item.path ? (
                            <Link
                              to={item.path}
                              className={`flex items-center space-x-2 px-4 py-2 text-sm ${isDark ? 'hover:bg-gray-700' : 'hover:bg-yellow-100'}`}
                              onClick={() => setIsAccountDropdownOpen(false)}
                            >
                              {item.icon}
                              <span>{item.name}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={item.action}
                              className={`w-full text-left flex items-center space-x-2 px-4 py-2 text-sm ${isDark ? 'hover:bg-gray-700' : 'hover:bg-yellow-100'}`}
                            >
                              {item.icon}
                              <span>{item.name}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Show login/register buttons if not authenticated */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/Login"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${isDark ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-yellow-600 hover:bg-yellow-700'} text-white`}
                >
                  Login
                </Link>
                <Link
                  to="/Rgiegister"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-yellow-100'} ${isDark ? 'text-white' : 'text-yellow-900'}`}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full md:hidden ${isDark ? 'bg-gray-700' : 'bg-yellow-500'}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 md:hidden ${isDark ? 'bg-gray-800' : 'bg-yellow-100'} rounded-lg overflow-hidden`}
            >
              <nav className="py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-yellow-200'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Account options in mobile menu */}
                <div className="border-t mt-2 pt-2">
                  {isAuthenticated ? (
                    <>
                      <div className={`px-4 py-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-yellow-700'}`}>
                        Logged in as User #{data?.userId?.slice(-4)}
                      </div>
                      {authenticatedAccountItems.map((item) => (
                        <div key={item.name}>
                          {item.path ? (
                            <Link
                              to={item.path}
                              className={`flex items-center space-x-2 px-4 py-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-yellow-200'}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.icon}
                              <span>{item.name}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={() => {
                                item.action?.();
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full text-left flex items-center space-x-2 px-4 py-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-yellow-200'}`}
                            >
                              {item.icon}
                              <span>{item.name}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    unauthenticatedAccountItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center space-x-2 px-4 py-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-yellow-200'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
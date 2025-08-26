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
  UserPlus
} from 'lucide-react';
import { useTheme } from '@/utility/ThemeProvider';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Navigation items - easily customizable
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Levels', path: '/levels', icon: <BarChart3 size={18} /> },
    { name: 'Team', path: '/team', icon: <Users size={18} /> },
    { name: 'Task', path: '/task', icon: <ClipboardList size={18} /> },
    { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  // Account dropdown items
  const accountItems = [
    { name: 'Login', path: '/login', icon: <LogIn size={16} /> },
    { name: 'Register', path: '/register', icon: <UserPlus size={16} /> },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}>
              <span className="text-white font-bold">L</span>
            </div>
            <span className="text-xl font-bold">Logo</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-300 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.a>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Account Dropdown */}
            <div className="relative hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`flex items-center space-x-1 p-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                aria-label="Account options"
              >
                <User size={20} />
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
                    {accountItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.path}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full md:hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
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
              className={`mt-4 md:hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden`}
            >
              <nav className="py-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`flex items-center space-x-2 px-4 py-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                ))}

                {/* Account options in mobile menu */}
                <div className="border-t mt-2 pt-2">
                  {accountItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.path}
                      className={`flex items-center space-x-2 px-4 py-3 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  ))}
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
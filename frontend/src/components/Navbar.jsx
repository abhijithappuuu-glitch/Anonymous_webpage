import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Navbar = ({ onLoginClick }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`backdrop-blur-md border-b sticky top-0 z-40 transition-colors ${theme === 'hacker' ? 'bg-[rgba(5,11,10,0.85)] border-hacker-green/25' : 'bg-black/60 border-cyber-blue/20'}`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo Only */}
          <Link to="/" className="flex items-center gap-3">
            {/* Regular 2D logo */}
            <img src={logo} alt="Anonymous Logo" className="w-10 h-10 object-contain" />
            <span className={`text-xl font-bold tracking-wider ${theme === 'hacker' ? 'text-red-400 drop-shadow-[0_0_6px_rgba(255,0,64,0.6)]' : 'text-purple-400 drop-shadow-[0_0_6px_rgba(147,51,234,0.6)]'}`}>ANONYMOUS</span>
          </Link>
          {/* Right: User Info, Logout, Arrow, Theme Toggle, Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/30 border border-gray-700 text-xs font-mono">
                <span className="opacity-70">USER:</span> <span className="font-bold">{user.username}</span>
              </div>
            )}
            {user && (
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider text-red-400 border border-red-400/40 hover:bg-red-900/20 hover:border-red-400/60"
              >
                LOGOUT
              </motion.button>
            )}
            {user && (
              <span className="text-lg font-bold text-gray-400">↗</span>
            )}
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              aria-label="Toggle hacker theme"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-300 overflow-hidden group ${
                theme === 'hacker' 
                  ? 'bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-400/30 text-green-300 hover:border-green-400/60 hover:shadow-[0_0_12px_rgba(0,255,65,0.3)]' 
                  : 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(0,255,255,0.3)]'
              }`}
            >
              <span className="relative z-10 drop-shadow-sm">
                {theme === 'hacker' ? 'DEF' : 'HCK'}
              </span>
            </motion.button>
            {/* Menu Button */}
            <div className="relative">
              <motion.button
                aria-label="menu"
                onClick={() => setMenuOpen(o => !o)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 overflow-hidden group ${
                  theme === 'hacker'
                    ? 'bg-gradient-to-br from-gray-900/60 to-black/60 border border-green-400/20 hover:border-green-400/40 hover:shadow-[0_0_12px_rgba(0,255,65,0.2)]'
                    : 'bg-gradient-to-br from-gray-900/60 to-black/60 border border-cyan-400/20 hover:border-cyan-400/40 hover:shadow-[0_0_12px_rgba(0,255,255,0.2)]'
                }`}
              >
                <div className="relative z-10 flex flex-col gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${theme === 'hacker' ? 'bg-green-400' : 'bg-cyan-400'}`} />
                  <span className={`w-1.5 h-1.5 rounded-full ${theme === 'hacker' ? 'bg-green-400' : 'bg-cyan-400'}`} />
                  <span className={`w-1.5 h-1.5 rounded-full ${theme === 'hacker' ? 'bg-green-400' : 'bg-cyan-400'}`} />
                </div>
              </motion.button>
              {/* Professional Menu Dropdown */}
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute right-0 mt-3 w-64 backdrop-blur-xl border rounded-xl p-4 shadow-2xl z-50 ${
                    theme === 'hacker'
                      ? 'bg-black/95 border-green-400/20 shadow-[0_8px_32px_rgba(0,255,65,0.15)]'
                      : 'bg-black/95 border-cyan-400/20 shadow-[0_8px_32px_rgba(0,255,255,0.15)]'
                  }`}
                >
                  {/* Navigation Section */}
                  <div className="mb-4">
                    <h3 className={`text-xs font-mono uppercase tracking-wider mb-3 opacity-60 ${
                      theme === 'hacker' ? 'text-green-400' : 'text-cyan-400'
                    }`}>
                      Navigation
                    </h3>
                    <nav className="flex flex-col gap-1">
                      <Link 
                        to="/" 
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200 ${
                          isActive('/') 
                            ? (theme === 'hacker' 
                                ? 'text-green-300 font-bold bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-400/30 shadow-[0_0_8px_rgba(0,255,65,0.2)]' 
                                : 'text-cyan-300 font-bold bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-400/30 shadow-[0_0_8px_rgba(0,255,255,0.2)]')
                            : (theme === 'hacker' 
                                ? 'text-green-400/70 hover:text-green-300 hover:bg-green-900/20 border border-transparent hover:border-green-400/20' 
                                : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 border border-transparent hover:border-cyan-400/20')
                        }`}
                      >
                        <span className={`mr-3 text-xs transition-transform group-hover:scale-110 ${isActive('/') ? '●' : '○'}`} />
                        <span className="flex-1">HOME</span>
                        {isActive('/') && <span className="text-xs opacity-60">current</span>}
                      </Link>
                      <Link 
                        to="/about" 
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200 ${
                          isActive('/about') 
                            ? (theme === 'hacker' 
                                ? 'text-green-300 font-bold bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-400/30 shadow-[0_0_8px_rgba(0,255,65,0.2)]' 
                                : 'text-cyan-300 font-bold bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-400/30 shadow-[0_0_8px_rgba(0,255,255,0.2)]')
                            : (theme === 'hacker' 
                                ? 'text-green-400/70 hover:text-green-300 hover:bg-green-900/20 border border-transparent hover:border-green-400/20' 
                                : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 border border-transparent hover:border-cyan-400/20')
                        }`}
                      >
                        <span className={`mr-3 text-xs transition-transform group-hover:scale-110 ${isActive('/about') ? '●' : '○'}`} />
                        <span className="flex-1">ABOUT</span>
                        {isActive('/about') && <span className="text-xs opacity-60">current</span>}
                      </Link>
                      <Link 
                        to="/events" 
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200 ${
                          isActive('/events') 
                            ? (theme === 'hacker' 
                                ? 'text-green-300 font-bold bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-400/30 shadow-[0_0_8px_rgba(0,255,65,0.2)]' 
                                : 'text-cyan-300 font-bold bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-400/30 shadow-[0_0_8px_rgba(0,255,255,0.2)]')
                            : (theme === 'hacker' 
                                ? 'text-green-400/70 hover:text-green-300 hover:bg-green-900/20 border border-transparent hover:border-green-400/20' 
                                : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 border border-transparent hover:border-cyan-400/20')
                        }`}
                      >
                        <span className={`mr-3 text-xs transition-transform group-hover:scale-110 ${isActive('/events') ? '●' : '○'}`} />
                        <span className="flex-1">EVENTS</span>
                        {isActive('/events') && <span className="text-xs opacity-60">current</span>}
                      </Link>
                    </nav>
                  </div>
                  
                  {/* Divider */}
                  <div className={`h-px mb-4 ${
                    theme === 'hacker' 
                      ? 'bg-gradient-to-r from-transparent via-green-400/30 to-transparent' 
                      : 'bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent'
                  }`} />
                  
                  {/* User Section */}
                  <div>
                    <h3 className={`text-xs font-mono uppercase tracking-wider mb-3 opacity-60 ${
                      theme === 'hacker' ? 'text-green-400' : 'text-cyan-400'
                    }`}>
                      Account
                    </h3>
                    
                    {user ? (
                      <>
                        {/* User info section */}
                        <div className={`flex items-center justify-between px-4 py-3 mb-2 text-sm font-mono rounded-lg border ${
                          theme === 'hacker'
                            ? 'text-green-300 bg-green-900/20 border-green-400/20'
                            : 'text-cyan-300 bg-cyan-900/20 border-cyan-400/20'
                        }`}>
                          <div>
                            <span className="opacity-70 text-xs">USER:</span>
                            <div className="font-bold">{user.username}</div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${theme === 'hacker' ? 'bg-green-400' : 'bg-cyan-400'}`} />
                        </div>
                        
                        {user.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setMenuOpen(false)}
                            className="group flex items-center px-4 py-3 mb-2 rounded-lg text-sm font-mono transition-all duration-200 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 border border-transparent hover:border-yellow-400/20"
                          >
                            <span className="mr-3 transition-transform group-hover:scale-110">⚡</span>
                            <span className="flex-1">ADMIN PANEL</span>
                            <span className="text-xs opacity-60">→</span>
                          </Link>
                        )}
                        
                        <motion.button
                          onClick={() => { logout(); setMenuOpen(false); }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="group w-full flex items-center px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-transparent hover:border-red-400/20"
                        >
                          <span className="mr-3 transition-transform group-hover:scale-110">↗</span>
                          <span className="flex-1 text-left">LOGOUT</span>
                          <span className="text-xs opacity-60">exit</span>
                        </motion.button>
                      </>
                    ) : (
                      <>
                        {/* Public mode indicator */}
                        <div className={`flex items-center justify-between px-4 py-3 mb-2 text-sm font-mono rounded-lg border ${
                          theme === 'hacker'
                            ? 'text-green-400/70 bg-green-900/10 border-green-400/10'
                            : 'text-gray-400 bg-gray-900/20 border-gray-400/20'
                        }`}>
                          <div>
                            <span className="opacity-70 text-xs">MODE:</span>
                            <div className="font-bold">GUEST</div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-gray-500" />
                        </div>
                        
                        <motion.button
                          onClick={() => { 
                            if (user) {
                              setShowLogoutConfirm(true);
                            } else {
                              onLoginClick && onLoginClick();
                            }
                            setMenuOpen(false); 
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`group w-full flex items-center px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200 border ${
                            user 
                              ? (theme === 'hacker'
                                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 border-transparent hover:border-yellow-400/20'
                                  : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 border-transparent hover:border-yellow-400/20')
                              : (theme === 'hacker'
                                  ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20 border-transparent hover:border-green-400/20'
                                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 border-transparent hover:border-cyan-400/20')
                          }`}
                        >
                          <span className="mr-3 transition-transform group-hover:scale-110">
                            {user ? '⚠️' : '→'}
                          </span>
                          <span className="flex-1 text-left">
                            {user ? 'LOGOUT FIRST TO LOGIN' : 'LOGIN'}
                          </span>
                          <span className="text-xs opacity-60">enter</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ...existing code for logout modal... */}
    </motion.nav>
  );
};

export default Navbar;

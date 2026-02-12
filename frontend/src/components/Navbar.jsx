import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, LogOut, User, Crown, LayoutDashboard, Menu, X } from 'lucide-react';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/30 transition-all" />
          <div className="relative w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300 border border-white/10">
            <QrCode size={24} />
          </div>
          <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight group-hover:to-white transition-all">Unique QR</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
                <Link to="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
                    Pricing
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                </Link>
                <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
                </a>
            </div>

          <div className="h-6 w-px bg-white/10" />

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="!text-indigo-400 hover:!bg-indigo-500/10 hover:!text-indigo-300">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-300 hidden lg:block">{user.email.split('@')[0]}</span>
                {user.subscriptionStatus === 'pro' && (
                  <Crown size={12} className="text-amber-400" fill="currentColor" />
                )}
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" className="shadow-neon">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link to="/pricing" className="block text-sm font-medium text-gray-400 hover:text-white py-2">Pricing</Link>
              <a href="#features" className="block text-sm font-medium text-gray-400 hover:text-white py-2">Features</a>
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full justify-start" icon={LayoutDashboard}>
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="danger" className="w-full justify-start" icon={LogOut} onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

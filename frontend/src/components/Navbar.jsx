import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, LogOut, User, Crown, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <QrCode size={24} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">Unique QR</span>
      </Link>

      <div className="flex items-center gap-6">
        {user && (
          <Link to="/dashboard" className="text-sm font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        )}
        <Link to="/pricing" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
          Pricing
        </Link>
        <a href="#features" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
          Features
        </a>

        {user ? (
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">{user.email.split('@')[0]}</span>
              {user.subscriptionStatus === 'pro' ? (
                <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                  <Crown size={10} fill="currentColor" /> PRO USER
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">FREE USER</span>
              )}
            </div>
            
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2">
              Log in
            </Link>
            <Link to="/signup" className="text-sm font-bold bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Settings, LogOut, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: PlusCircle, label: 'Create QR', path: '/dashboard/create' },
        { icon: History, label: 'History', path: '/dashboard/history' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <aside className="w-20 md:w-64 bg-slate-900/50 backdrop-blur-xl h-screen flex flex-col border-r border-white/5 relative z-20 transition-all duration-300">
            <div className="p-4 md:p-6 flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                    <QrCode className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold font-display text-white tracking-tight hidden md:block">UniqueQR</span>
            </div>

            <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                                isActive 
                                ? 'text-white' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/30"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon size={22} className={`relative z-10 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                            <span className="font-medium relative z-10 hidden md:block">{item.label}</span>
                            
                            {isActive && (
                                <motion.div 
                                    layoutId="active-dot"
                                    className="ml-auto w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)] hidden md:block relative z-10"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="hidden md:block bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-gray-200 truncate">{user?.email}</p>
                            <div className="flex items-center justify-between mt-0.5">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{user?.subscriptionStatus} PLAN</p>
                                {user?.subscriptionStatus === 'free' && (
                                    <Link 
                                        to="/pricing" 
                                        className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                                    >
                                        UPGRADE
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold group"
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="hidden md:block">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

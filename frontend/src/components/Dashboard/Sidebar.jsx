import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Settings, LogOut, Zap } from 'lucide-react';
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
        <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300 border-r border-slate-800">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Zap className="text-white fill-white" size={24} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">UniqueQR</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                            <span className="font-semibold">{item.label}</span>
                            {isActive && (
                                <motion.div 
                                    layoutId="active"
                                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{user?.subscriptionStatus} PLAN</p>
                                {user?.subscriptionStatus === 'free' && (
                                    <Link 
                                        to="/pricing" 
                                        className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold hover:bg-indigo-500 transition-colors"
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
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-semibold"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

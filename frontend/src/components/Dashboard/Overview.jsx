import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import { QrCode, Crown, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Overview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const stats = [
        { 
            icon: QrCode, 
            label: 'Total QRs', 
            value: user?.qrCount || 0, 
            subValue: user?.subscriptionStatus === 'free' ? `${5 - (user?.qrCount || 0)} free remaining` : 'Unlimited usage',
            color: 'bg-indigo-600 shadow-indigo-200 shadow-lg'
        },
        { 
            icon: Crown, 
            label: 'Active Plan', 
            value: user?.subscriptionStatus?.toUpperCase() || 'FREE', 
            subValue: user?.subscriptionStatus === 'free' ? 'Upgrade for more features' : 'Premium analytics enabled',
            color: 'bg-amber-500 shadow-amber-200 shadow-lg'
        },
        { 
            icon: TrendingUp, 
            label: 'Total Scans', 
            value: '0', 
            subValue: 'Analytics coming soon',
            color: 'bg-emerald-500 shadow-emerald-200 shadow-lg'
        },
        { 
            icon: Zap, 
            label: 'Integrations', 
            value: '3', 
            subValue: 'API, Webhooks, Mobile',
            color: 'bg-purple-600 shadow-purple-200 shadow-lg'
        }
    ];

    return (
        <div className="space-y-10">
            <header className="flex flex-col gap-2">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                    Welcome back, <span className="text-indigo-600">User</span>!
                </motion.h1>
                <p className="text-slate-500 font-medium text-lg">Here's what's happening with your QR codes today.</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatsCard key={stat.label} {...stat} delay={i * 0.1} />
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Usage Activity</h2>
                        <p className="text-slate-400 mb-8 font-medium">Your generation trends over the last 30 days.</p>
                        
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 60, 75].map((h, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.5 + (i * 0.05) }}
                                    className="flex-1 bg-indigo-500/20 rounded-t-xl hover:bg-indigo-500 transition-colors group relative cursor-pointer"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {Math.floor(h/2)} QRs
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {user?.subscriptionStatus !== 'pro' && (
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <h2 className="text-2xl font-bold mb-4">Go Pro, Get Unlimited</h2>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['Unlimited QR Generation', 'Custom Logos & Branding', 'Advanced Analytics', 'AES Encryption'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm font-semibold opacity-90">
                                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                            <Zap size={10} fill="white" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => navigate('/pricing')}
                                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-transform"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overview;

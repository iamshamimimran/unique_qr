import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Zap, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-48">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px] opacity-40"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-40"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-2.5 rounded-full text-sm font-bold border border-indigo-100 shadow-sm"
                        >
                            <Zap size={16} fill="currentColor" />
                            <span>v2.0 Dashboard is Live</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl lg:text-8xl font-extrabold text-slate-900 leading-[1] tracking-tight"
                        >
                            The Ultimate <span className="text-indigo-600">QR Dashboard</span> for Professionals
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 leading-relaxed max-w-2xl"
                        >
                            Generate unique, secure, and beautiful QR codes. Track history, manage analytics, and brand your codes in one powerful dashboard.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-4 mt-4"
                        >
                            <Link to={user ? "/dashboard" : "/signup"} className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-lg">
                                {user ? "Go to Dashboard" : "Get Started Free"} <ArrowRight size={22} />
                            </Link>
                            {!user && (
                                <Link to="/login" className="px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-[1.5rem] font-bold shadow-sm hover:bg-slate-50 transition-all text-lg">
                                    Sign In
                                </Link>
                            )}
                        </motion.div>

                        <motion.div 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 0.5 }}
                             className="flex flex-col items-center gap-4 pt-12"
                        >
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i+14}`} alt="user" className="rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-semibold text-slate-400">
                                Trusted by <span className="text-slate-900 font-bold">5,000+</span> creators worldwide
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Everything You Need</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Powerful features designed to help you stand out and secure your data.</p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Layout className="text-indigo-600" size={32} />}
                        title="Multiple Types"
                        desc="Generate QR codes for URLs, WiFi, Contacts, Emails, and plain text with a single click."
                    />
                    <FeatureCard 
                        icon={<Shield className="text-indigo-600" size={32} />}
                        title="AES Encryption"
                        desc="Secure your messages. Only those with the secret can decode the content using our built-in reader."
                    />
                    <FeatureCard 
                        icon={<CheckCircle2 className="text-indigo-600" size={32} />}
                        title="Custom Styling"
                        desc="Choose from various patterns, eye styles, and colors to match your brand identity perfectly."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
        <div className="mb-6 w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default Landing;

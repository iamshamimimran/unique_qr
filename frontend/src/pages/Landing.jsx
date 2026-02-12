import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Zap, Layout, ArrowRight, QrCode, Smartphone, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="bg-slate-950 min-h-screen overflow-hidden text-gray-100 selection:bg-indigo-500/30">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-48">
                {/* Background Ambient Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]"></div>
                    <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[7s]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 text-indigo-300 px-6 py-2.5 rounded-full text-sm font-medium shadow-neon"
                        >
                            <Zap size={16} fill="currentColor" />
                            <span className="font-display tracking-wide">v2.0 Dashboard is Live</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl lg:text-8xl font-bold font-display leading-[1] tracking-tight"
                        >
                            The Ultimate <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">QR Dashboard</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-400 leading-relaxed max-w-2xl font-light"
                        >
                            Generate unique, secure, and beautiful QR codes. Track history, manage analytics, and brand your codes in one powerful dashboard.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center gap-4 mt-4"
                        >
                            <Link to={user ? "/dashboard" : "/signup"}>
                                <Button size="lg" className="rounded-full px-8 py-4 text-lg shadow-neon group">
                                    {user ? "Go to Dashboard" : "Get Started Free"} 
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            {!user && (
                                <Link to="/login">
                                    <Button variant="secondary" size="lg" className="rounded-full px-8 py-4 text-lg bg-white/5 border-white/10 hover:bg-white/10">
                                        Sign In
                                    </Button>
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
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 shadow-sm overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i+14}`} alt="user" className="w-full h-full object-cover opacity-80" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                                Trusted by <span className="text-white font-bold">5,000+</span> creators worldwide
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="relative py-24 px-6 overflow-hidden">
                 <div className="absolute inset-0 bg-slate-900/50 skew-y-3 transform origin-top-left -z-10 scale-110"></div>
                 
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">Everything You Need</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Powerful features designed to help you stand out and secure your data.</p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<QrCode className="text-indigo-400" size={32} />}
                        title="Multiple Types"
                        desc="Generate QR codes for URLs, WiFi, Contacts, Emails, and plain text with a single click."
                        delay={0}
                    />
                    <FeatureCard 
                        icon={<Shield className="text-purple-400" size={32} />}
                        title="AES Encryption"
                        desc="Secure your messages. Only those with the secret can decode the content using our built-in reader."
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={<Smartphone className="text-pink-400" size={32} />}
                        title="Mobile Optimized"
                        desc="Perfectly responsive and optimized for scanning on all modern mobile devices."
                        delay={0.2}
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-lg pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <QrCode size={20} className="text-white"/>
                            </div>
                            <span className="text-xl font-bold font-display text-white">Unique QR</span>
                        </div>
                        <p className="text-gray-400 max-w-xs">The most advanced QR code generator for professionals. Secure, fast, and beautiful.</p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">API</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Unique QR. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
    >
        <Card className="h-full bg-white/5 border-white/5 hover:border-indigo-500/30 transition-colors group">
            <div className="mb-6 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-display">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </Card>
    </motion.div>
);

export default Landing;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, Zap, Crown, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Pricing = () => {
  const { user, API_URL } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscription = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const result = await axios.post(`${API_URL}/payment/create-order`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { amount, id: order_id, currency } = result.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID', 
        amount: amount.toString(),
        currency: currency,
        name: "Unique QR Pro",
        description: "Monthly Subscription",
        order_id: order_id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${API_URL}/payment/verify-payment`, response, {
              headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(verifyRes.data.message);
            navigate('/');
            window.location.reload();
          } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 pt-20 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[20%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="flex justify-between items-center mb-8">
            {user && (
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>
            )}
        </div>
        
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-3 tracking-tight"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-light"
          >
            Choose the plan that best fits your needs. Upgrade anytime to unlock premium features and unlimited possibilities.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 flex flex-col hover:border-white/10 transition-all duration-300"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1 font-display">Starter</h2>
              <p className="text-slate-400 text-xs mb-4">Perfect for trying out our platform</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-slate-500 text-sm font-medium">/month</span>
              </div>
            </div>

            <div className="h-px bg-white/5 mb-6 w-full" />

            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <div className="p-1 rounded-full bg-slate-800 text-slate-400">
                    <Check size={12} strokeWidth={3} />
                </div>
                <span>5 QR Codes per month</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <div className="p-1 rounded-full bg-slate-800 text-slate-400">
                    <Check size={12} strokeWidth={3} />
                </div>
                <span>Standard QR Patterns</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <div className="p-1 rounded-full bg-slate-800 text-slate-400">
                    <Check size={12} strokeWidth={3} />
                </div>
                <span>Basic Customization</span>
              </li>
            </ul>

            <button 
              disabled={true}
              className="w-full py-3 bg-slate-800/50 text-slate-400 text-sm rounded-lg font-bold cursor-not-allowed border border-white/5"
            >
              {user?.subscriptionStatus === 'free' ? 'Current Plan' : 'Free Forever'}
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-indigo-500/30 flex flex-col relative overflow-hidden group shadow-2xl shadow-indigo-500/10"
          >
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <Crown className="text-indigo-500/20 rotate-12" size={80} strokeWidth={1} />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 shadow-lg shadow-indigo-500/20">
                <Crown size={10} fill="currentColor" />
                Most Popular
              </div>
              <h2 className="text-xl font-bold text-white mb-1 font-display">Pro Plan</h2>
               <p className="text-indigo-200/70 text-xs mb-4">Unlock full potential & remove limits</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">₹99</span>
                <span className="text-slate-400 text-sm font-medium">/month</span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-indigo-500/50 to-purple-500/50 mb-6 w-full" />

            <ul className="space-y-3 mb-6 flex-1 relative z-10">
              <li className="flex items-center gap-3 text-sm text-white">
                <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Zap size={12} fill="currentColor" />
                </div>
                <span className="font-medium">Unlimited QR Generations</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Check size={12} strokeWidth={3} />
                </div>
                <span>Premium QR Patterns & Eyes</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Check size={12} strokeWidth={3} />
                </div>
                <span>Custom Logo & Colors</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Check size={12} strokeWidth={3} />
                </div>
                <span>Priority Support</span>
              </li>
            </ul>

            <button 
              onClick={handleSubscription}
              disabled={loading || user?.subscriptionStatus === 'pro'}
              className={`w-full py-3 relative z-10 rounded-lg text-sm font-bold shadow-neon transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                ${user?.subscriptionStatus === 'pro' 
                    ? 'bg-slate-800 text-slate-400 border border-white/10 shadow-none' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                </span>
              ) : user?.subscriptionStatus === 'pro' ? (
                'Current Active Plan'
              ) : (
                'Upgrade to Pro'
              )}
            </button>
          </motion.div>
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-8 mb-4">
            Secure payments powered by Razorpay. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default Pricing;

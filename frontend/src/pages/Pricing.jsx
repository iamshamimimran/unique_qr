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
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {user && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="mb-8 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-semibold group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        )}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Pricing Plans</h1>
          <p className="text-slate-600 text-lg">Choose the best plan for your needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col"
          >
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Free Plan</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">₹0</span>
                <span className="text-slate-500">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="text-green-500" size={20} />
                <span>5 QR Codes per month</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="text-green-500" size={20} />
                <span>Standard QR Patterns</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="text-green-500" size={20} />
                <span>Basic Customization</span>
              </li>
            </ul>

            <button 
              disabled={user?.subscriptionStatus === 'free'}
              className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed"
            >
              {user?.subscriptionStatus === 'free' ? 'Current Plan' : 'Get Started'}
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-indigo-600 p-8 rounded-3xl shadow-2xl shadow-indigo-500/20 text-white flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <Crown className="text-indigo-400 opacity-20" size={80} />
            </div>

            <div className="mb-8 relative">
              <div className="bg-indigo-500/30 text-indigo-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4">
                Recommended
              </div>
              <h2 className="text-xl font-bold mb-2">Pro Plan</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">₹99</span>
                <span className="text-indigo-100">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1 relative">
              <li className="flex items-center gap-3">
                <Zap className="text-yellow-400 fill-yellow-400" size={20} />
                <span>Unlimited QR Generations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-indigo-200" size={20} />
                <span>Premium QR Patterns & Eyes</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-indigo-200" size={20} />
                <span>Custom Logo & Colors</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-indigo-200" size={20} />
                <span>Priority Support</span>
              </li>
            </ul>

            <button 
              onClick={handleSubscription}
              disabled={loading || user?.subscriptionStatus === 'pro'}
              className={`w-full py-3 ${user?.subscriptionStatus === 'pro' ? 'bg-indigo-500 text-indigo-100' : 'bg-white text-indigo-600'} rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-70`}
            >
              {loading ? 'Processing...' : user?.subscriptionStatus === 'pro' ? 'Active Plan' : 'Upgrade to Pro'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

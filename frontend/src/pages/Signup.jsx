import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords don't match");
    
    setIsLoading(true);
    const success = await signup(email, password);
    setIsLoading(false);
    
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[20%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="p-8 md:p-12 border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-neon">
                <UserPlus className="text-white" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-400 font-medium">Start your professional QR journey.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                    label="EMAIL ADDRESS"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    icon={Mail}
                />

                <Input 
                    label="PASSWORD"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                />

                <Input 
                    label="CONFIRM PASSWORD"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                />

                <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full py-3.5 text-lg shadow-neon bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-none"
                        isLoading={isLoading}
                    >
                        Create Your Account
                    </Button>
                </div>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500 font-medium">
            Already have an account? <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Log in</Link>
            </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;

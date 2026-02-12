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
    <div className="min-h-full bg-slate-950 flex items-center justify-center p-2 pt-24 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="p-8 md:p-12 border-white/10 bg-slate-900/50 backdrop-blur-xl">
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

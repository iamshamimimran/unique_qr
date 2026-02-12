import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 pt-24 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="p-8 md:p-12 border-white/10 bg-slate-900/50 backdrop-blur-xl">
            {/* <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 font-medium">Your premium QR toolkit awaits.</p>
            </div> */}

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

                <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full py-3.5 text-lg shadow-neon"
                        isLoading={isLoading}
                    >
                        Sign In to Dashboard
                    </Button>
                </div>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500 font-medium">
            New to UniqueQR? <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Create account</Link>
            </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

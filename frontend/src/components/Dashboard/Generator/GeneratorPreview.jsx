import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Save, Crown, Lock, Unlock } from 'lucide-react';
import CanvasRenderer from '../../CanvasRenderer';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const GeneratorPreview = ({ 
    matrix, styleType, fgColor, bgColor, gradient, eyeStyle, logo, logoBgColor, 
    onDownload, onSave, isSaving, isLimitReached, user, navigate,
    mode, decryptedResult, setDecryptedResult
}) => (
    <div className="flex flex-col items-center justify-center gap-8 h-full w-full max-w-2xl mx-auto px-4 py-8">
        {mode === 'create' ? (
            <>
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>
            <Card className="p-10 bg-white border-white/10 relative z-10 !rounded-[3rem]">
                <CanvasRenderer 
                    matrix={matrix} 
                    size={380} 
                    styleType={styleType}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    gradientInfo={gradient}
                    eyeStyle={eyeStyle}
                    logoImage={logo}
                    logoBgColor={logoBgColor}
                />
            </Card>
        </motion.div>

        {user?.subscriptionStatus === 'free' && (
            <div className="flex items-center gap-4 mb-2">
                <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(user?.qrCount / 5) * 100}%` }}
                        className={`h-full ${isLimitReached ? 'bg-red-500' : 'bg-indigo-500'}`}
                    />
                </div>
                <span className={`text-xs font-bold ${isLimitReached ? 'text-red-400' : 'text-gray-500'}`}>
                    {user?.qrCount}/5 QRs Generated
                </span>
            </div>
        )}

        <div className="flex gap-4 w-full max-w-sm">
            {isLimitReached ? (
                <Button 
                    onClick={() => navigate('/pricing')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black border-none shadow-lg shadow-amber-500/20"
                    icon={Crown}
                >
                    Upgrade to Pro for Unlimited QRs
                </Button>
            ) : (
                <>
                    <Button 
                        onClick={onDownload}
                        variant="secondary"
                        className="flex-1 bg-slate-800 border-white/10 hover:bg-slate-700 text-white"
                        icon={Download}
                    >
                        Export PNG
                    </Button>
                    
                    <Button 
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex-1 shadow-neon"
                        isLoading={isSaving}
                        icon={Save}
                    >
                        Save
                    </Button>
                </>
            )}
        </div>
        
        <p className="text-gray-500 text-xs font-medium">PNG format support transparency and high resolution.</p>
            </>
        ) : (
            /* VERIFY MODE PREVIEW */
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {decryptedResult.text ? (
                        <motion.div 
                            key="result"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -20 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                            className={`w-full relative p-12 rounded-[3rem] shadow-2xl border overflow-hidden ${
                                decryptedResult.error 
                                ? 'bg-red-950/30 border-red-500/30 shadow-red-500/10' 
                                : 'bg-emerald-950/30 border-emerald-500/30 shadow-emerald-500/10'
                            }`}
                        >
                            {/* Decorative background circle */}
                            <div className={`absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20 ${
                                decryptedResult.error ? 'bg-red-500' : 'bg-emerald-500'
                            }`}></div>

                            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl relative z-10 ${
                                decryptedResult.error ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                                {decryptedResult.error ? <Lock size={48} /> : <Unlock size={48} />}
                            </div>
                            
                            <h2 className={`text-3xl font-bold mb-4 text-center relative z-10 font-display ${decryptedResult.error ? 'text-red-400' : 'text-emerald-400'}`}>
                                {decryptedResult.error ? 'Decryption Failed' : 'Message Revealed'}
                            </h2>
                            
                            <div className={`text-xl font-medium leading-relaxed p-8 rounded-[2rem] text-center relative z-10 border ${
                                decryptedResult.error ? 'text-red-300 bg-red-950/50 border-red-500/20' : 'text-emerald-300 bg-emerald-950/50 border-emerald-500/20'
                            }`}>
                                {decryptedResult.text}
                            </div>
                            
                            <button 
                                onClick={() => setDecryptedResult({ text: '', error: false })}
                                className="mt-10 w-full text-sm font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                            >
                                Clear Result
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="instruction"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center space-y-8"
                        >
                            <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] shadow-xl border border-white/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 scale-110 backdrop-blur-sm">
                                <Lock size={56} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-4 tracking-tight font-display">Secure Reader</h2>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                                    Scan your Unique QR with any phone camera, paste the code into the sidebar, and we'll reveal the secret here.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}
    </div>
);

export default GeneratorPreview;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Save, Crown, Lock, Unlock } from 'lucide-react';
import CanvasRenderer from '../../CanvasRenderer';

const GeneratorPreview = ({ 
    matrix, styleType, fgColor, bgColor, gradient, eyeStyle, logo, logoBgColor, 
    onDownload, onSave, isSaving, isLimitReached, user, navigate,
    mode, decryptedResult, setDecryptedResult
}) => (
    <div className="flex flex-col items-center justify-center gap-8 h-full w-full max-w-2xl mx-auto px-4">
        {mode === 'create' ? (
            <>
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/10 border border-slate-200/50"
        >
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
        </motion.div>

        {user?.subscriptionStatus === 'free' && (
            <div className="flex items-center gap-4 mb-4">
                <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(user?.qrCount / 5) * 100}%` }}
                        className={`h-full ${isLimitReached ? 'bg-red-500' : 'bg-indigo-600'}`}
                    />
                </div>
                <span className={`text-xs font-bold ${isLimitReached ? 'text-red-500' : 'text-slate-500'}`}>
                    {user?.qrCount}/5 QRs Generated
                </span>
            </div>
        )}

        <div className="flex gap-4 w-full max-w-sm">
            {isLimitReached ? (
                <button 
                    onClick={() => navigate('/pricing')}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <Crown size={20} className="text-yellow-400 fill-yellow-400" />
                    <span>Upgrade to Pro for Unlimited QRs</span>
                </button>
            ) : (
                <>
                    <button 
                        onClick={onDownload}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
                    >
                        <Download size={20} />
                        <span>Export PNG</span>
                    </button>
                    
                    <button 
                        onClick={onSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-xl hover:bg-indigo-700 active:scale-95 transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save to History</span>
                            </>
                        )}
                    </button>
                </>
            )}
        </div>
        
        <p className="text-slate-400 text-xs font-medium">PNG format support transparency and high resolution.</p>
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
                            className={`w-full relative p-12 rounded-[3rem] shadow-2xl border-2 overflow-hidden ${
                                decryptedResult.error 
                                ? 'bg-red-50/50 border-red-100 shadow-red-500/5' 
                                : 'bg-white border-green-100 shadow-green-500/5'
                            }`}
                        >
                            {/* Decorative background circle */}
                            <div className={`absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20 ${
                                decryptedResult.error ? 'bg-red-500' : 'bg-green-500'
                            }`}></div>

                            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl relative z-10 ${
                                decryptedResult.error ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
                            }`}>
                                {decryptedResult.error ? <Lock size={48} /> : <Unlock size={48} />}
                            </div>
                            
                            <h2 className={`text-3xl font-bold mb-4 text-center relative z-10 ${decryptedResult.error ? 'text-red-900' : 'text-slate-800'}`}>
                                {decryptedResult.error ? 'Decryption Failed' : 'Message Revealed'}
                            </h2>
                            
                            <div className={`text-xl font-medium leading-relaxed p-8 rounded-[2rem] text-center relative z-10 border ${
                                decryptedResult.error ? 'text-red-600 bg-red-100/30 border-red-100' : 'text-slate-700 bg-slate-50/50 border-slate-100'
                            }`}>
                                {decryptedResult.text}
                            </div>
                            
                            <button 
                                onClick={() => setDecryptedResult({ text: '', error: false })}
                                className="mt-10 w-full text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
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
                            <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 text-indigo-500 flex items-center justify-center mx-auto mb-4 scale-110">
                                <Lock size={56} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Secure Reader</h2>
                                <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto">
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

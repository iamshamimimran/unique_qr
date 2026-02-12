import React from 'react';
import { Type, Link, Wifi, User, Mail, Lock, Unlock, Zap, Box, Circle, Grid, Palette, Image as ImageIcon, Upload, Key, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const SectionLabel = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 text-indigo-300/80 font-bold text-[10px] uppercase tracking-wider mb-3 mt-5 px-1">
        <Icon size={12} />
        <span>{title}</span>
        <div className="h-[1px] flex-1 bg-white/5 ml-2"></div>
    </div>
);

const CompactInput = ({ label, ...props }) => (
    <div className="mb-3">
        {label && <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wide">{label}</label>}
        <input 
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all hover:bg-white/5 hover:border-white/20"
            {...props}
        />
    </div>
);

const GeneratorOptions = ({ 
    mode, setMode, contentType, setContentType, contentData, updateContent, 
    isEncrypted, setIsEncrypted, styleType, setStyleType, 
    eyeStyle, setEyeStyle, fgColor, setFgColor, 
    bgColor, setBgColor,
    gradient, setGradient, logo, setLogo, 
    logoBgColor, setLogoBgColor, user, navigate,
    handleLogoUpload, decryptInput, setDecryptInput,
    handleDecrypt, decryptedResult, setDecryptedResult
}) => {
    
    const contentTypes = [
        { id: 'text', label: 'Text', icon: Type },
        { id: 'url', label: 'URL', icon: Link },
        { id: 'wifi', label: 'WiFi', icon: Wifi },
        { id: 'vcard', label: 'Contact', icon: User },
        { id: 'email', label: 'Email', icon: Mail },
    ];

    return (
        <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-5">
            {/* MODE TOGGLE */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 shadow-lg">
                <button 
                    onClick={() => setMode('create')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                        mode === 'create' 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    <Zap size={10} className={mode === 'create' ? 'text-white' : 'hidden'} />
                    Create
                </button>
                <button 
                    onClick={() => setMode('verify')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                        mode === 'verify' 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                    <Key size={10} className={mode === 'verify' ? 'text-white' : 'hidden'} />
                    Verify
                </button>
            </div>

            {mode === 'create' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    
                    {/* 1. CONTENT TYPE */}
                    <div className="grid grid-cols-5 gap-2">
                        {contentTypes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setContentType(t.id)}
                                className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all border group relative overflow-hidden ${
                                    contentType === t.id 
                                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30' 
                                    : 'bg-slate-900/40 border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10 hover:text-gray-300'
                                }`}
                                title={t.label}
                            >
                                <t.icon size={16} className={`mb-1.5 transition-transform duration-300 ${contentType === t.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-[9px] font-bold opacity-90">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* DYNAMIC FORM AREA */}
                    <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            {(() => {
                                const Icon = contentTypes.find(t => t.id === contentType)?.icon;
                                return Icon ? <Icon size={80} className="text-white" /> : null;
                            })()}
                        </div>

                        {contentType === 'text' && (
                            <textarea 
                                value={contentData.text}
                                onChange={(e) => updateContent('text', null, e.target.value)}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3.5 text-xs focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none text-white placeholder-gray-500 min-h-[110px]"
                                placeholder="Enter your text content here..."
                            />
                        )}

                        {contentType === 'url' && (
                            <CompactInput 
                                label="Website URL"
                                value={contentData.url}
                                onChange={(e) => updateContent('url', null, e.target.value)}
                                placeholder="https://example.com"
                            />
                        )}

                        {contentType === 'wifi' && (
                            <div className="space-y-3">
                                <CompactInput label="SSID" value={contentData.wifi.ssid} onChange={(e) => updateContent('wifi', 'ssid', e.target.value)} placeholder="Network Name" />
                                <CompactInput label="Password" type="password" value={contentData.wifi.password} onChange={(e) => updateContent('wifi', 'password', e.target.value)} placeholder="Password" />
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wide">Security</label>
                                    <div className="flex bg-slate-950/50 rounded-lg p-0.5 border border-white/10">
                                        {['WPA', 'WEP', 'nopass'].map(enc => (
                                            <button 
                                                key={enc}
                                                onClick={() => updateContent('wifi', 'encryption', enc)}
                                                className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded transition-all ${contentData.wifi.encryption === enc ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {enc === 'nopass' ? 'Open' : enc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {contentType === 'vcard' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <CompactInput label="First Name" value={contentData.vcard.firstName} onChange={(e) => updateContent('vcard', 'firstName', e.target.value)} placeholder="John" />
                                    <CompactInput label="Last Name" value={contentData.vcard.lastName} onChange={(e) => updateContent('vcard', 'lastName', e.target.value)} placeholder="Doe" />
                                </div>
                                <CompactInput label="Mobile" value={contentData.vcard.mobile} onChange={(e) => updateContent('vcard', 'mobile', e.target.value)} placeholder="+1 234 567 890" />
                                <CompactInput label="Email" value={contentData.vcard.email} onChange={(e) => updateContent('vcard', 'email', e.target.value)} placeholder="email@example.com" />
                            </div>
                        )}

                        {contentType === 'email' && (
                            <div className="space-y-3">
                                <CompactInput label="To" value={contentData.email.to} onChange={(e) => updateContent('email', 'to', e.target.value)} placeholder="email@example.com" />
                                <CompactInput label="Subject" value={contentData.email.subject} onChange={(e) => updateContent('email', 'subject', e.target.value)} placeholder="Re: Project" />
                                <textarea 
                                    value={contentData.email.body}
                                    onChange={(e) => updateContent('email', 'body', e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3.5 text-xs focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none text-white placeholder-gray-500 mt-1"
                                    rows="3"
                                    placeholder="Message..."
                                />
                            </div>
                        )}
                        
                        <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/5">
                             <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                <div className={`w-1.5 h-1.5 rounded-full ${isEncrypted ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-gray-700'}`}></div>
                                <span>{isEncrypted ? "Securely Encrypted" : "Standard QR"}</span>
                             </div>
                             <button
                                onClick={() => {
                                    if (user?.subscriptionStatus === 'free') {
                                        toast.error('Pro feature required');
                                        navigate('/pricing');
                                    } else {
                                        setIsEncrypted(!isEncrypted);
                                    }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${isEncrypted ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10'}`}
                            >
                                <Lock size={10} />
                                {isEncrypted ? 'Locked' : 'Encrypt'}
                            </button>
                        </div>
                    </div>

                    {/* CUSTOMIZATION GRID */}
                    <div>
                        <SectionLabel icon={Grid} title="Design & Colors" />
                        <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5 space-y-4">
                             {/* Patterns */}
                             <div className="grid grid-cols-4 gap-2">
                                {[
                                    { id: 'standard', icon: Box, label: 'Box' },
                                    { id: 'rounded', icon: Circle, label: 'Round' },
                                    { id: 'neon', icon: Zap, label: 'Neon' },
                                    { id: 'dots', icon: Grid, label: 'Dots' },
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStyleType(s.id)}
                                        className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
                                            styleType === s.id 
                                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <s.icon size={14} />
                                        <span className="text-[8px] font-bold uppercase">{s.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Corner Style (Eyes) - Premium */}
                            <div>
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Corner Style</span>
                                    {user?.subscriptionStatus === 'free' && <span className="text-[8px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">PRO</span>}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'square', icon: Box, label: 'Square' },
                                        { id: 'dot', icon: Circle, label: 'Dot' },
                                        { id: 'rounded', icon: Box, label: 'Extra Round' }, // Using Box but will style as rounded in CSS/Canvas
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                if (user?.subscriptionStatus === 'free' && s.id !== 'square') return toast.error('Pro feature required');
                                                setEyeStyle(s.id);
                                            }}
                                            className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
                                                eyeStyle === s.id 
                                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                                                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <s.icon size={14} className={s.id === 'rounded' ? 'rounded-md' : ''} />
                                            <span className="text-[8px] font-bold uppercase">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="flex items-center gap-3 bg-slate-950/50 p-2.5 rounded-xl border border-white/10">
                                 <button 
                                    onClick={() => {
                                        if (user?.subscriptionStatus === 'free') return toast.error('Pro feature');
                                        setGradient({...gradient, active: !gradient.active});
                                    }}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                        gradient.active 
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md' 
                                        : 'bg-slate-800 text-gray-600 hover:bg-slate-700 hover:text-gray-400'
                                    }`}
                                    title="Toggle Gradient"
                                 >
                                     <Zap size={14} className={gradient.active ? "fill-white" : ""} />
                                 </button>
                                 <div className="w-[1px] h-6 bg-white/10"></div>
                                 <div className="flex-1 flex gap-2">
                                     <div className="flex-1 h-9 bg-slate-900 rounded-lg relative overflow-hidden ring-1 ring-white/10 group cursor-pointer">
                                         <input type="color" value={gradient.active ? gradient.start : fgColor} onChange={(e) => gradient.active ? setGradient({...gradient, start: e.target.value}) : setFgColor(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer opacity-0" />
                                         <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: gradient.active ? gradient.start : fgColor }} />
                                     </div>
                                     {gradient.active && (
                                         <div className="flex-1 h-9 bg-slate-900 rounded-lg relative overflow-hidden ring-1 ring-white/10 group cursor-pointer">
                                             <input type="color" value={gradient.end} onChange={(e) => setGradient({...gradient, end: e.target.value})} className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer opacity-0" />
                                             <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: gradient.end }} />
                                         </div>
                                     )}
                                 </div>
                            </div>

                            {/* Branding */}
                            {!logo ? (
                                <div className="relative group">
                                    <div className="border border-dashed border-white/10 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-500 hover:bg-white/5 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer">
                                        <Upload size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-wide">Upload Logo</span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                                        <div className="w-10 h-10 bg-white p-1 rounded-lg relative overflow-hidden">
                                            <div className="absolute inset-0 z-0 bg-gray-200" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '8px 8px' }}></div>
                                            <div className="absolute inset-0 z-10" style={{ backgroundColor: logoBgColor }}></div>
                                            <img src={logo} alt="brand" className="w-full h-full object-contain relative z-20" />
                                        </div>
                                        <div className="flex-1">
                                             <button onClick={() => setLogo(null)} className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase">Remove Logo</button>
                                        </div>
                                    </div>

                                    {/* Premium Logo Background Options */}
                                    <div className="bg-slate-950/30 p-2.5 rounded-xl border border-white/5 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase">Logo Background</span>
                                            {user?.subscriptionStatus === 'free' && <span className="text-[8px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">PRO</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setLogoBgColor('#ffffff')}
                                                className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all ${logoBgColor === '#ffffff' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                                            >
                                                White
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (user?.subscriptionStatus === 'free') return toast.error('Pro feature required');
                                                    setLogoBgColor('transparent');
                                                }}
                                                className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all ${logoBgColor === 'transparent' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                                            >
                                                None
                                            </button>
                                            <div className="relative group w-8">
                                                <button 
                                                    className={`w-full h-full rounded-lg border transition-all flex items-center justify-center ${logoBgColor !== 'transparent' && logoBgColor !== '#ffffff' ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-white/10 bg-white/5'}`}
                                                    onClick={() => {
                                                        if (user?.subscriptionStatus === 'free') toast.error('Pro feature required');
                                                    }}
                                                >
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: logoBgColor === 'transparent' ? 'transparent' : logoBgColor, border: '1px solid rgba(255,255,255,0.2)' }} />
                                                </button>
                                                <input 
                                                    type="color" 
                                                    value={logoBgColor === 'transparent' ? '#ffffff' : logoBgColor}
                                                    onChange={(e) => {
                                                        if (user?.subscriptionStatus === 'free') return;
                                                        setLogoBgColor(e.target.value);
                                                    }}
                                                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                    disabled={user?.subscriptionStatus === 'free'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </motion.div>
            ) : (
                /* VERIFY MODE UI */
                <div className="space-y-4 pt-4">
                     <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 text-center border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 blur-xl transition-colors"></div>
                        <Key size={40} className="mx-auto text-indigo-400 mb-4 drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]" />
                        <h3 className="text-sm font-bold text-white mb-1 tracking-wide uppercase">Secure Decoder</h3>
                        <p className="text-[10px] text-gray-400">Unlock encrypted Unique QRs</p>
                     </div>

                     <textarea 
                        value={decryptInput}
                        onChange={(e) => setDecryptInput(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-300 min-h-[140px] font-mono shadow-inner"
                        placeholder="Paste encrypted string here..."
                    />
                    
                    <Button onClick={handleDecrypt} className="w-full text-xs py-2.5 shadow-neon uppercase tracking-wider font-bold" icon={Unlock}>Decrypt & Verify</Button>
                    
                    {decryptedResult.text && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                            <p className={`text-xs ${decryptedResult.error ? 'text-red-400' : 'text-green-400 font-mono break-all'}`}>
                                {decryptedResult.text}
                            </p>
                            <button onClick={() => { setDecryptInput(''); setDecryptedResult({ text: '', error: false }); }} className="text-[10px] text-gray-500 font-bold uppercase hover:text-white mt-2">Clear Result</button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeneratorOptions;

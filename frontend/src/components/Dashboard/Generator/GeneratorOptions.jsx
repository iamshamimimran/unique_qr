import React from 'react';
import { Type, Link, Wifi, User, Mail, Lock, Unlock, Zap, Box, Circle, Grid, Palette, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wide mb-3 mt-4">
        <Icon size={16} />
        <span>{title}</span>
    </div>
);

const Input = ({ label, value, onChange, placeholder, type="text" }) => (
    <div className="mb-2">
        {label && <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{label}</label>}
        <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
    </div>
);

const GeneratorOptions = ({ 
    mode, setMode, contentType, setContentType, contentData, updateContent, 
    isEncrypted, setIsEncrypted, styleType, setStyleType, 
    eyeStyle, setEyeStyle, fgColor, setFgColor, 
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

    const styles = [
        { id: 'standard', label: 'Classic', icon: Box },
        { id: 'rounded', label: 'Smooth', icon: Circle },
        { id: 'neon', label: 'Neon', icon: Zap },
        { id: 'dots', label: 'Dots', icon: Grid },
    ];

    const eyeStyles = [
        { id: 'square', label: 'Square' },
        { id: 'circle', label: 'Circle' },
        { id: 'rounded', label: 'Rounded' },
    ];

    return (
        <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-y-auto custom-scrollbar h-full">
            {/* MODE TOGGLE */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-100 mb-6">
                <button 
                    onClick={() => setMode('create')}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${mode === 'create' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Create
                </button>
                <button 
                    onClick={() => setMode('verify')}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${mode === 'verify' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Verify (Read)
                </button>
            </div>

            {mode === 'create' ? (
                <>
            {/* 1. CONTENT TYPE SELECTOR */}
            <div>
                <SectionHeader icon={Type} title="Data Type" />
                <div className="grid grid-cols-5 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    {contentTypes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setContentType(t.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${contentType === t.id ? 'bg-white shadow-md text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <t.icon size={20} />
                        </button>
                    ))}
                </div>
            </div>

            {/* DYNAMIC FORMS */}
            <div className="relative">
                {contentType === 'text' && (
                    <textarea 
                        value={contentData.text}
                        onChange={(e) => updateContent('text', null, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                        rows="4"
                        placeholder="Enter text here..."
                    />
                )}

                {contentType === 'url' && (
                    <Input 
                        value={contentData.url}
                        onChange={(e) => updateContent('url', null, e.target.value)}
                        placeholder="https://example.com"
                    />
                )}

                {contentType === 'wifi' && (
                    <div className="space-y-3">
                        <Input label="SSID" value={contentData.wifi.ssid} onChange={(e) => updateContent('wifi', 'ssid', e.target.value)} placeholder="Network Name" />
                        <Input label="Password" type="password" value={contentData.wifi.password} onChange={(e) => updateContent('wifi', 'password', e.target.value)} placeholder="Password" />
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Security</label>
                            <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
                                {['WPA', 'WEP', 'nopass'].map(enc => (
                                    <button 
                                        key={enc}
                                        onClick={() => updateContent('wifi', 'encryption', enc)}
                                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${contentData.wifi.encryption === enc ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
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
                            <Input label="First Name" value={contentData.vcard.firstName} onChange={(e) => updateContent('vcard', 'firstName', e.target.value)} placeholder="John" />
                            <Input label="Last Name" value={contentData.vcard.lastName} onChange={(e) => updateContent('vcard', 'lastName', e.target.value)} placeholder="Doe" />
                        </div>
                        <Input label="Mobile" value={contentData.vcard.mobile} onChange={(e) => updateContent('vcard', 'mobile', e.target.value)} placeholder="+91 234 567 890" />
                        <Input label="Email" value={contentData.vcard.email} onChange={(e) => updateContent('vcard', 'email', e.target.value)} placeholder="john@example.com" />
                        <Input label="Company" value={contentData.vcard.company} onChange={(e) => updateContent('vcard', 'company', e.target.value)} placeholder="Acme Inc." />
                        <Input label="Website" value={contentData.vcard.website} onChange={(e) => updateContent('vcard', 'website', e.target.value)} placeholder="https://" />
                    </div>
                )}

                {contentType === 'email' && (
                    <div className="space-y-3">
                        <Input label="To" value={contentData.email.to} onChange={(e) => updateContent('email', 'to', e.target.value)} placeholder="recipient@example.com" />
                        <Input label="Subject" value={contentData.email.subject} onChange={(e) => updateContent('email', 'subject', e.target.value)} placeholder="Hello" />
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Body</label>
                            <textarea 
                                value={contentData.email.body}
                                onChange={(e) => updateContent('email', 'body', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                rows="3"
                                placeholder="Message body..."
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={() => {
                        if (user?.subscriptionStatus === 'free') {
                            toast.error('Encryption is a Pro feature');
                            navigate('/pricing');
                        } else {
                            setIsEncrypted(!isEncrypted);
                        }
                    }}
                    className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all font-bold text-xs uppercase ${isEncrypted ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    {isEncrypted ? <Lock size={16} /> : <Unlock size={16} />}
                    {isEncrypted ? 'Encrypted' : 'Standard (Unsecured)'}
                </button>
            </div>

            {/* STYLE */}
            <div>
                <SectionHeader icon={Grid} title="Pattern" />
                <div className="grid grid-cols-4 gap-3">
                    {styles.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => setStyleType(style.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                                styleType === style.id 
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-inner' 
                                : 'border-slate-100 hover:bg-slate-50 text-slate-500'
                            }`}
                        >
                            <style.icon size={20} />
                            <span className="text-[10px] font-bold mt-2">{style.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* EYES */}
            <div>
                <SectionHeader icon={Box} title="Eye Shape" />
                <div className="grid grid-cols-3 gap-2">
                    {eyeStyles.map((eye) => (
                        <button
                            key={eye.id}
                            onClick={() => setEyeStyle(eye.id)}
                            className={`py-3 px-2 text-xs font-bold rounded-xl border transition-all ${
                                eyeStyle === eye.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            {eye.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* COLORS */}
            <div>
                <SectionHeader icon={Palette} title="Colors" />
                
                {/* Gradient Toggle */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Use Gradient</span>
                    <button 
                        onClick={() => {
                            if (user?.subscriptionStatus === 'free') {
                                toast.error('Gradients are a Pro feature');
                                navigate('/pricing');
                            } else {
                                setGradient(prev => ({ ...prev, active: !prev.active }));
                            }
                        }}
                        className={`w-12 h-6 rounded-full relative transition-colors ${gradient.active ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    >
                        <motion.div 
                            className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"
                            animate={{ x: gradient.active ? 24 : 0 }}
                        />
                    </button>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                            {gradient.active ? 'Start Color' : 'Foreground'}
                        </label>
                        <input 
                            type="color" 
                            value={gradient.active ? gradient.start : fgColor}
                            onChange={(e) => {
                                if (gradient.active) setGradient({...gradient, start: e.target.value});
                                else setFgColor(e.target.value);
                            }}
                            className="w-full h-12 rounded-xl cursor-pointer border-none shadow-sm"
                        />
                    </div>
                    {gradient.active && (
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">End Color</label>
                            <input 
                                type="color" 
                                value={gradient.end}
                                onChange={(e) => setGradient({...gradient, end: e.target.value})}
                                className="w-full h-12 rounded-xl cursor-pointer border-none shadow-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* LOGO */}
            <div>
                <SectionHeader icon={ImageIcon} title="Logo (Brand)" />
                
                {!logo ? (
                    <div className="border-2 border-dashed border-indigo-100 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative group">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Upload Your Logo</span>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-[1.5rem] border border-slate-100 shadow-inner">
                            <div className="w-14 h-14 bg-white rounded-xl border border-white shadow-sm flex items-center justify-center overflow-hidden">
                                <img src={logo} alt="Logo" className="max-w-full max-h-full" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-700">Logo Uploaded</p>
                                <button 
                                    onClick={() => setLogo(null)}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-bold mt-1 flex items-center gap-1.5"
                                >
                                    <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center text-xs">×</div>
                                    Remove Logo
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase mb-3 block">Logo Background</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setLogoBgColor('transparent')}
                                    className={`py-3 px-2 text-[10px] font-bold rounded-xl border transition-all ${
                                        logoBgColor === 'transparent'
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-black/10'
                                        : 'bg-white border-slate-200 text-slate-500'
                                    }`}
                                >
                                    Transparent
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setLogoBgColor('#ffffff')}
                                        className={`flex-1 h-10 rounded-xl border transition-all shadow-sm ${logoBgColor === '#ffffff' ? 'ring-2 ring-indigo-500 ring-offset-2 border-white' : 'border-slate-100 bg-white'}`}
                                        style={{backgroundColor: '#ffffff'}}
                                    />
                                    <div className="flex-1 h-10 rounded-xl border border-slate-100 overflow-hidden relative shadow-sm">
                                        <input 
                                            type="color" 
                                            value={logoBgColor === 'transparent' ? '#ffffff' : logoBgColor}
                                            onChange={(e) => setLogoBgColor(e.target.value)}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
                </>
            ) : (
                /* VERIFY MODE UI */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <Lock size={20} className="text-indigo-200" />
                            Secret Decoder
                        </h3>
                        <p className="text-indigo-100 text-xs font-medium leading-relaxed relative z-10 opacity-90">
                            Standard QR scanners will only show usage gibberish. Paste that unique code here to reveal the hidden message.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Gibberish Code</label>
                        <textarea 
                            value={decryptInput}
                            onChange={(e) => setDecryptInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-mono text-slate-600 min-h-[150px]"
                            placeholder="Paste the scanned code here... (e.g., U2FsdGVkX1...)"
                        />
                    </div>

                    <button 
                        onClick={handleDecrypt}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <Unlock size={20} />
                        <span>Decrypt Now</span>
                    </button>

                    {decryptedResult.text && (
                        <button 
                            onClick={() => {
                                setDecryptInput('');
                                setDecryptedResult({ text: '', error: false });
                            }}
                            className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase transition-colors"
                        >
                            Reset Decoder
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeneratorOptions;

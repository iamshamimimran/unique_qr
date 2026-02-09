import React, { useState, useEffect } from 'react';
import { generateQRMatrix } from '../utils/qrLogic';
import { encryptData, decryptData } from '../utils/encryption';
import CanvasRenderer from './CanvasRenderer';
import { Download, Share2, Lock, Unlock, Zap, Circle, Grid, Box, Image as ImageIcon, Palette, Type, Upload, Link, User, Wifi, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Utility: Generate QR Content String ---
const generateQRContent = (type, data) => {
    if (type === 'text') return data.text || '';
    if (type === 'url') return data.url || '';
    if (type === 'wifi') {
        const { ssid, password, encryption, hidden } = data.wifi || {};
        if (!ssid) return '';
        const enc = encryption === 'nopass' ? '' : `T:${encryption};`;
        const pass = encryption === 'nopass' ? '' : `P:${password};`;
        const hid = hidden ? 'H:true;' : '';
        return `WIFI:S:${ssid};${enc}${pass}${hid};`;
    }
    if (type === 'vcard') {
        const { firstName, lastName, phone, mobile, email, website, company, job, street, city, zip, country } = data.vcard || {};
        if (!firstName && !lastName && !company) return ''; // Minimal check
        
        let vcard = `BEGIN:VCARD\nVERSION:3.0\n`;
        vcard += `N:${lastName || ''};${firstName || ''};;;\n`;
        vcard += `FN:${firstName || ''} ${lastName || ''}\n`.trim() + '\n';
        if (company) vcard += `ORG:${company}\n`;
        if (job) vcard += `TITLE:${job}\n`;
        if (mobile) vcard += `TEL;TYPE=CELL:${mobile}\n`;
        if (phone) vcard += `TEL;TYPE=WORK:${phone}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (website) vcard += `URL:${website}\n`;
        if (street || city || country) vcard += `ADR;TYPE=WORK:;;${street || ''};${city || ''};;${zip || ''};${country || ''}\n`;
        vcard += `END:VCARD`;
        return vcard;
    }
    if (type === 'email') {
         const { to, subject, body } = data.email || {};
         return `mailto:${to}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`;
    }
    return '';
};

// --- UI Components ---
const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm uppercase tracking-wide mb-3 mt-4">
        <Icon size={16} />
        <span>{title}</span>
    </div>
);

// Helper Input
const Input = ({ label, value, onChange, placeholder, type="text" }) => (
    <div className="mb-2">
        {label && <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{label}</label>}
        <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
    </div>
);

const QRGenerator = () => {
    // --- State ---
    const [mode, setMode] = useState('create'); // 'create' | 'verify'
    
    // Content State
    const [contentType, setContentType] = useState('text'); // text, url, wifi, vcard, email
    const [contentData, setContentData] = useState({
        text: 'Unique QR Code',
        url: 'https://',
        wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
        vcard: { firstName: '', lastName: '', phone: '', mobile: '', email: '', website: '', company: '', job: '', street: '', city: '', zip: '', country: '' },
        email: { to: '', subject: '', body: '' }
    });

    const [matrix, setMatrix] = useState([]);
    const [isEncrypted, setIsEncrypted] = useState(false);
    
    // Decrypt State
    const [decryptInput, setDecryptInput] = useState('');
    const [decryptedResult, setDecryptedResult] = useState({ text: '', error: false });
    
    // Style State
    const [styleType, setStyleType] = useState('standard');
    const [eyeStyle, setEyeStyle] = useState('square');
    const [fgColor, setFgColor] = useState('#6366f1');
    const [bgColor, setBgColor] = useState('#ffffff');
    
    // Pro Features
    const [gradient, setGradient] = useState({ active: false, start: '#6366f1', end: '#ec4899' });
    const [logo, setLogo] = useState(null);
    const [logoBgColor, setLogoBgColor] = useState('#ffffff');

    // Initial Generation & Updates
    useEffect(() => {
        if (mode === 'create') {
            let rawContent = generateQRContent(contentType, contentData);
            
            // If encrypted, we encrypt the FINAL string
            // Note: Encrypting a vCard means phones won't recognize it as a contact until decrypted. This is intended behavior for "hidden" messages.
            const contentToEncode = isEncrypted ? encryptData(rawContent) : rawContent;
            
            // Debounce slightly for complex inputs to avoid lag?
            const timeoutId = setTimeout(() => {
                generateQRMatrix(contentToEncode).then(setMatrix);
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [contentData, contentType, isEncrypted, mode]);

    const updateContent = (type, field, value) => {
        setContentData(prev => {
            if (type === 'text') return { ...prev, text: value };
            if (type === 'url') return { ...prev, url: value };
            return {
                ...prev,
                [type]: { ...prev[type], [field]: value }
            };
        });
    };

    const handleDownload = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `unique-qr-${contentType}-${Date.now()}.png`;
            a.click();
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setLogo(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDecrypt = () => {
        if (!decryptInput) return;
        try {
             const result = decryptData(decryptInput);
             if (result) {
                 setDecryptedResult({ text: result, error: false });
             } else {
                 setDecryptedResult({ text: 'Could not decrypt. Is this a valid Unique QR?', error: true });
             }
        } catch (e) {
            setDecryptedResult({ text: 'Decryption Error', error: true });
        }
    };

    // --- Config Data ---
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
    
    const contentTypes = [
        { id: 'text', label: 'Text', icon: Type },
        { id: 'url', label: 'URL', icon: Link },
        { id: 'wifi', label: 'WiFi', icon: Wifi },
        { id: 'vcard', label: 'Contact', icon: User },
        { id: 'email', label: 'Email', icon: Mail },
    ];



    return (
        <div className="w-full h-screen overflow-hidden bg-slate-100 flex text-slate-800 font-sans">
            
            {/* --- SIDEBAR CONTROLS --- */}
            <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-slate-100 bg-white z-10 space-y-4">
                    
                    {/* MODE TOGGLE */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setMode('create')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'create' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Create
                        </button>
                        <button 
                            onClick={() => setMode('verify')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'verify' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Verify (Read)
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    
                    {mode === 'create' ? (
                        <>
                            {/* 1. CONTENT TYPE SELECTOR */}
                            <div className="group">
                                <SectionHeader icon={Type} title="Data Type" />
                                <div className="grid grid-cols-5 gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                    {contentTypes.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setContentType(t.id)}
                                            title={t.label}
                                            className={`flex flex-col items-center justify-center p-2 rounded-md transition-all ${contentType === t.id ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            <t.icon size={16} />
                                        </button>
                                    ))}
                                </div>
                                <div className="text-center mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {contentTypes.find(c => c.id === contentType)?.label}
                                </div>
                            </div>

                            {/* DYNAMIC FORMS */}
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="relative">
                                    {/* TEXT FORM */}
                                    {contentType === 'text' && (
                                        <textarea 
                                            value={contentData.text}
                                            onChange={(e) => updateContent('text', null, e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                            rows="4"
                                            placeholder="Enter generic text..."
                                        />
                                    )}

                                    {/* URL FORM */}
                                    {contentType === 'url' && (
                                        <div className="relative">
                                            <Link size={14} className="absolute top-3 left-3 text-slate-400"/>
                                            <input 
                                                value={contentData.url}
                                                onChange={(e) => updateContent('url', null, e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    )}

                                    {/* WIFI FORM */}
                                    {contentType === 'wifi' && (
                                        <div className="space-y-2">
                                           <Input 
                                                label="Network Name (SSID)" 
                                                value={contentData.wifi.ssid} 
                                                onChange={(e) => updateContent('wifi', 'ssid', e.target.value)} 
                                                placeholder="MyNetwork"
                                           />
                                           <Input 
                                                label="Password" 
                                                type="password"
                                                value={contentData.wifi.password} 
                                                onChange={(e) => updateContent('wifi', 'password', e.target.value)} 
                                                placeholder="Required for WPA/WEP"
                                           />
                                           <div>
                                               <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Security</label>
                                               <div className="flex bg-slate-50 rounded-md p-1 border border-slate-200">
                                                   {['WPA', 'WEP', 'nopass'].map(enc => (
                                                       <button 
                                                            key={enc}
                                                            onClick={() => updateContent('wifi', 'encryption', enc)}
                                                            className={`flex-1 py-1 text-[10px] font-bold rounded ${contentData.wifi.encryption === enc ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}
                                                       >
                                                           {enc === 'nopass' ? 'Open' : enc}
                                                       </button>
                                                   ))}
                                               </div>
                                           </div>
                                        </div>
                                    )}
                                    
                                    {/* VCARD FORM */}
                                    {contentType === 'vcard' && (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Input label="First Name" value={contentData.vcard.firstName} onChange={(e) => updateContent('vcard', 'firstName', e.target.value)} placeholder="John" />
                                                </div>
                                                <div className="flex-1">
                                                    <Input label="Last Name" value={contentData.vcard.lastName} onChange={(e) => updateContent('vcard', 'lastName', e.target.value)} placeholder="Doe" />
                                                </div>
                                            </div>
                                            <Input label="Mobile" value={contentData.vcard.mobile} onChange={(e) => updateContent('vcard', 'mobile', e.target.value)} placeholder="+91 234 567 890" />
                                            <Input label="Email" value={contentData.vcard.email} onChange={(e) => updateContent('vcard', 'email', e.target.value)} placeholder="john@example.com" />
                                            <Input label="Company" value={contentData.vcard.company} onChange={(e) => updateContent('vcard', 'company', e.target.value)} placeholder="Acme Inc." />
                                            <Input label="Website" value={contentData.vcard.website} onChange={(e) => updateContent('vcard', 'website', e.target.value)} placeholder="https://" />
                                        </div>
                                    )}
                                    
                                    {/* EMAIL FORM */}
                                    {contentType === 'email' && (
                                        <div className="space-y-2">
                                            <Input label="Send To" value={contentData.email.to} onChange={(e) => updateContent('email', 'to', e.target.value)} placeholder="recipient@example.com" />
                                            <Input label="Subject" value={contentData.email.subject} onChange={(e) => updateContent('email', 'subject', e.target.value)} placeholder="Hello there" />
                                            <div>
                                                 <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Body</label>
                                                 <textarea 
                                                    value={contentData.email.body}
                                                    onChange={(e) => updateContent('email', 'body', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                                    rows="3"
                                                 />
                                            </div>
                                        </div>
                                    )}

                                    {/* ENCRYPTION TOGGLE */}
                                    <button
                                        onClick={() => setIsEncrypted(!isEncrypted)}
                                        className={`absolute -bottom-8 right-0 flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${isEncrypted ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                        title="Toggle Encryption"
                                    >
                                        <span className="text-[10px] font-bold uppercase">{isEncrypted ? 'Encrypted' : 'Standard'}</span>
                                        {isEncrypted ? <Lock size={12} /> : <Unlock size={12} />}
                                    </button>
                                </div>
                            </div>

                            {/* 2. STYLE */}
                            <div>
                                <SectionHeader icon={Grid} title="Pattern" />
                                <div className="grid grid-cols-4 gap-2">
                                    {styles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setStyleType(style.id)}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                                styleType === style.id 
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                                                : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                                            }`}
                                        >
                                            <style.icon size={18} />
                                            <span className="text-[10px] font-semibold mt-1">{style.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. EYES */}
                            <div>
                                <SectionHeader icon={Box} title="Eye Shape" />
                                <div className="flex gap-2">
                                    {eyeStyles.map((eye) => (
                                        <button
                                            key={eye.id}
                                            onClick={() => setEyeStyle(eye.id)}
                                            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded border transition-all ${
                                                eyeStyle === eye.id
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            {eye.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 4. COLORS & GRADIENT */}
                            <div>
                                <SectionHeader icon={Palette} title="Color" />
                                
                                {/* Gradient Toggle */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className="text-xs text-slate-500 font-medium">Use Gradient</span>
                                    <button 
                                        onClick={() => setGradient(prev => ({ ...prev, active: !prev.active }))}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${gradient.active ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                    >
                                        <motion.div 
                                            className="w-3 h-3 bg-white rounded-full absolute top-1 left-1"
                                            animate={{ x: gradient.active ? 20 : 0 }}
                                        />
                                    </button>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">
                                            {gradient.active ? 'Start' : 'Solid'}
                                        </label>
                                        <div className="h-8 rounded-md border border-slate-200 overflow-hidden relative">
                                            <input 
                                                type="color" 
                                                value={gradient.active ? gradient.start : fgColor}
                                                onChange={(e) => {
                                                    if (gradient.active) setGradient({...gradient, start: e.target.value});
                                                    else setFgColor(e.target.value);
                                                }}
                                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    
                                    {gradient.active && (
                                        <div className="flex-1">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase mb-1 block">End</label>
                                            <div className="h-8 rounded-md border border-slate-200 overflow-hidden relative">
                                                <input 
                                                    type="color" 
                                                    value={gradient.end}
                                                    onChange={(e) => setGradient({...gradient, end: e.target.value})}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 5. LOGO */}
                            <div>
                                <SectionHeader icon={ImageIcon} title="Logo (Brand)" />
                                
                                {!logo ? (
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                        <Upload className="text-slate-300 mb-2" size={24} />
                                        <span className="text-xs text-slate-500">Click to upload logo</span>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                            <div className="w-12 h-12 bg-white rounded border border-slate-100 flex items-center justify-center overflow-hidden">
                                                <img src={logo} alt="Logo" className="max-w-full max-h-full" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-700">Logo Uploaded</p>
                                                <button 
                                                    onClick={() => setLogo(null)}
                                                    className="text-[10px] text-red-500 hover:text-red-700 font-medium mt-1 flex items-center gap-1"
                                                >
                                                    <span className="w-3 h-3 rounded-full bg-red-100 flex items-center justify-center text-xs">×</span>
                                                    Remove Logo
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] text-slate-400 font-bold uppercase mb-2 block">Logo Background</label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setLogoBgColor('transparent')}
                                                    className={`flex-1 py-1 px-2 text-[10px] font-medium rounded border transition-all ${
                                                        logoBgColor === 'transparent'
                                                        ? 'bg-slate-800 text-white border-slate-800'
                                                        : 'bg-white border-slate-200 text-slate-600'
                                                    }`}
                                                >
                                                    None (Transparent)
                                                </button>
                                                <div className="flex-1 flex gap-2">
                                                    {/* White */}
                                                    <button
                                                        onClick={() => setLogoBgColor('#ffffff')}
                                                        className={`flex-1 h-7 rounded border transition-all ${logoBgColor === '#ffffff' ? 'ring-2 ring-indigo-500 ring-offset-1 border-slate-300' : 'border-slate-200 bg-white'}`}
                                                        style={{backgroundColor: '#ffffff'}}
                                                        title="White"
                                                    />
                                                    {/* Custom */}
                                                    <div className="flex-1 h-7 rounded border border-slate-200 overflow-hidden relative">
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
                        /* --- VERIFY MODE UI --- */
                        <div className="space-y-6">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h3 className="text-indigo-900 font-bold text-sm mb-2 flex items-center gap-2">
                                    <Lock size={16} />
                                    Secret Decoder
                                </h3>
                                <p className="text-indigo-700/80 text-xs leading-relaxed">
                                    Standard QR scanners will only show usage gibberish. Paste that gibberish here to reveal the hidden message.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encrypted Text</label>
                                <textarea 
                                    value={decryptInput}
                                    onChange={(e) => setDecryptInput(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-xs text-slate-600"
                                    rows="5"
                                    placeholder="Paste the scanned code here (e.g., U2FsdGVkX1...)"
                                />
                            </div>

                            <button 
                                onClick={handleDecrypt}
                                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Unlock size={18} />
                                <span>Decrypt Message</span>
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* --- MAIN PREVIEW AREA --- */}
            <div className="flex-1 relative flex items-center justify-center bg-slate-100 p-8">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>

                {mode === 'create' ? (
                    <div className="relative flex flex-col items-center gap-6">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-indigo-500/10 border border-slate-200/50"
                        >
                            <CanvasRenderer 
                                matrix={matrix} 
                                size={380} 
                                styleType={styleType}
                                fgColor={fgColor}
                                bgColor={bgColor} // We could add a background toggle too
                                gradientInfo={gradient}
                                eyeStyle={eyeStyle}
                                logoImage={logo}
                                logoBgColor={logoBgColor}
                            />
                        </motion.div>

                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-transform"
                        >
                            <Download size={18} />
                            <span>Export PNG</span>
                        </button>
                    </div>
                ) : (
                    /* VERIFY MODE PREVIEW */
                     <div className="relative flex flex-col items-center gap-6 max-w-xl text-center">
                        <AnimatePresence mode="wait">
                            {decryptedResult.text ? (
                                <motion.div 
                                    key="result"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0.4 }}
                                    className={`relative p-10 rounded-3xl shadow-2xl border-2 ${
                                        decryptedResult.error 
                                        ? 'bg-red-50 border-red-200 shadow-red-500/10' 
                                        : 'bg-white border-green-200 shadow-green-500/10'
                                    }`}
                                >
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                                        decryptedResult.error ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
                                    }`}>
                                        {decryptedResult.error ? <Lock size={40} /> : <Unlock size={40} />}
                                    </div>
                                    
                                    <h2 className={`text-2xl font-bold mb-2 ${decryptedResult.error ? 'text-red-900' : 'text-slate-800'}`}>
                                        {decryptedResult.error ? 'Checking Failed' : 'Message Decoded'}
                                    </h2>
                                    
                                    <div className={`text-lg font-medium leading-relaxed p-4 rounded-xl ${
                                        decryptedResult.error ? 'text-red-600 bg-red-100/50' : 'text-slate-700 bg-slate-50 border border-slate-100'
                                    }`}>
                                        {decryptedResult.text}
                                    </div>
                                    
                                    <button 
                                        onClick={() => setDecryptedResult({ text: '', error: false })}
                                        className="mt-8 text-sm font-semibold text-slate-400 hover:text-slate-600"
                                    >
                                        Clear Result
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="instruction"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-inner">
                                        <Lock size={48} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Secure Reader</h2>
                                    <p className="text-slate-500 text-lg leading-relaxed">
                                        Scan your Unique QR with any phone camera.<br/>
                                        Paste the "gibberish" code into the sidebar.<br/>
                                        <span className="text-indigo-600 font-semibold">We'll reveal the secret here.</span>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}


            </div>

        </div>
    );
};

export default QRGenerator;
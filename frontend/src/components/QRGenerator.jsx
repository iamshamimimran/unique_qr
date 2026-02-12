import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateQRMatrix } from '../utils/qrLogic';
import { encryptData, decryptData } from '../utils/encryption';
import GeneratorOptions from './Dashboard/Generator/GeneratorOptions';
import GeneratorPreview from './Dashboard/Generator/GeneratorPreview';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

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
        if (!firstName && !lastName && !company) return '';
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

const QRGenerator = () => {
    const { user, refreshUser, API_URL } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    const [mode, setMode] = useState('create'); // 'create' | 'verify'

    const [contentType, setContentType] = useState('text');
    const [contentData, setContentData] = useState({
        text: 'Unique QR Code',
        url: 'https://',
        wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
        vcard: { firstName: '', lastName: '', phone: '', mobile: '', email: '', website: '', company: '', job: '', street: '', city: '', zip: '', country: '' },
        email: { to: '', subject: '', body: '' }
    });

    // Decrypt State
    const [decryptInput, setDecryptInput] = useState('');
    const [decryptedResult, setDecryptedResult] = useState({ text: '', error: false });

    const [matrix, setMatrix] = useState([]);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [styleType, setStyleType] = useState('standard');
    const [eyeStyle, setEyeStyle] = useState('square');
    const [fgColor, setFgColor] = useState('#6366f1');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [gradient, setGradient] = useState({ active: false, start: '#6366f1', end: '#ec4899' });
    const [logo, setLogo] = useState(null);
    const [logoBgColor, setLogoBgColor] = useState('#ffffff');
    const [isSaving, setIsSaving] = useState(false);

    const [trackScans, setTrackScans] = useState(false);

    useEffect(() => {
        if (mode === 'create') {
            let rawContent = generateQRContent(contentType, contentData);
            const contentToEncode = isEncrypted ? encryptData(rawContent) : rawContent;
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
                [type]: field ? { ...prev[type], [field]: value } : value
            };
        });
    };

    const handleSave = async () => {
        if (!user) return navigate('/login');
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const content = generateQRContent(contentType, contentData);
            
            const response = await axios.post(`${API_URL}/qr`, {
                content,
                type: contentType,
                style: { styleType, eyeStyle, fgColor, bgColor, gradient, logo, logoBgColor },
                trackScans
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await refreshUser();
            toast.success('QR saved to history!');
            
            // If tracking is enabled, regenerate the matrix with the short URL
            if (trackScans && response.data.shortId) {
                 const shortUrl = `${window.location.protocol}//${window.location.hostname}:5000/r/${response.data.shortId}`;
                 const newMatrix = await generateQRMatrix(shortUrl);
                 setMatrix(newMatrix);
                 return { ...response.data, shortUrl }; // Return shortUrl for download
            }
            
            return response.data;
        } catch (error) {
            console.error(error);
            toast.error('Failed to save QR');
        } finally {
            setIsSaving(false);
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

    const handleDownload = async () => {
        if (!user) return navigate('/login');
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const res = await handleSave(); // Increment and save on backend
            if (res) {
                const url = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = url;
                a.download = `unique-qr-${contentType}-${Date.now()}.png`;
                a.click();
            }
        }
    };

    const isLimitReached = user?.subscriptionStatus === 'free' && (user?.qrCount || 0) >= 5;

    const componentProps = {
        mode, setMode, contentType, setContentType, contentData, updateContent,
        isEncrypted, setIsEncrypted, styleType, setStyleType,
        eyeStyle, setEyeStyle, fgColor, setFgColor,
        gradient, setGradient, logo, setLogo, bgColor, setBgColor,
        logoBgColor, setLogoBgColor, user, navigate,
        matrix, isSaving, isLimitReached,
        onDownload: handleDownload, onSave: handleSave,
        handleLogoUpload, decryptInput, setDecryptInput, 
        handleDecrypt, decryptedResult, setDecryptedResult,
        trackScans, setTrackScans
    };

    return (
        <div className={`w-full ${isDashboard ? 'h-full flex flex-col lg:flex-row' : 'min-h-screen bg-slate-950 flex flex-col md:flex-row'} gap-4 md:gap-6 overflow-hidden`}>
            {/* Options Panel - Responsive width */}
            <div className={`
                shrink-0 flex flex-col z-20 transition-all duration-300
                ${isDashboard ? 'w-full lg:w-[350px] lg:h-full h-auto max-h-[40vh] lg:max-h-none' : 'w-full md:w-[360px] h-full'}
            `}>
                <GeneratorOptions {...componentProps} />
            </div>

            {/* Preview Panel - Fluid */}
            <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-900/30 rounded-[2rem] border border-white/5 backdrop-blur-xl relative overflow-hidden ring-1 ring-white/5 shadow-2xl">
                 {/* Decorative background blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 w-full h-full p-6 md:p-8 overflow-y-auto custom-scrollbar flex items-center justify-center">
                    <GeneratorPreview {...componentProps} />
                </div>
            </div>
        </div>
    );
};

export default QRGenerator;
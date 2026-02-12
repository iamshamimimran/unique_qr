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
            const response = await axios.post(`${API_URL}/qr`, {
                content: generateQRContent(contentType, contentData),
                type: contentType,
                style: { styleType, eyeStyle, fgColor, bgColor, gradient, logo, logoBgColor }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await refreshUser();
            toast.success('QR saved to history!');
            return response.data;
        } catch (error) {
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
        gradient, setGradient, logo, setLogo,
        logoBgColor, setLogoBgColor, user, navigate,
        matrix, bgColor, isSaving, isLimitReached,
        onDownload: handleDownload, onSave: handleSave,
        handleLogoUpload, decryptInput, setDecryptInput, 
        handleDecrypt, decryptedResult, setDecryptedResult
    };

    return (
        <div className={`w-full ${isDashboard ? 'h-full' : 'h-screen overflow-hidden bg-slate-100'} flex text-slate-800 font-sans`}>
            {/* Options Panel */}
            <div className={`${isDashboard ? 'w-1/3 pr-6' : 'w-80 bg-white border-r border-slate-200 flex flex-col shadow-2xl z-20 overflow-y-auto'}`}>
                <GeneratorOptions {...componentProps} />
            </div>

            {/* Preview Panel */}
            <div className="flex-1">
                <GeneratorPreview {...componentProps} />
            </div>
        </div>
    );
};

export default QRGenerator;
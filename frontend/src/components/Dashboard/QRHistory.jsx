import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Download, Trash2, ExternalLink, QrCode as QrIcon, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import CanvasRenderer from '../CanvasRenderer';
import { generateQRMatrix } from '../../utils/qrLogic';

const QRHistory = () => {
    const { API_URL } = useAuth();
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Download State
    const [downloadingId, setDownloadingId] = useState(null);
    const [tempMatrix, setTempMatrix] = useState([]);
    const [tempStyle, setTempStyle] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/qr`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrs(response.data);
        } catch (error) {
            console.error('Error fetching history', error);
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/qr/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrs(qrs.filter(qr => qr._id !== id));
            toast.success('QR deleted from history');
        } catch (error) {
            toast.error('Failed to delete QR');
        }
    };

    const handleDownloadClick = async (qr) => {
        setDownloadingId(qr._id);
        setTempStyle(qr.style);
        try {
            const matrix = await generateQRMatrix(qr.content);
            setTempMatrix(matrix);
        } catch (error) {
            toast.error('Failed to generate for download');
            setDownloadingId(null);
        }
    };

    const handleDownloadRender = (canvas) => {
        if (!downloadingId) return;

        try {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `unique-qr-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success('Download started');
        } catch (error) {
            console.error(error);
            toast.error('Download failed');
        } finally {
            setDownloadingId(null);
            setTempMatrix([]);
            setTempStyle(null);
        }
    };

    const filteredQrs = qrs.filter(qr => 
        qr.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
        qr.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-96 w-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white tracking-tight">QR History</h1>
                    <p className="text-gray-400 font-medium pt-1">Manage and re-download your previously generated QR codes.</p>
                </div>

                <div className="flex gap-3">
                    <Input 
                        icon={Search}
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64"
                        fullWidth={false}
                    />
                </div>
            </header>

            {filteredQrs.length === 0 ? (
                <Card className="p-20 text-center bg-white/5 border-white/5">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 border border-white/5">
                        <QrIcon size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No QR codes found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Start generating unique QR codes, and they will appear here in your history.</p>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredQrs.map((qr, i) => (
                            <motion.div 
                                key={qr._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="p-6 bg-white/5 border-white/5 hover:border-indigo-500/30 transition-colors group overflow-hidden relative h-full flex flex-col">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button 
                                            onClick={() => handleDelete(qr._id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white p-3 shadow-lg shadow-indigo-500/20 shrink-0">
                                            <QrIcon size={28} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase">
                                                    {qr.type}
                                                </span>
                                                {qr.shortId && (
                                                    <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase">
                                                        {qr.scans || 0} Scans
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-bold text-gray-200 truncate mb-1 text-sm">
                                                {qr.content}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase">
                                                {new Date(qr.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-auto">
                                        <Button 
                                            className="flex-1 text-xs" 
                                            size="sm" 
                                            icon={Download}
                                            onClick={() => handleDownloadClick(qr)}
                                            isLoading={downloadingId === qr._id}
                                            disabled={!!downloadingId}
                                        >
                                            {downloadingId === qr._id ? 'Preparing...' : 'Download'}
                                        </Button>
                                        
                                        {qr.shortId ? (
                                            <Button
                                                className={`flex-1 text-xs ${!qr.isActive ? 'opacity-75' : ''}`}
                                                size="sm"
                                                variant={qr.isActive ? 'primary' : 'outline'}
                                                onClick={async () => {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        const res = await axios.put(`${API_URL}/qr/${qr._id}/status`, {}, {
                                                            headers: { Authorization: `Bearer ${token}` }
                                                        });
                                                        setQrs(qrs.map(q => q._id === qr._id ? res.data : q));
                                                        toast.success(`QR ${res.data.isActive ? 'Activated' : 'Deactivated'}`);
                                                    } catch (e) {
                                                        toast.error('Failed to update status');
                                                    }
                                                }}
                                            >
                                                {qr.isActive ? 'Active' : 'Inactive'}
                                            </Button>
                                        ) : (
                                            <button className="flex-1 text-[10px] font-bold uppercase text-gray-600 border border-white/5 rounded-lg cursor-not-allowed" disabled>
                                                Static
                                            </button>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            
            {/* Hidden Renderer for Downloads */}
            {downloadingId && tempStyle && (
                <div style={{ position: 'absolute', top: -9999, left: -9999, visibility: 'hidden' }}>
                    <CanvasRenderer 
                        matrix={tempMatrix}
                        size={1000} // High res for download
                        styleType={tempStyle.styleType}
                        fgColor={tempStyle.fgColor}
                        bgColor={tempStyle.bgColor}
                        gradientInfo={tempStyle.gradient}
                        eyeStyle={tempStyle.eyeStyle}
                        logoImage={tempStyle.logo}
                        logoBgColor={tempStyle.logoBgColor}
                        onRender={handleDownloadRender}
                    />
                </div>
            )}
        </div>
    );
};

export default QRHistory;

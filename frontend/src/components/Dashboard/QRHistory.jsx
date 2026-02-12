import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Download, Trash2, ExternalLink, QrCode as QrIcon, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const QRHistory = () => {
    const { API_URL } = useAuth();
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">QR History</h1>
                    <p className="text-slate-500 font-medium">Manage and re-download your previously generated QR codes.</p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {filteredQrs.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200 shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <QrIcon size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No QR codes found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Start generating unique QR codes, and they will appear here in your history.</p>
                </div>
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
                                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleDelete(qr._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white p-3">
                                        <QrIcon size={32} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase mb-1">
                                            {qr.type}
                                        </span>
                                        <p className="font-bold text-slate-800 truncate mb-1">
                                            {qr.content}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                                            {new Date(qr.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors">
                                        <Download size={14} />
                                        Download
                                    </button>
                                    <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default QRHistory;

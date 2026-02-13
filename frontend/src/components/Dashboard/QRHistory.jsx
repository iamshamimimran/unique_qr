import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Download, 
    Trash2, 
    QrCode as QrIcon, 
    Search, 
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Check,
    X,
    Calendar,
    Tag
} from 'lucide-react';
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
    
    // Table State
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const itemsPerPage = 10;

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
        if (!confirm('Are you sure you want to delete this QR code?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/qr/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrs(qrs.filter(qr => qr._id !== id));
            setSelectedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            toast.success('QR deleted');
        } catch (error) {
            toast.error('Failed to delete QR');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} QR codes?`)) return;
        
        try {
            const token = localStorage.getItem('token');
            // Execute all deletes in parallel
            await Promise.all(Array.from(selectedIds).map(id => 
                axios.delete(`${API_URL}/qr/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ));
            
            setQrs(qrs.filter(qr => !selectedIds.has(qr._id)));
            setSelectedIds(new Set());
            toast.success('Selected QRs deleted');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete some QR codes');
        }
    };

    const toggleStatus = async (qr) => {
        if (!qr.shortId) return;
        
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

    // Filtering and Sorting
    const processedQrs = useMemo(() => {
        let filtered = qrs.filter(qr => 
            qr.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
            qr.type.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            if (sortConfig.key === 'createdAt') {
                return sortConfig.direction === 'asc' 
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            }
            if (sortConfig.key === 'type') {
                return sortConfig.direction === 'asc'
                    ? a.type.localeCompare(b.type)
                    : b.type.localeCompare(a.type);
            }
            if (sortConfig.key === 'content') {
                return sortConfig.direction === 'asc'
                    ? a.content.localeCompare(b.content)
                    : b.content.localeCompare(a.content);
            }
            return 0;
        });
    }, [qrs, searchTerm, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(processedQrs.length / itemsPerPage);
    const paginatedQrs = processedQrs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedQrs.map(qr => qr._id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    if (loading) {
        return (
            <div className="h-96 w-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white tracking-tight">QR History</h1>
                    <p className="text-gray-400 font-medium pt-1">Manage, track, and organize your QR codes.</p>
                </div>

                <div className="flex gap-3 items-center">
                    {selectedIds.size > 0 && (
                        <Button 
                            variant="danger" 
                            size="sm" 
                            className="mr-2"
                            onClick={handleBulkDelete}
                        >
                            Delete Selected ({selectedIds.size})
                        </Button>
                    )}
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

            <Card className="p-0 overflow-hidden border-white/5 bg-white/5" glass={true}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 w-12">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
                                        checked={paginatedQrs.length > 0 && paginatedQrs.every(qr => selectedIds.has(qr._id))}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th 
                                    className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('content')}
                                >
                                    <div className="flex items-center gap-2">
                                        Content
                                        <ArrowUpDown size={14} className="opacity-50" />
                                    </div>
                                </th>
                                <th 
                                    className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('type')}
                                >
                                    <div className="flex items-center gap-2">
                                        Type
                                        <ArrowUpDown size={14} className="opacity-50" />
                                    </div>
                                </th>
                                <th 
                                    className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center gap-2">
                                        Created
                                        <ArrowUpDown size={14} className="opacity-50" />
                                    </div>
                                </th>
                                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {paginatedQrs.map((qr) => (
                                    <motion.tr 
                                        key={qr._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`group hover:bg-white/5 transition-colors ${selectedIds.has(qr._id) ? 'bg-indigo-500/10' : ''}`}
                                    >
                                        <td className="p-4">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
                                                checked={selectedIds.has(qr._id)}
                                                onChange={() => handleSelectOne(qr._id)}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-indigo-400 shrink-0 border border-white/10">
                                                    <QrIcon size={20} />
                                                </div>
                                                <div className="min-w-0 max-w-xs">
                                                    <p className="text-sm font-medium text-white truncate" title={qr.content}>
                                                        {qr.content}
                                                    </p>
                                                    {qr.shortId && (
                                                        <p className="text-xs text-gray-500 truncate">
                                                            Scans: {qr.scans || 0}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                                                <Tag size={12} />
                                                {qr.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar size={14} />
                                                {new Date(qr.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {qr.shortId ? (
                                                <button
                                                    onClick={() => toggleStatus(qr)}
                                                    className={`
                                                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200
                                                        ${qr.isActive 
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                                                            : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                                                        }
                                                    `}
                                                >
                                                    {qr.isActive ? <Check size={12} /> : <X size={12} />}
                                                    {qr.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-500 border border-gray-800 cursor-not-allowed">
                                                    Static
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDownloadClick(qr)}
                                                    disabled={!!downloadingId}
                                                    title="Download"
                                                    className="w-8 h-8 rounded-lg"
                                                >
                                                    {downloadingId === qr._id ? (
                                                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Download size={16} />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(qr._id)}
                                                    className="w-8 h-8 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            
                            {processedQrs.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <Search size={32} className="opacity-20" />
                                            </div>
                                            <p className="text-lg font-medium text-white mb-1">No QR codes found</p>
                                            <p className="text-sm">Try adjusting your search or generate a new one.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/5 flex items-center justify-between bg-white/5">
                        <div className="text-sm text-gray-400">
                            Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, processedQrs.length)}</span> of <span className="font-medium text-white">{processedQrs.length}</span> results
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
            
            {/* Hidden Renderer for Downloads */}
            {downloadingId && tempStyle && (
                <div style={{ position: 'absolute', top: -9999, left: -9999, visibility: 'hidden' }}>
                    <CanvasRenderer 
                        matrix={tempMatrix}
                        size={1000}
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

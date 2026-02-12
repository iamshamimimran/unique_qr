import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Dashboard Gradients */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/5 blur-[120px] pointer-events-none rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] pointer-events-none rounded-full"></div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

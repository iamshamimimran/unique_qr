import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import QRGenerator from './components/QRGenerator';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import Overview from './components/Dashboard/Overview';
import QRHistory from './components/Dashboard/QRHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Toaster position="top-center" />
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route element={<><Navbar /><div className="flex-1"><Outlet /></div></>}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pricing" element={<Pricing />} />
            </Route>

            {/* DASHBOARD ROUTES */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="create" element={<QRGenerator />} />
                <Route path="history" element={<QRHistory />} />
                <Route path="settings" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Settings Coming Soon</h2></div>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

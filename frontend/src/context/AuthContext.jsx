import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Fetch profile error', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      await fetchProfile(response.data.token);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
      localStorage.setItem('token', response.data.token);
      await fetchProfile(response.data.token);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  const incrementQRCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      await axios.post(`${API_URL}/auth/increment-qr`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfile(token);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating usage');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, incrementQRCount, refreshUser: () => fetchProfile(localStorage.getItem('token')), API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

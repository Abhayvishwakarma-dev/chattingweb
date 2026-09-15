import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth';
import { initializeSocket, disconnectSocket } from '../services/socket';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
          initializeSocket(token);
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
        disconnectSocket();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const { accessToken, ...userData } = response.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(userData);
        setIsAuthenticated(true);
        initializeSocket(accessToken);
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        const { accessToken, ...userData } = response.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(userData);
        setIsAuthenticated(true);
        initializeSocket(accessToken);
        toast.success('Registration successful!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
      disconnectSocket();
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
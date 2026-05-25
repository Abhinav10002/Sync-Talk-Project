import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for an existing session token on app mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('synctalk_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error("Session restoration failed:", error);
        localStorage.removeItem('synctalk_token');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Registration handler
  const register = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
  };

  // Login handler (FastAPI expects x-www-form-urlencoded data for OAuth2)
  const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = response.data;
    localStorage.setItem('synctalk_token', access_token);

    const userProfile = await api.get('/users/me');
    setUser(userProfile.data);
    return userProfile.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('synctalk_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider framework.');
  }
  return context;
};
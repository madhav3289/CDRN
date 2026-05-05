import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

/**
 * Provides authentication state and helpers to the entire app.
 * Persists token and user info in localStorage so sessions survive refreshes.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('cdrn_token');
    const savedUser = localStorage.getItem('cdrn_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login: persist credentials and update state
  const login = useCallback((tokenValue, userValue) => {
    localStorage.setItem('cdrn_token', tokenValue);
    localStorage.setItem('cdrn_user', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  }, []);

  // Logout: clear everything
  const logout = useCallback(() => {
    localStorage.removeItem('cdrn_token');
    localStorage.removeItem('cdrn_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = { user, token, login, logout, isAuthenticated, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume auth context from any component.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;

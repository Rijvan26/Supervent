import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = 'autoparts-auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user) {
          setUser(parsed.user);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, remember = false) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      return { success: false, message: 'Please enter your email and password.' };
    }

    const demoUser = {
      id: 'admin-1',
      name: 'Admin User',
      email: normalizedEmail,
      role: 'Store Manager',
    };

    setUser(demoUser);
    const payload = { user: demoUser, remember };
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }

    return { success: true, user: demoUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/login');
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

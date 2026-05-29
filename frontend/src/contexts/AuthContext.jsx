import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      api.getProfile().then((profile) => {
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      }).catch(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      });
    }
    setLoading(false);
  }, []);

  function login(userData, token) {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  }

  function updateUser(data) {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  }

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

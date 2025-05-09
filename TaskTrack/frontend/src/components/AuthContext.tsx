import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import axios from 'axios';

// Kullanıcı tipi
interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

// Auth context tipi
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Context oluşturma
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Context provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Başlangıçta localStorage'dan kullanıcı kontrolü
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Hata temizleme
  const clearError = () => {
    setError(null);
  };

  // Kayıt işlemi
  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(username, email, password);
      setUser(response.user);
      return response;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          setError('Network error. Please check if the server is running.');
        } else if (err.response) {
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
        } else {
          setError('An error occurred during registration.');
        }
      } else if (err instanceof Error) {
        setError(err.message || 'An error occurred during registration.');
      } else {
        setError('An unknown error occurred.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Giriş işlemi
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          setError('Network error. Please check if the server is running.');
        } else if (err.response) {
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
        } else {
          setError('An error occurred during login.');
        }
      } else if (err instanceof Error) {
        setError(err.message || 'An error occurred during login.');
      } else {
        setError('An unknown error occurred.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => React.useContext(AuthContext); 
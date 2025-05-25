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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Başlangıçta localStorage'dan kullanıcı kontrolü ve token doğrulama
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentUser = authService.getCurrentUser();
        
        if (token && currentUser) {
          // Token'ı doğrulamak için basit bir API çağrısı yap
          try {
            const response = await axios.get('http://localhost:3001/api/users/profile', {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            // Token geçerliyse kullanıcıyı ayarla
            if (response.data.user) {
              setUser(response.data.user);
              // localStorage'daki kullanıcı bilgisini güncelle
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
                     } catch (tokenError) {
             // Token geçersizse temizle
             console.log('Token expired or invalid, clearing auth data', tokenError);
             authService.logout();
             setUser(null);
           }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
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
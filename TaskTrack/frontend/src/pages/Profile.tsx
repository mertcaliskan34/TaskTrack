import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { useAuth } from '../components/AuthContext';
import { authService } from '../services/api';

// Define proper error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  
  const [profileState, setProfileState] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileState(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordState(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    
    // Basit validasyon
    if (!profileState.username.trim() || !profileState.email.trim()) {
      setProfileError('Lütfen tüm alanları doldurun');
      return;
    }
    
    try {
      setProfileLoading(true);
      await authService.updateProfile({
        username: profileState.username,
        email: profileState.email
      });
      setProfileSuccess('Profil bilgileri başarıyla güncellendi');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setProfileError(apiError.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Şifre validasyonu
    if (!passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
      setPasswordError('Lütfen tüm alanları doldurun');
      return;
    }
    
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }
    
    if (passwordState.newPassword.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }
    
    try {
      setPasswordLoading(true);
      await authService.changePassword(
        passwordState.currentPassword,
        passwordState.newPassword
      );
      setPasswordSuccess('Şifre başarıyla değiştirildi');
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setPasswordError(apiError.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profil Ayarları
      </Typography>
      
      <Grid container spacing={4}>
        {/* Profil Bilgileri */}
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hesap Bilgileri
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {profileError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {profileError}
              </Alert>
            )}
            
            {profileSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {profileSuccess}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleProfileSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Kullanıcı Adı"
                name="username"
                value={profileState.username}
                onChange={handleProfileChange}
                disabled={profileLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Adresi"
                name="email"
                type="email"
                value={profileState.email}
                onChange={handleProfileChange}
                disabled={profileLoading}
              />
              
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={profileLoading}
              >
                {profileLoading ? <CircularProgress size={24} /> : 'Bilgileri Güncelle'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Şifre Değiştirme */}
        <Grid component="div" sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Şifre Değiştir
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordSuccess}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handlePasswordSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="currentPassword"
                label="Mevcut Şifre"
                name="currentPassword"
                type="password"
                value={passwordState.currentPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="Yeni Şifre"
                name="newPassword"
                type="password"
                value={passwordState.newPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Yeni Şifre Tekrar"
                name="confirmPassword"
                type="password"
                value={passwordState.confirmPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
              />
              
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={passwordLoading}
              >
                {passwordLoading ? <CircularProgress size={24} /> : 'Şifreyi Değiştir'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Edit as EditIcon
} from '@mui/icons-material';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      alignItems: 'center',
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 1, sm: 2, md: 3 },
      bgcolor: '#f5f5f5'
    }}>
      {/* Header Section */}
      <Box sx={{
        mb: { xs: 3, sm: 4 },
        textAlign: 'center',
        width: '100%',
        maxWidth: '600px'
      }}>
        <Avatar
          sx={{
            width: { xs: 80, sm: 90, md: 100 },
            height: { xs: 80, sm: 90, md: 100 },
            bgcolor: 'primary.main',
            fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
            fontWeight: 'bold',
            mx: 'auto',
            mb: 2
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary"
          fontWeight="bold"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          {user.username}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {user.email}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Üyelik Tarihi: {new Date(user.created_at).toLocaleDateString('tr-TR')}
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '85vw',
        height: '100%',
      }}>
        {/* Cards Container */}
        <Box sx={{
          display: 'flex',
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
          flexGrow: 1,
        }}>
          {/* Profil Bilgileri */}
          <Paper elevation={3} sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: "50%",
            height: '100%',
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 2, sm: 3 }
            }}>
              <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Hesap Bilgileri
              </Typography>
            </Box>
            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            {profileError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {profileError}
              </Alert>
            )}

            {profileSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
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
                variant="outlined"
                sx={{ mb: 2 }}
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
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={profileLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={profileLoading}
                fullWidth
                sx={{
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {profileLoading ? 'Güncelleniyor...' : 'Bilgileri Güncelle'}
              </Button>
            </Box>
          </Paper>

          {/* Şifre Değiştirme */}
          <Paper elevation={2} sx={{
            p: { xs: 2, sm: 3, md: 4 },
            height: '100%',
            width: "50%",
            textAlign: 'center'
          }}>
            <Box sx={{
              display: 'flex',
              mb: { xs: 2, sm: 3 }
            }}>
              <LockIcon sx={{ mr: 2, color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Güvenlik
              </Typography>
            </Box>
            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            {passwordError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {passwordError}
              </Alert>
            )}

            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {passwordSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}>
              <TextField
                margin="normal"
                required
                id="currentPassword"
                label="Mevcut Şifre"
                name="currentPassword"
                type="password"
                value={passwordState.currentPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
                variant="outlined"
                fullWidth
              />

              <TextField
                margin="normal"
                required
                id="newPassword"
                label="Yeni Şifre"
                name="newPassword"
                type="password"
                value={passwordState.newPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
                variant="outlined"
                fullWidth
              />

              <TextField
                margin="normal"
                required
                id="confirmPassword"
                label="Yeni Şifre Tekrar"
                name="confirmPassword"
                type="password"
                value={passwordState.confirmPassword}
                onChange={handlePasswordChange}
                disabled={passwordLoading}
                variant="outlined"
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={passwordLoading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
                disabled={passwordLoading}
                sx={{
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  mt: 2 
                }}
              >
                {passwordLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

    </Box>
  );
};

export default Profile;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert, 
  CircularProgress,
  Paper
} from '@mui/material';
import { useAuth } from '../components/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    // Basit validasyon
    if (!username || !email || !password || !confirmPassword) {
      setFormError('Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setFormError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setFormError(`Registration failed: ${err.message}`);
      } else {
        setFormError('Network error occurred. Please check your connection and try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          width: '100%',
          maxWidth: '400px',
          padding: 4, 
          borderRadius: 2,
          m: 0
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          TaskTrack'e Kayıt Ol
        </Typography>
        
        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError || error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Kullanıcı Adı"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresi"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Şifreyi Tekrarla"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'KAYIT OL'}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register; 
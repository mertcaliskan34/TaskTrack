const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// JWT token oluşturma fonksiyonu
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.user_id, 
      username: user.username,
      email: user.email
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Kullanıcı kaydı
const register = async (req, res) => {
  try {
    console.log('Register attempt:', req.body);
    const { username, email, password } = req.body;

    // Gerekli alanları kontrol et
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
    }

    // JWT_SECRET kontrolü
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET is missing' });
    }

    // Email ve kullanıcı adı kontrolü
    console.log('Checking for existing email...');
    try {
      const existingEmail = await User.findByEmail(email);
      console.log('Existing email check result:', existingEmail);
      if (existingEmail) {
        console.log('Email already in use:', email);
        return res.status(400).json({ message: 'Bu email zaten kullanımda' });
      }
    } catch (emailErr) {
      console.error('Error checking existing email:', emailErr);
      return res.status(500).json({ message: 'Email kontrol edilirken hata oluştu', error: emailErr.message });
    }

    console.log('Checking for existing username...');
    try {
      const existingUsername = await User.findByUsername(username);
      console.log('Existing username check result:', existingUsername);
      if (existingUsername) {
        console.log('Username already in use:', username);
        return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanımda' });
      }
    } catch (usernameErr) {
      console.error('Error checking existing username:', usernameErr);
      return res.status(500).json({ message: 'Kullanıcı adı kontrol edilirken hata oluştu', error: usernameErr.message });
    }

    // Şifreyi hashle
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    console.log('Creating user...');
    let userId;
    try {
      userId = await User.create(username, email, hashedPassword);
      console.log('User created with ID:', userId);
    } catch (createErr) {
      console.error('Error creating user:', createErr);
      return res.status(500).json({ message: 'Kullanıcı oluşturulurken hata oluştu', error: createErr.message });
    }
    
    // Kullanıcı bilgilerini getir
    console.log('Retrieving user data...');
    let user;
    try {
      user = await User.findById(userId);
      if (!user) {
        console.error('User not found after creation');
        return res.status(500).json({ message: 'Kullanıcı oluşturuldu ancak bilgileri alınamadı' });
      }
    } catch (findErr) {
      console.error('Error retrieving user data:', findErr);
      return res.status(500).json({ message: 'Kullanıcı bilgileri alınamadı', error: findErr.message });
    }
    
    // Token oluştur
    console.log('Generating token...');
    const token = generateToken(user);

    console.log('Registration successful for user:', username);
    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Registration error details:', error);
    
    // Check for specific error types
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('Duplicate entry error:', error.sqlMessage);
      return res.status(400).json({ message: 'Bu kullanıcı adı veya email zaten kullanımda' });
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ message: 'Database access denied. Check your database credentials.' });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ message: 'Unable to connect to database. Check if database server is running.' });
    }
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('Table does not exist:', error.sqlMessage);
      return res.status(500).json({ message: 'Database table does not exist. Make sure the database is properly set up.' });
    }
    
    res.status(500).json({ message: 'Kayıt işlemi başarısız', error: error.message });
  }
};

// Kullanıcı girişi
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Gerekli alanları kontrol et
    if (!email || !password) {
      return res.status(400).json({ message: 'Lütfen email ve şifre girin' });
    }

    // Kullanıcıyı email ile bul
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Şifreyi kontrol et
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Token oluştur
    const token = generateToken(user);

    res.status(200).json({
      message: 'Giriş başarılı',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Giriş başarısız', error: error.message });
  }
};

// Kullanıcı bilgilerini getirme
const getUserProfile = async (req, res) => {
  try {
    // Kullanıcı ID'sini auth middleware'den al
    const userId = req.user.id;
    
    // Kullanıcı bilgilerini getir
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Kullanıcı profili hatası:', error);
    res.status(500).json({ message: 'Kullanıcı profili getirilemedi', error: error.message });
  }
};

// Kullanıcı bilgilerini güncelleme
const updateUserProfile = async (req, res) => {
  try {
    // Kullanıcı ID'sini auth middleware'den al
    const userId = req.user.id;
    const { username, email } = req.body;

    // Kullanıcıyı kontrol et
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Kullanıcı adı ve email'i güncelle
    const updated = await User.update(userId, { username, email });
    if (!updated) {
      return res.status(400).json({ message: 'Güncelleme başarısız' });
    }

    // Güncellenmiş kullanıcı bilgilerini getir
    const updatedUser = await User.findById(userId);

    res.status(200).json({
      message: 'Kullanıcı bilgileri güncellendi',
      user: {
        id: updatedUser.user_id,
        username: updatedUser.username,
        email: updatedUser.email,
        created_at: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    res.status(500).json({ message: 'Güncelleme başarısız', error: error.message });
  }
};

// Şifre değiştirme
const changePassword = async (req, res) => {
  try {
    // Kullanıcı ID'sini auth middleware'den al
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Gerekli alanları kontrol et
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Lütfen mevcut ve yeni şifreyi girin' });
    }

    // Kullanıcıyı getir (şifre dahil)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Mevcut şifreyi kontrol et
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Mevcut şifre yanlış' });
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    const updated = await User.updatePassword(userId, hashedPassword);
    if (!updated) {
      return res.status(400).json({ message: 'Şifre güncelleme başarısız' });
    }

    res.status(200).json({ message: 'Şifre başarıyla güncellendi' });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({ message: 'Şifre değiştirme başarısız', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  changePassword
}; 
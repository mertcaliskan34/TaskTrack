const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Token'ı header'dan alma
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Yetkilendirme başarısız: Token bulunamadı' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Token'ı doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcı bilgisini request'e ekleme
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Yetkilendirme başarısız: Geçersiz token',
      error: error.message 
    });
  }
};

module.exports = authMiddleware; 
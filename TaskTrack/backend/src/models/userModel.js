const { pool } = require('../config/db');

const User = {
  // Kullanıcı oluşturma
  async create(username, email, password) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Email ile kullanıcı bulma
  async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı adı ile kullanıcı bulma
  async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // ID ile kullanıcı bulma
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT user_id, username, email, created_at FROM users WHERE user_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Tüm kullanıcıları getirme
  async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT user_id, username, email, created_at FROM users'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı güncelleme
  async update(id, userData) {
    try {
      const { username, email } = userData;
      const [result] = await pool.execute(
        'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
        [username, email, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Şifre güncelleme
  async updatePassword(id, password) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET password = ? WHERE user_id = ?',
        [password, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı silme
  async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM users WHERE user_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User; 
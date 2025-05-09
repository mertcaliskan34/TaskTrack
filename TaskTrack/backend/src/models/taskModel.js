const { pool } = require('../config/db');

const Task = {
  // Görev oluşturma
  async create(taskData) {
    try {
      const { user_id, title, description, due_date, task_type, status } = taskData;
      const [result] = await pool.execute(
        'INSERT INTO tasks (user_id, title, description, due_date, task_type, status) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, description, due_date, task_type, status || 'pending']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // ID ile görev bulma
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE task_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcıya ait tüm görevleri getirme
  async findByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Duruma göre görevleri getirme
  async findByStatus(userId, status) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE user_id = ? AND status = ? ORDER BY due_date ASC',
        [userId, status]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Tarih aralığına göre görevleri getirme
  async findByDateRange(userId, startDate, endDate) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE user_id = ? AND due_date BETWEEN ? AND ? ORDER BY due_date ASC',
        [userId, startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Görev türüne göre görevleri getirme
  async findByType(userId, taskType) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE user_id = ? AND task_type = ? ORDER BY due_date ASC',
        [userId, taskType]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Görev güncelleme
  async update(id, taskData) {
    try {
      const { title, description, due_date, task_type, status } = taskData;
      const [result] = await pool.execute(
        'UPDATE tasks SET title = ?, description = ?, due_date = ?, task_type = ?, status = ? WHERE task_id = ?',
        [title, description, due_date, task_type, status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Görev durumu güncelleme
  async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE tasks SET status = ? WHERE task_id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Görev silme
  async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM tasks WHERE task_id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Task; 
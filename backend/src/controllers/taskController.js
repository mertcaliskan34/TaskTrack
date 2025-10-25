const Task = require('../models/taskModel');

// Görev oluşturma
const createTask = async (req, res) => {
  try {
    // Kullanıcı ID'sini auth middleware'den al
    const user_id = req.user.id;
    
    // Request body'den görev bilgilerini al
    const { title, description, due_date, task_type, status } = req.body;

    // Gerekli alanları kontrol et
    if (!title || !task_type) {
      return res.status(400).json({ message: 'Başlık ve görev türü gereklidir' });
    }

    // Görev oluştur
    const taskData = {
      user_id,
      title,
      description,
      due_date,
      task_type,
      status: status || 'pending'
    };

    const taskId = await Task.create(taskData);
    
    // Oluşturulan görevi getir
    const task = await Task.findById(taskId);

    res.status(201).json({
      message: 'Görev başarıyla oluşturuldu',
      task
    });
  } catch (error) {
    console.error('Görev oluşturma hatası:', error);
    res.status(500).json({ message: 'Görev oluşturma başarısız', error: error.message });
  }
};

// Kullanıcının tüm görevlerini getirme
const getUserTasks = async (req, res) => {
  try {
    // Kullanıcı ID'sini auth middleware'den al
    const userId = req.user.id;
    
    // Filtre parametreleri
    const { status, task_type, start_date, end_date } = req.query;

    let tasks;

    // Filtrelere göre görevleri getir
    if (status) {
      tasks = await Task.findByStatus(userId, status);
    } else if (task_type) {
      tasks = await Task.findByType(userId, task_type);
    } else if (start_date && end_date) {
      tasks = await Task.findByDateRange(userId, start_date, end_date);
    } else {
      // Tüm görevleri getir
      tasks = await Task.findByUserId(userId);
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Görevleri getirme hatası:', error);
    res.status(500).json({ message: 'Görevler getirilemedi', error: error.message });
  }
};

// Belirli kullanıcının görevlerini getirme (ID ile)
const getUserTasksById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requestingUserId = req.user.id;
    
    // Kullanıcı sadece kendi görevlerini görebilir
    if (userId !== requestingUserId.toString()) {
      return res.status(403).json({ message: 'Bu kullanıcının görevlerine erişim yetkiniz yok' });
    }
    
    // Tüm görevleri getir
    const tasks = await Task.findByUserId(userId);

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Görevleri getirme hatası:', error);
    res.status(500).json({ message: 'Görevler getirilemedi', error: error.message });
  }
};

// Belirli bir görevi getirme
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Görevi getir
    const task = await Task.findById(taskId);

    // Görev var mı kontrol et
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı' });
    }

    // Görevin kullanıcıya ait olduğunu kontrol et
    if (task.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bu göreve erişim yetkiniz yok' });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error('Görev getirme hatası:', error);
    res.status(500).json({ message: 'Görev getirilemedi', error: error.message });
  }
};

// Görev güncelleme
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, due_date, task_type, status } = req.body;

    // Görevi getir
    const task = await Task.findById(taskId);

    // Görev var mı kontrol et
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı' });
    }

    // Görevin kullanıcıya ait olduğunu kontrol et
    if (task.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bu görevi güncelleme yetkiniz yok' });
    }

    // Görev verilerini güncelle
    const taskData = {
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      due_date: due_date || task.due_date,
      task_type: task_type || task.task_type,
      status: status || task.status
    };

    // Görevi güncelle
    const updated = await Task.update(taskId, taskData);
    if (!updated) {
      return res.status(400).json({ message: 'Görev güncellenemedi' });
    }

    // Güncellenmiş görevi getir
    const updatedTask = await Task.findById(taskId);

    res.status(200).json({
      message: 'Görev başarıyla güncellendi',
      task: updatedTask
    });
  } catch (error) {
    console.error('Görev güncelleme hatası:', error);
    res.status(500).json({ message: 'Görev güncelleme başarısız', error: error.message });
  }
};

// Görev durumu güncelleme
const updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { status } = req.body;

    // Status kontrolü
    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Geçerli bir durum belirtmelisiniz (pending, in_progress, completed)' });
    }

    // Görevi getir
    const task = await Task.findById(taskId);

    // Görev var mı kontrol et
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı' });
    }

    // Görevin kullanıcıya ait olduğunu kontrol et
    if (task.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bu görevi güncelleme yetkiniz yok' });
    }

    // Görev durumunu güncelle
    const updated = await Task.updateStatus(taskId, status);
    if (!updated) {
      return res.status(400).json({ message: 'Görev durumu güncellenemedi' });
    }

    // Güncellenmiş görevi getir
    const updatedTask = await Task.findById(taskId);

    res.status(200).json({
      message: 'Görev durumu başarıyla güncellendi',
      task: updatedTask
    });
  } catch (error) {
    console.error('Görev durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Görev durumu güncelleme başarısız', error: error.message });
  }
};

// Görev silme
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Görevi getir
    const task = await Task.findById(taskId);

    // Görev var mı kontrol et
    if (!task) {
      return res.status(404).json({ message: 'Görev bulunamadı' });
    }

    // Görevin kullanıcıya ait olduğunu kontrol et
    if (task.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bu görevi silme yetkiniz yok' });
    }

    // Görevi sil
    const deleted = await Task.delete(taskId);
    if (!deleted) {
      return res.status(400).json({ message: 'Görev silinemedi' });
    }

    res.status(200).json({ message: 'Görev başarıyla silindi' });
  } catch (error) {
    console.error('Görev silme hatası:', error);
    res.status(500).json({ message: 'Görev silme başarısız', error: error.message });
  }
};

module.exports = {
  createTask,
  getUserTasks,
  getUserTasksById,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
}; 
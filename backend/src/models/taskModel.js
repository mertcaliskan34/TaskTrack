const Task = require('./taskSchema');

const TaskModel = {
  // Görev oluşturma
  async create(taskData) {
    try {
      const newTask = new Task(taskData);
      const savedTask = await newTask.save();
      return savedTask._id;
    } catch (error) {
      throw error;
    }
  },

  // ID ile görev bulma
  async findById(id) {
    try {
      return await Task.findById(id);
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcıya ait tüm görevleri getirme
  async findByUserId(userId) {
    try {
      return await Task.find({ user_id: userId }).sort({ due_date: 1 });
    } catch (error) {
      throw error;
    }
  },

  // Duruma göre görevleri getirme
  async findByStatus(userId, status) {
    try {
      return await Task.find({ user_id: userId, status }).sort({ due_date: 1 });
    } catch (error) {
      throw error;
    }
  },

  // Tarih aralığına göre görevleri getirme
  async findByDateRange(userId, startDate, endDate) {
    try {
      return await Task.find({
        user_id: userId,
        due_date: { $gte: startDate, $lte: endDate }
      }).sort({ due_date: 1 });
    } catch (error) {
      throw error;
    }
  },

  // Görev türüne göre görevleri getirme
  async findByType(userId, taskType) {
    try {
      return await Task.find({ user_id: userId, task_type: taskType }).sort({ due_date: 1 });
    } catch (error) {
      throw error;
    }
  },

  // Görev güncelleme
  async update(id, taskData) {
    try {
      const result = await Task.findByIdAndUpdate(id, taskData, { new: true });
      return !!result;
    } catch (error) {
      throw error;
    }
  },

  // Görev durumu güncelleme
  async updateStatus(id, status) {
    try {
      const result = await Task.findByIdAndUpdate(id, { status }, { new: true });
      return !!result;
    } catch (error) {
      throw error;
    }
  },

  // Görev silme
  async delete(id) {
    try {
      const result = await Task.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = TaskModel; 
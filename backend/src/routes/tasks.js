const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Görev API çalışıyor' });
});

// Tüm görev rotaları korumalıdır
router.use(authMiddleware);

// Görev rotaları
router.post('/', taskController.createTask);
router.get('/', taskController.getUserTasks);
router.get('/user/:userId', taskController.getUserTasksById);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router; 
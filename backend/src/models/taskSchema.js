const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Task Schema
const TaskSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  due_date: {
    type: Date,
    default: null
  },
  task_type: {
    type: String,
    enum: ['assignment', 'exam', 'daily'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // Use created_at and updated_at fields instead
});

// Update the updated_at field before saving
TaskSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Update the updated_at field before updating
TaskSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

module.exports = mongoose.model('Task', TaskSchema); 
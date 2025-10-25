const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Use the MongoDB connection string from environment or the provided one
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

module.exports = {
  connectDB
}; 
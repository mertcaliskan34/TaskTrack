const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/mongodb');

// Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('ERROR: Missing required environment variables:');
  missingEnvVars.forEach(envVar => console.error(`- ${envVar}`));
  console.error('Please check your .env file');
  
  // Set default JWT_SECRET if missing
  if (!process.env.JWT_SECRET) {
    console.log('Setting default JWT_SECRET for development');
    process.env.JWT_SECRET = 'tasktrack_default_dev_secret_key';
  }
}

// Always ensure JWT_EXPIRES_IN is set
if (!process.env.JWT_EXPIRES_IN) {
  console.log('Setting default JWT_EXPIRES_IN for development');
  process.env.JWT_EXPIRES_IN = '7d';
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup and server start
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
      console.error('Failed to connect to MongoDB. Server will start but may not function correctly.');
    }
    
    // Start server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API endpoints: http://localhost:${PORT}/api/users, http://localhost:${PORT}/api/tasks`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('TaskTrack API is running with MongoDB!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Bir şeyler yanlış gitti!', error: err.message });
});

// Start the server
startServer();

module.exports = app;

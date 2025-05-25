const mongoose = require('mongoose');
const { connectDB } = require('../config/mongodb');

// Setup MongoDB collections with proper schemas
const setupMongoDB = async () => {
  try {
    console.log('Setting up MongoDB collections...');
    
    // Connect to MongoDB
    await connectDB();
    
    const db = mongoose.connection.db;
    
    // Drop existing collections if they exist (for clean setup)
    try {
      await db.collection('users').drop();
      console.log('Dropped existing users collection');
    } catch (error) {
      console.log('Users collection does not exist, creating new one');
    }
    
    try {
      await db.collection('tasks').drop();
      console.log('Dropped existing tasks collection');
    } catch (error) {
      console.log('Tasks collection does not exist, creating new one');
    }
    
    // Create users collection with schema validation
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'email', 'password', 'created_at'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            username: {
              bsonType: 'string',
              description: 'Username must be a string and is required'
            },
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'Email must be a valid email address and is required'
            },
            password: {
              bsonType: 'string',
              minLength: 6,
              description: 'Password must be a string with minimum 6 characters and is required'
            },
            created_at: {
              bsonType: 'date',
              description: 'Created at must be a date and is required'
            }
          }
        }
      }
    });
    
    // Create unique indexes for users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    
    console.log('Users collection created with schema validation');
    
    // Create tasks collection with schema validation
    await db.createCollection('tasks', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'title', 'task_type', 'status', 'created_at', 'updated_at'],
          properties: {
            _id: {
              bsonType: 'objectId'
            },
            user_id: {
              bsonType: 'objectId',
              description: 'User ID must be an ObjectId and is required'
            },
            title: {
              bsonType: 'string',
              maxLength: 100,
              description: 'Title must be a string with maximum 100 characters and is required'
            },
            description: {
              bsonType: ['string', 'null'],
              description: 'Description must be a string or null'
            },
            due_date: {
              bsonType: ['date', 'null'],
              description: 'Due date must be a date or null'
            },
            task_type: {
              bsonType: 'string',
              enum: ['assignment', 'exam', 'daily'],
              description: 'Task type must be one of: assignment, exam, daily'
            },
            status: {
              bsonType: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              description: 'Status must be one of: pending, in_progress, completed'
            },
            created_at: {
              bsonType: 'date',
              description: 'Created at must be a date and is required'
            },
            updated_at: {
              bsonType: 'date',
              description: 'Updated at must be a date and is required'
            }
          }
        }
      }
    });
    
    // Create indexes for tasks
    await db.collection('tasks').createIndex({ user_id: 1 });
    await db.collection('tasks').createIndex({ due_date: 1 });
    await db.collection('tasks').createIndex({ task_type: 1 });
    await db.collection('tasks').createIndex({ status: 1 });
    
    console.log('Tasks collection created with schema validation');
    
    console.log('MongoDB setup completed successfully!');
    console.log('Collections created:');
    console.log('- users (with unique indexes on email and username)');
    console.log('- tasks (with indexes on user_id, due_date, task_type, status)');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
    process.exit(1);
  }
};

// Run the setup
setupMongoDB(); 
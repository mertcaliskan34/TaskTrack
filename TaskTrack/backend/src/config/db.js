const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Log database configuration (without sensitive info)
console.log('Database Connection Config:');
console.log('- Host:', process.env.DB_HOST || 'localhost');
console.log('- Port:', process.env.DB_PORT || 3306);
console.log('- User:', process.env.DB_USER || 'root');
console.log('- Database:', process.env.DB_NAME || 'tasktrack');

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tasktrack',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,  // Connection timeout in milliseconds
    acquireTimeout: 10000   // Acquire timeout in milliseconds
});

// Initialize database and tables
const initializeDatabase = async () => {
    const dbName = process.env.DB_NAME || 'tasktrack';
    
    try {
        // Create connection without database selection
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });
        
        // Check if database exists, create if not
        console.log(`Checking if database '${dbName}' exists...`);
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`Database '${dbName}' is ready.`);
        
        // Switch to the database
        await tempConnection.query(`USE ${dbName}`);
        
        // Check if users table exists
        const [tables] = await tempConnection.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
        `, [dbName]);
        
        if (tables.length === 0) {
            console.log('Creating users table...');
            await tempConnection.query(`
                CREATE TABLE users (
                    user_id INT NOT NULL AUTO_INCREMENT,
                    username VARCHAR(50) NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id),
                    UNIQUE KEY username (username),
                    UNIQUE KEY email (email)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
            `);
            console.log('Users table created successfully.');
        } else {
            console.log('Users table already exists.');
        }
        
        // Check if tasks table exists
        const [taskTables] = await tempConnection.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tasks'
        `, [dbName]);
        
        if (taskTables.length === 0) {
            console.log('Creating tasks table...');
            await tempConnection.query(`
                CREATE TABLE tasks (
                    task_id INT NOT NULL AUTO_INCREMENT,
                    user_id INT NOT NULL,
                    title VARCHAR(100) NOT NULL,
                    description TEXT,
                    due_date DATE DEFAULT NULL,
                    task_type ENUM('assignment','exam','daily') NOT NULL,
                    status ENUM('pending','in_progress','completed') DEFAULT 'pending',
                    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    PRIMARY KEY (task_id),
                    KEY user_id (user_id),
                    CONSTRAINT tasks_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
            `);
            console.log('Tasks table created successfully.');
        } else {
            console.log('Tasks table already exists.');
        }
        
        // Close the temporary connection
        await tempConnection.end();
        
        return true;
    } catch (error) {
        console.error('Database initialization error:', error);
        return false;
    }
};

// Test the connection
const testConnection = async () => {
    try {
        // Initialize database and tables first
        await initializeDatabase();
        
        const connection = await pool.getConnection();
        console.log('MySQL database connection successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        if (error.code === 'ETIMEDOUT') {
            console.error('Connection timed out. Make sure the database server is running and accessible.');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Make sure MySQL server is running and using the correct port.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied. Check your username and password.');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('Database not found. Make sure the database has been created.');
            console.error('You may need to create the database manually with: CREATE DATABASE tasktrack;');
        } else if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        return false;
    }
};

module.exports = {
    pool,
    testConnection,
    initializeDatabase
};
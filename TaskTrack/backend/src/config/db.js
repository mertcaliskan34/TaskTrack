const mysql = require('mysql2/promise'); // Use the promise-based interface of mysql2
require('dotenv').config(); // Load environment variables from .env file

// Create the connection pool. Pooling is better than individual connections for web apps.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Default to 'localhost' if not specified
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Make sure DB_NAME matches your .env file key
    port: process.env.DB_PORT || 3306, // Default MySQL port
    waitForConnections: true, // Wait for a connection if pool is full
    connectionLimit: 10,      // Max number of connections in pool
    queueLimit: 0             // Unlimited queueing requests when pool is full
});

// Optional: Test the connection immediately (useful for debugging setup)
// You might want to remove or comment this out in production
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the database.');
        connection.release(); // Release the connection back to the pool
    })
    .catch(error => {
        console.error('Error connecting to the database:', error.message);
        // Exit the process if the database connection fails on startup
        // You might adjust this behavior based on your app's needs
        process.exit(1);
    });

// Export the pool to be used in other parts of the application (models, controllers)
module.exports = pool;
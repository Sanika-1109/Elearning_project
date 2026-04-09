require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2');

// Standardized database connection setup supporting fallback for local dev
// It will utilize Railway's environment variables (MYSQLHOST, MYSQLUSER, etc.) in production.
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'elearning',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

async function getPool() {
    return promisePool;
}

module.exports = { getPool };


// backend/db.js
const { Pool } = require('pg');

let pool = null;

async function getPool() {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false }   // required for Supabase
        });
    }
    return pool;
}

module.exports = { getPool };
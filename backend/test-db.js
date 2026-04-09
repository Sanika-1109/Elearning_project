// test-db.js
require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
    // Use individual environment variables (no URL parsing)
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,   // raw password, @ symbol is fine here
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }   // required for Supabase
    });

    try {
        const { rows } = await pool.query('SELECT 1 + 1 AS solution');
        console.log('✅ Supabase connected perfectly! Result:', rows[0].solution);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

testConnection();
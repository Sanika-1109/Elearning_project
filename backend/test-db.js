const pool = require('./db');

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('Database connected perfectly:', rows[0].solution);
    } catch (err) {
        console.error('Database connection failed:', err.message);
        console.error('Code:', err.code);
        console.error('Errno:', err.errno);
    } finally {
        process.exit();
    }
}

testConnection();

const sql = require('mssql');

const config = {
  server: '127.0.0.1',
  port: 1433,
  database: process.env.DB_NAME,
  user: 'elearning_user',
  password: 'Testing1234',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: false,
  }
};

let pool;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('Connected to SQL Server!');
    } catch (err) {
      console.error('Database connection failed:', err.message);
      throw err;
    }
  }
  return pool;
}

module.exports = { getPool, sql };
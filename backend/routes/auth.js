const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// POST /api/auth/login/:role
router.post('/login/:role', async (req, res) => {
  try {
    const { email, password } = req.body;
    const role = req.params.role;
    const pool = await getPool();

    let table = role === 'instructor' ? 'instructor' : 'student';
    // Using password_hash as per university schema
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE email = $1 AND password_hash = $2`, [email, password]);

    if (rows.length > 0) {
      const user = rows[0];
      res.json({ success: true, role, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/register/student
router.post('/register/student', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const pool = await getPool();

    const { rows: existing } = await pool.query('SELECT * FROM student WHERE email = $1', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    await pool.query(
      'INSERT INTO student (name, email, password_hash, registered_date) VALUES ($1, $2, $3, NOW())',
      [name, email, password]
    );

    res.json({ success: true, message: 'Registration successful! Please login.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/students - List all students with enrollment count
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(`
      SELECT s.*, COUNT(e.enrollment_id) as enrollment_count
      FROM student s
      LEFT JOIN enrollment e ON s.student_id = e.student_id
      GROUP BY s.student_id
    `);
    res.json({ success: true, students: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/enrollments/:student_id
router.get('/:student_id', async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(`
      SELECT e.*, c.title as course_title, cat.name as category_name, i.name as instructor_name
      FROM enrollment e
      JOIN course c ON e.course_id = c.course_id
      JOIN category cat ON c.category_id = cat.category_id
      JOIN instructor i ON c.instructor_id = i.instructor_id
      WHERE e.student_id = $1
    `, [req.params.student_id]);
    res.json({ success: true, enrollments: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/enrollments
router.post('/', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    const pool = await getPool();

    const { rows: existing } = await pool.query('SELECT * FROM enrollment WHERE student_id = $1 AND course_id = $2', [student_id, course_id]);
    if (existing.length > 0) {
      return res.json({ success: false, message: 'Already enrolled' });
    }

    await pool.query(
      'INSERT INTO enrollment (student_id, course_id, enrollment_date) VALUES ($1, $2, NOW())',
      [student_id, course_id]
    );

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
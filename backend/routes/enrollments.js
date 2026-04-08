const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/enrollments/:student_id
router.get('/:student_id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT e.*, c.title as course_title, cat.category_name, i.name as instructor_name
      FROM Enrollment e
      JOIN Course c ON e.course_id = c.course_id
      JOIN Category cat ON c.category_id = cat.category_id
      JOIN Instructor i ON c.instructor_id = i.instructor_id
      WHERE e.student_id = ?
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

    const [existing] = await pool.query('SELECT * FROM Enrollment WHERE student_id = ? AND course_id = ?', [student_id, course_id]);
    if (existing.length > 0) {
      return res.json({ success: false, message: 'Already enrolled' });
    }

    await pool.query(
      'INSERT INTO Enrollment (student_id, course_id, enrollment_date, status) VALUES (?, ?, NOW(), "Active")',
      [student_id, course_id]
    );

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
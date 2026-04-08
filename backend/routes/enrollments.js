const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

// GET /api/enrollments/:studentId — all courses a student is enrolled in
router.get('/:studentId', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('student_id', sql.Int, req.params.studentId)
      .query(`
        SELECT e.enrollment_id, e.enrollment_date,
               c.course_id, c.title AS course_title,
               CAST(c.description AS VARCHAR(MAX)) AS description,
               i.name AS instructor_name,
               cat.name AS category_name
        FROM Enrollment e
        JOIN Course c     ON e.course_id     = c.course_id
        JOIN Instructor i ON c.instructor_id  = i.instructor_id
        JOIN Category cat ON c.category_id    = cat.category_id
        WHERE e.student_id = @student_id
        ORDER BY e.enrollment_date DESC
      `);
    res.json({ success: true, enrollments: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/enrollments — enroll a student in a course
// Body: { student_id, course_id }
router.post('/', async (req, res) => {
  try {
    const pool = await getPool();
    const { student_id, course_id } = req.body;

    // Check if already enrolled
    const existing = await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('course_id', sql.Int, course_id)
      .query(`
        SELECT enrollment_id FROM Enrollment
        WHERE student_id = @student_id AND course_id = @course_id
      `);

    if (existing.recordset.length > 0) {
      return res.json({ success: false, message: 'Already enrolled in this course' });
    }

    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('course_id', sql.Int, course_id)
      .query(`
        INSERT INTO Enrollment (student_id, course_id, enrollment_date)
        VALUES (@student_id, @course_id, GETDATE())
      `);

    res.json({ success: true, message: 'Enrolled successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
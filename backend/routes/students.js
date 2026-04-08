const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

// GET /api/students — list all students with enrollment counts
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT s.student_id, s.name, s.email, s.registered_date,
             (SELECT COUNT(*) FROM Enrollment e WHERE e.student_id = s.student_id) AS course_count
      FROM Student s
      ORDER BY s.registered_date DESC
    `);
    res.json({ success: true, students: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/students/:id — get a single student's performance detailed stats
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT s.student_id, s.name, s.email, s.registered_date,
               (SELECT COUNT(*) FROM Enrollment e WHERE e.student_id = s.student_id) AS total_enrolled,
               (SELECT COUNT(*) FROM Quiz_Attempt qa WHERE qa.student_id = s.student_id) AS total_quizzes,
               (SELECT AVG(CAST(score AS FLOAT)) FROM Quiz_Attempt qa WHERE qa.student_id = s.student_id) AS avg_score
        FROM Student s
        WHERE s.student_id = @id
      `);
    res.json({ success: true, student: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

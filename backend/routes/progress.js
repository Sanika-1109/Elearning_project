const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

// GET /api/progress/:studentId — all progress for a student
router.get('/:studentId', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('student_id', sql.Int, req.params.studentId)
      .query(`
        SELECT p.progress_id, p.completed, p.completed_date,
               l.lesson_id, l.title AS lesson_title,
               c.course_id, c.title AS course_title
        FROM Progress p
        JOIN Lesson l  ON p.lesson_id  = l.lesson_id
        JOIN Course c  ON l.course_id  = c.course_id
        WHERE p.student_id = @student_id
        ORDER BY c.course_id, l.order_index
      `);
    res.json({ success: true, progress: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/progress/:studentId/:courseId — progress for a specific course
router.get('/:studentId/:courseId', async (req, res) => {
  try {
    const pool = await getPool();

    const totalResult = await pool.request()
      .input('course_id', sql.Int, req.params.courseId)
      .query(`SELECT COUNT(*) AS total FROM Lesson WHERE course_id = @course_id`);

    const completedResult = await pool.request()
      .input('student_id', sql.Int, req.params.studentId)
      .input('course_id', sql.Int, req.params.courseId)
      .query(`
        SELECT COUNT(*) AS completed
        FROM Progress p
        JOIN Lesson l ON p.lesson_id = l.lesson_id
        WHERE p.student_id = @student_id
          AND l.course_id  = @course_id
          AND p.completed  = 1
      `);

    const total = totalResult.recordset[0].total;
    const completed = completedResult.recordset[0].completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ success: true, total, completed, percentage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/complete — mark a lesson as completed
// Body: { student_id, lesson_id }
router.post('/complete', async (req, res) => {
  try {
    const pool = await getPool();
    const { student_id, lesson_id } = req.body;

    // Check if progress record already exists
    const existing = await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('lesson_id', sql.Int, lesson_id)
      .query(`
        SELECT progress_id FROM Progress
        WHERE student_id = @student_id AND lesson_id = @lesson_id
      `);

    if (existing.recordset.length > 0) {
      // Update existing record
      await pool.request()
        .input('student_id', sql.Int, student_id)
        .input('lesson_id', sql.Int, lesson_id)
        .query(`
          UPDATE Progress
          SET completed = 1, completed_date = GETDATE()
          WHERE student_id = @student_id AND lesson_id = @lesson_id
        `);
    } else {
      // Insert new record
      await pool.request()
        .input('student_id', sql.Int, student_id)
        .input('lesson_id', sql.Int, lesson_id)
        .query(`
          INSERT INTO Progress (student_id, lesson_id, completed, completed_date)
          VALUES (@student_id, @lesson_id, 1, GETDATE())
        `);
    }

    res.json({ success: true, message: 'Lesson marked as completed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

// GET /api/reviews/:courseId — all reviews for a course
router.get('/:courseId', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('course_id', sql.Int, req.params.courseId)
      .query(`
        SELECT r.review_id, r.rating,
               CAST(r.comment AS VARCHAR(MAX)) AS comment,
               r.review_date, s.name AS student_name
        FROM Review r
        JOIN Student s ON r.student_id = s.student_id
        WHERE r.course_id = @course_id
        ORDER BY r.review_date DESC
      `);
    res.json({ success: true, reviews: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reviews — submit a review
// Body: { student_id, course_id, rating, comment }
router.post('/', async (req, res) => {
  try {
    const pool = await getPool();
    const { student_id, course_id, rating, comment } = req.body;

    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('course_id', sql.Int, course_id)
      .input('rating', sql.Int, rating)
      .input('comment', sql.VarChar, comment)
      .query(`
        INSERT INTO Review (student_id, course_id, rating, comment, review_date)
        VALUES (@student_id, @course_id, @rating, @comment, GETDATE())
      `);

    res.json({ success: true, message: 'Review submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
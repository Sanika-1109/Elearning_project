const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

// GET /api/announcements/:courseId — all announcements for a course
router.get('/:courseId', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('course_id', sql.Int, req.params.courseId)
      .query(`
        SELECT a.announcement_id, a.title,
               CAST(a.content AS VARCHAR(MAX)) AS content,
               a.posted_date, i.name AS instructor_name
        FROM Announcement a
        JOIN Instructor i ON a.instructor_id = i.instructor_id
        WHERE a.course_id = @course_id
        ORDER BY a.posted_date DESC
      `);
    res.json({ success: true, announcements: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/announcements — post a new announcement
// Body: { course_id, instructor_id, title, content }
router.post('/', async (req, res) => {
  try {
    const pool = await getPool();
    const { course_id, instructor_id, title, content } = req.body;

    await pool.request()
      .input('course_id', sql.Int, course_id)
      .input('instructor_id', sql.Int, instructor_id)
      .input('title', sql.VarChar, title)
      .input('content', sql.VarChar, content)
      .query(`
        INSERT INTO Announcement (course_id, instructor_id, title, content, posted_date)
        VALUES (@course_id, @instructor_id, @title, @content, GETDATE())
      `);

    res.json({ success: true, message: 'Announcement posted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
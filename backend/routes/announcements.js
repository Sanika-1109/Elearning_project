const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// POST /api/announcements
router.post('/', async (req, res) => {
  try {
    const { course_id, instructor_id, title, content } = req.body;
    const pool = await getPool();

    await pool.query(
      'INSERT INTO announcement (course_id, instructor_id, title, content, posted_date) VALUES ($1, $2, $3, $4, NOW())',
      [course_id, instructor_id, title, content]
    );

    res.json({ success: true, message: 'Announcement posted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
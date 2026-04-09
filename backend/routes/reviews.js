const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { student_id, course_id, rating, comment } = req.body;
    const pool = await getPool();

    await pool.query(
      'INSERT INTO review (student_id, course_id, rating, comment, review_date) VALUES ($1, $2, $3, $4, NOW())',
      [student_id, course_id, rating, comment]
    );

    res.json({ success: true, message: 'Review submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
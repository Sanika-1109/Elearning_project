const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/lessons/:id
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM Lesson WHERE lesson_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Lesson not found' });
    
    // Get next lesson ID
    const [nextRows] = await pool.query(
      'SELECT lesson_id FROM Lesson WHERE course_id = ? AND order_index > ? ORDER BY order_index LIMIT 1',
      [rows[0].course_id, rows[0].order_index]
    );

    res.json({ 
      success: true, 
      lesson: rows[0],
      next_lesson_id: nextRows.length > 0 ? nextRows[0].lesson_id : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/lessons - Create new lesson
router.post('/', async (req, res) => {
  try {
    const { course_id, title, video_url, content_url, order_index } = req.body;
    const pool = await getPool();

    await pool.query(
      'INSERT INTO Lesson (course_id, title, video_url, content_url, order_index) VALUES (?, ?, ?, ?, ?)',
      [course_id, title, video_url, content_url, order_index]
    );

    res.json({ success: true, message: 'Lesson added successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

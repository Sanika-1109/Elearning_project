const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/progress/:student_id
router.get('/:student_id', async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query('SELECT * FROM progress WHERE student_id = $1', [req.params.student_id]);
    res.json({ success: true, progress: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/progress/:student_id/:course_id - Calculated progress
router.get('/:student_id/:course_id', async (req, res) => {
  try {
    const { student_id, course_id } = req.params;
    const pool = await getPool();

    const { rows: totalRows } = await pool.query('SELECT COUNT(*) as count FROM lesson WHERE course_id = $1', [course_id]);
    const { rows: doneRows } = await pool.query(`
      SELECT COUNT(*) as count 
      FROM progress p
      JOIN lesson l ON p.lesson_id = l.lesson_id
      WHERE p.student_id = $1 AND l.course_id = $2 AND p.completed = TRUE
    `, [student_id, course_id]);

    const total = parseInt(totalRows[0].count);
    const completed = parseInt(doneRows[0].count);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ success: true, total, completed, percentage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/progress/complete - Mark lesson as completed
router.post('/complete', async (req, res) => {
  try {
    const { student_id, lesson_id } = req.body;
    const pool = await getPool();

    const { rows: existing } = await pool.query('SELECT * FROM progress WHERE student_id = $1 AND lesson_id = $2', [student_id, lesson_id]);
    
    if (existing.length > 0) {
      await pool.query('UPDATE progress SET completed = TRUE, completed_date = NOW() WHERE student_id = $1 AND lesson_id = $2', [student_id, lesson_id]);
    } else {
      await pool.query('INSERT INTO progress (student_id, lesson_id, completed, completed_date) VALUES ($1, $2, TRUE, NOW())', [student_id, lesson_id]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
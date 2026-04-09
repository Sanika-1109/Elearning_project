const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/quizzes/:lesson_id
router.get('/:lesson_id', async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query('SELECT * FROM quiz WHERE lesson_id = $1', [req.params.lesson_id]);
    res.json({ success: true, quiz: rows.length > 0 ? rows[0] : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/quizzes/attempts/:student_id
router.get('/attempts/:student_id', async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(`
      SELECT qa.*, q.question, l.title as lesson_title
      FROM quiz_attempt qa
      JOIN quiz q ON qa.quiz_id = q.quiz_id
      JOIN lesson l ON q.lesson_id = l.lesson_id
      WHERE qa.student_id = $1
      ORDER BY qa.attempt_date DESC
    `, [req.params.student_id]);
    res.json({ success: true, attempts: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/quizzes/attempt
router.post('/attempt', async (req, res) => {
  try {
    const { student_id, quiz_id, selected_option } = req.body;
    const pool = await getPool();

    const { rows: quizRows } = await pool.query('SELECT correct_option FROM quiz WHERE quiz_id = $1', [quiz_id]);
    if (quizRows.length === 0) return res.status(404).json({ message: 'Quiz not found' });

    // case-insensitive grading
    const is_correct = quizRows[0].correct_option.trim().toLowerCase() === selected_option.trim().toLowerCase();

    // In university schema, quiz_attempt uses 'score'. We'll use 10 for correct, 0 for wrong as an example based on their CHECK constraint.
    await pool.query(
      'INSERT INTO quiz_attempt (student_id, quiz_id, selected_option, score, attempt_date) VALUES ($1, $2, $3, $4, NOW())',
      [student_id, quiz_id, selected_option, is_correct ? 10 : 0]
    );

    const score = is_correct ? 10 : 0;
    res.json({ success: true, correct: is_correct, score, correct_option: quizRows[0].correct_option });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
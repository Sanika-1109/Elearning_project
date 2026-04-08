const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/quizzes/lesson/:lesson_id
router.get('/lesson/:lesson_id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM Quiz WHERE lesson_id = ?', [req.params.lesson_id]);
    res.json({ success: true, quizzes: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/quizzes/attempts/:student_id
router.get('/attempts/:student_id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(`
      SELECT qa.*, q.question, l.title as lesson_title
      FROM QuizAttempt qa
      JOIN Quiz q ON qa.quiz_id = q.quiz_id
      JOIN Lesson l ON q.lesson_id = l.lesson_id
      WHERE qa.student_id = ?
      ORDER BY qa.attempt_date DESC
    `, [req.params.student_id]);
    res.json({ success: true, attempts: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/quizzes/submit
router.post('/submit', async (req, res) => {
  try {
    const { student_id, quiz_id, selected_option } = req.body;
    const pool = await getPool();

    const [quizRows] = await pool.query('SELECT correct_option FROM Quiz WHERE quiz_id = ?', [quiz_id]);
    if (quizRows.length === 0) return res.status(404).json({ message: 'Quiz not found' });

    // case-insensitive grading
    const is_correct = quizRows[0].correct_option.trim().toLowerCase() === selected_option.trim().toLowerCase();

    await pool.query(
      'INSERT INTO QuizAttempt (student_id, quiz_id, selected_option, is_correct, attempt_date) VALUES (?, ?, ?, ?, NOW())',
      [student_id, quiz_id, selected_option, is_correct ? 1 : 0]
    );

    res.json({ success: true, is_correct, correct_option: quizRows[0].correct_option });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
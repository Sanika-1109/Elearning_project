const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

// GET /api/quizzes/:lessonId — get quiz for a lesson
router.get('/:lessonId', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('lesson_id', sql.Int, req.params.lessonId)
      .query(`
        SELECT quiz_id, lesson_id, question, option_a, option_b, option_c, option_d
        FROM Quiz
        WHERE lesson_id = @lesson_id
      `);
    res.json({ success: true, quiz: result.recordset[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/quizzes/attempt — submit a quiz attempt
// Body: { student_id, quiz_id, selected_option }
router.post('/attempt', async (req, res) => {
  try {
    console.log('Quiz Attempt Request Body:', req.body);
    const pool = await getPool();
    const { student_id, quiz_id, selected_option } = req.body;

    // Get correct answer
    const quizResult = await pool.request()
      .input('quiz_id', sql.Int, quiz_id)
      .query(`SELECT correct_option FROM Quiz WHERE quiz_id = @quiz_id`);

    if (quizResult.recordset.length === 0) {
      console.log('Quiz not found for quiz_id:', quiz_id);
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    const correct_option = quizResult.recordset[0].correct_option;
    const score = (selected_option || '').toUpperCase() === (correct_option || '').toUpperCase() ? 100 : 0;

    // Save attempt if student
    if (student_id) {
      await pool.request()
        .input('student_id', sql.Int, student_id)
        .input('quiz_id', sql.Int, quiz_id)
        .input('score', sql.Int, score)
        .query(`
          INSERT INTO Quiz_Attempt (student_id, quiz_id, score, attempt_date)
          VALUES (@student_id, @quiz_id, @score, GETDATE())
        `);
    }

    res.json({
      success: true,
      correct: (selected_option || '').toUpperCase() === (correct_option || '').toUpperCase(),
      correct_option,
      score
    });
  } catch (err) {
    console.error('Quiz Attempt Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/quizzes/attempts/:studentId — all quiz attempts by a student
router.get('/attempts/:studentId', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('student_id', sql.Int, req.params.studentId)
      .query(`
        SELECT qa.attempt_id, qa.score, qa.attempt_date,
               q.question, l.title AS lesson_title
        FROM Quiz_Attempt qa
        JOIN Quiz q    ON qa.quiz_id    = q.quiz_id
        JOIN Lesson l  ON q.lesson_id   = l.lesson_id
        WHERE qa.student_id = @student_id
        ORDER BY qa.attempt_date DESC
      `);
    res.json({ success: true, attempts: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
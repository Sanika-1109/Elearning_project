const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/courses - List courses with search/category
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const pool = await getPool();

    let query = `
      SELECT c.*, cat.category_name, i.name as instructor_name
      FROM Course c
      JOIN Category cat ON c.category_id = cat.category_id
      JOIN Instructor i ON c.instructor_id = i.instructor_id
      WHERE 1=1
    `;
    let params = [];

    if (category) {
      query += ` AND cat.category_name = ?`;
      params.push(category);
    }
    if (search) {
      query += ` AND (c.title LIKE ? OR c.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json({ success: true, courses: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/courses/meta/categories
router.get('/meta/categories', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM Category');
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/courses/:id - Single course details
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await getPool();

    const [courseRows] = await pool.query(`
      SELECT c.*, cat.category_name, i.name as instructor_name
      FROM Course c
      JOIN Category cat ON c.category_id = cat.category_id
      JOIN Instructor i ON c.instructor_id = i.instructor_id
      WHERE c.course_id = ?
    `, [id]);

    if (courseRows.length === 0) return res.status(404).json({ message: 'Course not found' });

    const [lessons] = await pool.query('SELECT * FROM Lesson WHERE course_id = ? ORDER BY order_index', [id]);
    const [reviews] = await pool.query(`
      SELECT r.*, s.name as student_name
      FROM Review r
      JOIN Student s ON r.student_id = s.student_id
      WHERE r.course_id = ?
      ORDER BY r.review_date DESC
    `, [id]);
    const [announcements] = await pool.query(`
      SELECT a.*, i.name as instructor_name
      FROM Announcement a
      JOIN Instructor i ON a.instructor_id = i.instructor_id
      WHERE a.course_id = ?
      ORDER BY a.posted_date DESC
    `, [id]);

    res.json({
      success: true,
      course: courseRows[0],
      lessons,
      reviews,
      announcements
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/courses - Create new course
router.post('/', async (req, res) => {
  try {
    const { title, description, instructor_id, category_id, level } = req.body;
    const pool = await getPool();

    await pool.query(
      'INSERT INTO Course (title, description, instructor_id, category_id, level, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [title, description, instructor_id, category_id, level]
    );

    res.json({ success: true, message: 'Course created successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
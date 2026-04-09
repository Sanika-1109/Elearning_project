const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

// GET /api/courses - List courses with search/category
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const pool = await getPool();

    let query = `
      SELECT c.*, cat.name as category_name, i.name as instructor_name
      FROM course c
      JOIN category cat ON c.category_id = cat.category_id
      JOIN instructor i ON c.instructor_id = i.instructor_id
      WHERE 1=1
    `;
    let params = [];

    if (category) {
      params.push(category);
      query += ` AND cat.name = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`, `%${search}%`);
      query += ` AND (c.title LIKE $${params.length - 1} OR c.description LIKE $${params.length})`;
    }

    const { rows } = await pool.query(query, params);
    res.json({ success: true, courses: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/courses/meta/categories
router.get('/meta/categories', async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query('SELECT * FROM category');
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

    const { rows: courseRows } = await pool.query(`
      SELECT c.*, cat.name as category_name, i.name as instructor_name
      FROM course c
      JOIN category cat ON c.category_id = cat.category_id
      JOIN instructor i ON c.instructor_id = i.instructor_id
      WHERE c.course_id = $1
    `, [id]);

    if (courseRows.length === 0) return res.status(404).json({ message: 'Course not found' });

    const { rows: lessons } = await pool.query('SELECT * FROM lesson WHERE course_id = $1 ORDER BY order_index', [id]);
    const { rows: reviews } = await pool.query(`
      SELECT r.*, s.name as student_name
      FROM review r
      JOIN student s ON r.student_id = s.student_id
      WHERE r.course_id = $1
      ORDER BY r.review_date DESC
    `, [id]);
    const { rows: announcements } = await pool.query(`
      SELECT a.*, i.name as instructor_name
      FROM announcement a
      JOIN instructor i ON a.instructor_id = i.instructor_id
      WHERE a.course_id = $1
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
    const { title, description, instructor_id, category_id } = req.body;
    const pool = await getPool();

    await pool.query(
      'INSERT INTO course (title, description, instructor_id, category_id, created_date) VALUES ($1, $2, $3, $4, NOW())',
      [title, description, instructor_id, category_id]
    );

    res.json({ success: true, message: 'Course created successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
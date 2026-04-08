const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        c.course_id,
        c.title,
        CAST(c.description AS VARCHAR(MAX)) AS description,
        c.created_date,
        i.name AS instructor_name,
        cat.name AS category_name,
        COUNT(DISTINCT e.enrollment_id) AS total_enrollments,
        ROUND(AVG(CAST(r.rating AS FLOAT)), 1) AS avg_rating
      FROM Course c
      JOIN Instructor i   ON c.instructor_id = i.instructor_id
      JOIN Category cat   ON c.category_id   = cat.category_id
      LEFT JOIN Enrollment e ON c.course_id  = e.course_id
      LEFT JOIN Review r     ON c.course_id  = r.course_id
      GROUP BY
        c.course_id, c.title, CAST(c.description AS VARCHAR(MAX)), c.created_date,
        i.name, cat.name
      ORDER BY c.created_date DESC
    `);
    res.json({ success: true, courses: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const courseId = req.params.id;

    const courseResult = await pool.request()
      .input('course_id', sql.Int, courseId)
      .query(`
        SELECT c.course_id, c.title,
          CAST(c.description AS VARCHAR(MAX)) AS description,
          c.created_date,
          i.name AS instructor_name, i.instructor_id,
          cat.name AS category_name
        FROM Course c
        JOIN Instructor i  ON c.instructor_id = i.instructor_id
        JOIN Category cat  ON c.category_id   = cat.category_id
        WHERE c.course_id = @course_id
      `);

    if (courseResult.recordset.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const lessonsResult = await pool.request()
      .input('course_id', sql.Int, courseId)
      .query(`
        SELECT lesson_id, title, content_url, video_url, order_index
        FROM Lesson
        WHERE course_id = @course_id
        ORDER BY order_index
      `);

    const reviewsResult = await pool.request()
      .input('course_id', sql.Int, courseId)
      .query(`
        SELECT r.review_id, r.rating,
          CAST(r.comment AS VARCHAR(MAX)) AS comment,
          r.review_date, s.name AS student_name
        FROM Review r
        JOIN Student s ON r.student_id = s.student_id
        WHERE r.course_id = @course_id
        ORDER BY r.review_date DESC
      `);

    const announcementsResult = await pool.request()
      .input('course_id', sql.Int, courseId)
      .query(`
        SELECT a.announcement_id, a.title,
          CAST(a.content AS VARCHAR(MAX)) AS content,
          a.posted_date, i.name AS instructor_name
        FROM Announcement a
        JOIN Instructor i ON a.instructor_id = i.instructor_id
        WHERE a.course_id = @course_id
        ORDER BY a.posted_date DESC
      `);

    res.json({
      success: true,
      course: courseResult.recordset[0],
      lessons: lessonsResult.recordset,
      reviews: reviewsResult.recordset,
      announcements: announcementsResult.recordset
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('category_id', sql.Int, req.params.categoryId)
      .query(`
        SELECT c.course_id, c.title,
          CAST(c.description AS VARCHAR(MAX)) AS description,
          i.name AS instructor_name,
          cat.name AS category_name
        FROM Course c
        JOIN Instructor i  ON c.instructor_id = i.instructor_id
        JOIN Category cat  ON c.category_id   = cat.category_id
        WHERE c.category_id = @category_id
      `);
    res.json({ success: true, courses: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/courses — create a new course
router.post('/', async (req, res) => {
  try {
    const pool = await getPool();
    const { title, description, instructor_id, category_id } = req.body;
    await pool.request()
      .input('title', sql.VarChar, title)
      .input('description', sql.Text, description)
      .input('instructor_id', sql.Int, instructor_id)
      .input('category_id', sql.Int, category_id)
      .query(`
        INSERT INTO Course (title, description, instructor_id, category_id, created_date)
        VALUES (@title, @description, @instructor_id, @category_id, GETDATE())
      `);
    res.json({ success: true, message: 'Course created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/courses/categories — get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT category_id, name FROM Category');
    res.json({ success: true, categories: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
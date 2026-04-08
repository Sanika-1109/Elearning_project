const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../db");

router.get("/:courseId", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("course_id", sql.Int, req.params.courseId)
      .query("SELECT lesson_id, course_id, title, content_url, video_url, order_index FROM Lesson WHERE course_id = @course_id ORDER BY order_index");
    res.json({ success: true, lessons: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/single/:lessonId", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("lesson_id", sql.Int, req.params.lessonId)
      .query("SELECT l.lesson_id, l.title, l.content_url, l.video_url, l.order_index, l.course_id, c.title AS course_title FROM Lesson l JOIN Course c ON l.course_id = c.course_id WHERE l.lesson_id = @lesson_id");
    if (result.recordset.length === 0) return res.status(404).json({ success: false, error: "Lesson not found" });
    res.json({ success: true, lesson: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/lessons — create a new lesson
router.post("/", async (req, res) => {
  try {
    const pool = await getPool();
    const { course_id, title, video_url, content_url, order_index } = req.body;
    await pool.request()
      .input("course_id", sql.Int, course_id)
      .input("title", sql.VarChar, title)
      .input("video_url", sql.VarChar, video_url)
      .input("content_url", sql.VarChar, content_url)
      .input("order_index", sql.Int, order_index || 1)
      .query(`
        INSERT INTO Lesson (course_id, title, video_url, content_url, order_index)
        VALUES (@course_id, @title, @video_url, @content_url, @order_index)
      `);
    res.json({ success: true, message: "Lesson added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

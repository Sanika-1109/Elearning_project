const express = require("express");
const router = express.Router();
const { getPool, sql } = require("../db");
router.post("/login/student", async (req, res) => {
  try {
    const pool = await getPool();
    const { email, password } = req.body;
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query("SELECT student_id, name, email, registered_date FROM Student WHERE email = @email AND password_hash = @password");
    if (result.recordset.length === 0) return res.status(401).json({ success: false, message: "Invalid email or password" });
    res.json({ success: true, user: result.recordset[0], role: "student" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.post("/login/instructor", async (req, res) => {
  try {
    const pool = await getPool();
    const { email, password } = req.body;
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query("SELECT instructor_id, name, email, hire_date FROM Instructor WHERE email = @email AND password_hash = @password");
    if (result.recordset.length === 0) return res.status(401).json({ success: false, message: "Invalid email or password" });
    res.json({ success: true, user: result.recordset[0], role: "instructor" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.post("/register/student", async (req, res) => {
  try {
    const pool = await getPool();
    const { name, email, password } = req.body;
    const existing = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT student_id FROM Student WHERE email = @email");
    if (existing.recordset.length > 0) return res.status(400).json({ success: false, message: "Email already registered" });
    await pool.request()
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query("INSERT INTO Student (name, email, password_hash, registered_date) VALUES (@name, @email, @password, GETDATE())");
    res.json({ success: true, message: "Registration successful! Please login." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
module.exports = router;

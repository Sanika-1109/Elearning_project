const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { getPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/courses',       require('./routes/courses'));
app.use('/api/lessons',       require('./routes/lessons'));
app.use('/api/quizzes',       require('./routes/quizzes'));
app.use('/api/progress',      require('./routes/progress'));
app.use('/api/enrollments',   require('./routes/enrollments'));
app.use('/api/reviews',       require('./routes/reviews'));
app.use('/api/students',      require('./routes/students'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/auth',          require('./routes/auth'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.json({ message: 'E-Learning API is running!' });
});

app.get('/api/test', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT COUNT(*) AS student_count FROM Student');
    res.json({ success: true, student_count: result.recordset[0].student_count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
  getPool();
});
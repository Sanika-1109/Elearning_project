# EduPath — E-Learning Management Platform

EduPath is a full-stack e-learning management system built as a bridge between a Database Management System (DBMS) and modern web programming. It provides a seamless experience for students to learn and instructors to manage education content.

## 🚀 Features

### For Students
- **Course Discovery**: Browse and filter courses by category.
- **Engagement**: Enroll in courses and track progress in real-time.
- **Interactive Learning**: Watch video lessons and access educational resources.
- **Knowledge Checks**: Take quizzes at the end of lessons with instant grading.
- **Feedback**: Rate and review courses to help other learners.
- **Analytics Dashboard**: View completion percentages, average quiz scores, and recent attempts.

### For Instructors
- **Course Management**: Create new courses and add lessons with video/document links.
- **Student Analytics**: Access a comprehensive list of students and their enrollment counts.
- **Communication**: Post announcements to specific courses to keep students updated.
- **Performance Insights**: Track course ratings and enrollment statistics.

## 🛠️ Technology Stack

- **Frontend**: AngularJS (SPA), Vanilla CSS (Modern aesthetic), HTML5.
- **Backend**: Node.js & Express.js API.
- **Database**: Microsoft SQL Server (MSSQL).
- **Communication**: RESTful API architecture.

## 📂 Project Structure

- `/frontend`: Responsive HTML/JS pages using AngularJS.
- `/backend`: Express server with parameterized SQL queries for security.
- `/backend/routes`: Modular API routing for Auth, Courses, Lessons, Quizzes, etc.
- `start.bat`: Convenience script to launch both frontend and backend.

## ⚙️ Setup Instructions

1. **Database Setup**:
   - Ensure MSSQL is running on `127.0.0.1:1433`.
   - Create a database and update the credentials in `backend/db.js` or `.env`.
   - Run the provided schema scripts (not included in this repo, assumed pre-existing).

2. **Backend Setup**:
   - Navigate to `/backend`.
   - Run `npm install` to install dependencies (`express`, `mssql`, `cors`, `dotenv`).
   - Create a `.env` file with `DB_NAME`, `PORT`, etc.

3. **Running the App**:
   - Run the `start.bat` file in the root directory.
   - The backend will start on `localhost:3000`.
   - Open any HTML file in `/frontend` (e.g., `login.html`) using a Live Server or direct browser access.

## 🔒 Security & Optimization
- **Case-Insensitive Grading**: Quiz answers are normalized to ensure fair grading.
- **Parameterized Queries**: Protecting against SQL Injection.
- **Session Management**: Role-based access using `sessionStorage`.
- **Modern Design**: Built with Playfair Display and DM Sans for a premium look and feel.

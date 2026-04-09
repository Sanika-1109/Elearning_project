# E-Learning Platform

A full-stack web application for managing students, courses, module progress, and quiz attempts. Built using **AngularJS (1.8.x)** for the frontend and **Node.js (Express)** with **MySQL** for the backend.

## 📂 Project Structure
- **/backend**: Express server and API routes.
- **/frontend**: AngularJS SPA files (HTML, CSS, JS).
- **/database**: SQL schema and dummy data.
- **.env**: Environment variables (Database credentials).

---

## 🚀 Local Setup Instructions

### 1. Database Setup (phpMyAdmin)
1. Log in to your database host (e.g., [freesqldatabase.com](https://www.freesqldatabase.com/)).
2. Open **phpMyAdmin**.
3. Select your database (e.g., `sql12822662`).
4. Go to the **Import** tab.
5. Upload the file located at `database/schema.sql` and click **Go**.

### 2. Environment Configuration
Create a `.env` file in the root directory (already done for you) with the following structure:
```env
DB_HOST=sql12.freesqldatabase.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_PORT=3306
```

### 3. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   > The server will run on `http://localhost:3000`.

### 4. Accessing the App
The server automatically serves the frontend. Open your browser to:
`http://localhost:3000`

---

## 🌐 Deployment to Railway

1. **GitHub**: Push the **root** folder of this project to a GitHub repository.
2. **Railway**:
   - Create a **New Project** and connect your GitHub repo.
   - **Important**: In the service settings, set the **Root Directory** to `backend`.
   - **Variables**: Copy the values from your `.env` file into the Railway **Variables** tab.

---

## ✨ Features
- **SPA Routing**: 5 main views (Home, Students, Courses, Progress, Quiz Attempts).
- **ApiService**: Centralized `$http` service for backend communication.
- **SQL Analytics**: Advanced queries for student progress and dashboard metrics.
- **Responsive UI**: Custom CSS with a premium e-learning aesthetic.

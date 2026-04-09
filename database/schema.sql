-- Create tables
CREATE TABLE student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registered_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instructor (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hire_date DATE
);

CREATE TABLE category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE course (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructor_id INT NOT NULL,
    category_id INT,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE lesson (
    lesson_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content_url TEXT,
    video_url VARCHAR(255),
    order_index INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE
);

CREATE TABLE quiz (
    quiz_id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) CHECK (correct_option IN ('A','B','C','D')),
    FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id) ON DELETE CASCADE
);

CREATE TABLE quiz_attempt (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT CHECK (score BETWEEN 0 AND 10),
    attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id) ON DELETE CASCADE
);

CREATE TABLE progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_date DATETIME NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id) ON DELETE CASCADE,
    UNIQUE (student_id, lesson_id)
);

CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    UNIQUE (student_id, course_id)
);

CREATE TABLE review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    UNIQUE (student_id, course_id)
);

CREATE TABLE announcement (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    instructor_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO category (name, description) VALUES
('Web Development', 'Learn to build websites using modern technologies'),
('Data Science', 'Python, SQL, Machine Learning fundamentals'),
('Programming Basics', 'Core concepts of coding and algorithms');

INSERT INTO instructor (name, email, password_hash, hire_date) VALUES
('Dr. Sharma', 'sharma@elearn.com', 'hashed123', '2020-01-15'),
('Prof. Patel', 'patel@elearn.com', 'hashed456', '2019-06-10');

INSERT INTO student (name, email, password_hash) VALUES
('Alice Johnson', 'alice@example.com', 'hash_a'),
('Bob Smith', 'bob@example.com', 'hash_b'),
('Charlie Brown', 'charlie@example.com', 'hash_c'),
('Diana Prince', 'diana@example.com', 'hash_d'),
('Eve Adams', 'eve@example.com', 'hash_e'),
('Frank Castle', 'frank@example.com', 'hash_f'),
('Grace Hopper', 'grace@example.com', 'hash_g'),
('Henry Cavill', 'henry@example.com', 'hash_h'),
('Ivy Chen', 'ivy@example.com', 'hash_i'),
('Jack Sparrow', 'jack@example.com', 'hash_j');

INSERT INTO course (title, description, instructor_id, category_id) VALUES
('Web Development Bootcamp', 'Full stack web development', 1, 1),
('Data Science with Python', 'NumPy, Pandas, Matplotlib', 2, 2),
('SQL for Beginners', 'Structured Query Language', 2, 2);

INSERT INTO lesson (course_id, title, content_url, video_url, order_index) VALUES
(1, 'HTML Basics', 'https://example.com/html', 'https://youtu.be/abc', 1),
(1, 'CSS Styling', 'https://example.com/css', 'https://youtu.be/def', 2),
(1, 'JavaScript Intro', 'https://example.com/js', 'https://youtu.be/ghi', 3),
(1, 'AngularJS Fundamentals', 'https://example.com/angular', 'https://youtu.be/jkl', 4),
(2, 'Python Basics', 'https://example.com/python', 'https://youtu.be/mno', 1),
(2, 'NumPy Arrays', 'https://example.com/numpy', 'https://youtu.be/pqr', 2),
(3, 'SELECT Statements', 'https://example.com/select', 'https://youtu.be/stu', 1),
(3, 'JOINs', 'https://example.com/joins', 'https://youtu.be/vwx', 2);

INSERT INTO quiz (lesson_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES
(1, 'What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language', 'A'),
(2, 'Which CSS property changes text color?', 'color', 'text-color', 'font-color', 'bgcolor', 'A'),
(3, 'Which symbol is used for single-line comments in JavaScript?', '//', '<!-- -->', '#', '/* */', 'A'),
(4, 'AngularJS is maintained by?', 'Google', 'Facebook', 'Microsoft', 'Apple', 'A'),
(5, 'What is the output of print(2**3) in Python?', '8', '6', '9', '5', 'A'),
(6, 'Which NumPy function creates an array of zeros?', 'np.zeros()', 'np.empty()', 'np.ones()', 'np.arange()', 'A'),
(7, 'Which SQL keyword is used to retrieve data?', 'SELECT', 'EXTRACT', 'GET', 'OPEN', 'A'),
(8, 'What does SQL JOIN do?', 'Combine rows from two tables', 'Delete rows', 'Update data', 'Create a new table', 'A');

INSERT INTO enrollment (student_id, course_id) VALUES
(1,1), (1,2), (2,1), (3,1), (3,2), (4,2), (5,1), (6,3), (7,3), (8,1), (9,2), (10,1);

INSERT INTO progress (student_id, lesson_id, completed, completed_date) VALUES
(1,1,1,'2025-03-01'), (1,2,1,'2025-03-02'), (1,3,0,NULL),
(2,1,1,'2025-03-01'), (2,2,0,NULL),
(3,1,1,'2025-03-02'), (3,2,1,'2025-03-03'), (3,3,1,'2025-03-04'),
(4,5,1,'2025-03-05'), (4,6,0,NULL),
(5,1,1,'2025-03-01'), (5,2,1,'2025-03-02'), (5,3,1,'2025-03-03'), (5,4,1,'2025-03-04'),
(6,7,1,'2025-03-10'), (6,8,0,NULL),
(7,7,1,'2025-03-11'), (7,8,0,NULL),
(8,1,1,'2025-03-02'), (8,2,0,NULL),
(9,5,1,'2025-03-06'), (9,6,1,'2025-03-07'),
(10,1,1,'2025-03-01'), (10,2,0,NULL);

INSERT INTO quiz_attempt (student_id, quiz_id, score) VALUES
(1,1,8), (1,2,7), (1,3,9),
(2,1,6), (2,2,8),
(3,1,9), (3,2,8), (3,3,10),
(4,5,7), (4,6,6),
(5,1,10), (5,2,9), (5,3,9), (5,4,8),
(6,7,8), (6,8,7),
(7,7,9), (7,8,8),
(8,1,7), (8,2,6),
(9,5,9), (9,6,9),
(10,1,8), (10,2,7);

INSERT INTO review (student_id, course_id, rating, comment) VALUES
(1,1,5, 'Excellent course!'), (2,1,4, 'Very good'), (3,1,5, 'Loved it'),
(1,2,4, 'Nice introduction to Data Science'), (4,2,5, 'Great instructor'),
(6,3,5, 'SQL made easy!');

INSERT INTO announcement (course_id, instructor_id, title, content) VALUES
(1,1, 'New assignment posted', 'Complete the AngularJS project by next week.'),
(2,2, 'Office hours', 'I will be available on Friday 3-5 PM.'),
(3,2, 'Quiz on JOINS', 'A quiz on SQL JOINs will be available on Sunday.');

-- Create view
CREATE OR REPLACE VIEW course_progress AS
SELECT s.student_id, s.name, c.course_id, c.title,
       COUNT(l.lesson_id) AS total_lessons,
       COUNT(CASE WHEN p.completed = 1 THEN 1 END) AS completed_lessons,
       ROUND(100.0 * COUNT(CASE WHEN p.completed = 1 THEN 1 END) / COUNT(l.lesson_id), 2) AS percentage
FROM student s
JOIN enrollment e ON s.student_id = e.student_id
JOIN course c ON e.course_id = c.course_id
JOIN lesson l ON c.course_id = l.course_id
LEFT JOIN progress p ON s.student_id = p.student_id AND l.lesson_id = p.lesson_id
GROUP BY s.student_id, s.name, c.course_id, c.title;

-- Create stored procedure
DELIMITER //

CREATE PROCEDURE GetStudentProgress(IN p_student_id INT)
BEGIN
    SELECT c.title, COUNT(l.lesson_id) AS total_lessons,
           COUNT(CASE WHEN p.completed = 1 THEN 1 END) AS completed_lessons,
           ROUND(100.0 * COUNT(CASE WHEN p.completed = 1 THEN 1 END) / COUNT(l.lesson_id), 2) AS percentage
    FROM course c
    JOIN enrollment e ON c.course_id = e.course_id
    JOIN lesson l ON c.course_id = l.course_id
    LEFT JOIN progress p ON l.lesson_id = p.lesson_id AND p.student_id = p_student_id
    WHERE e.student_id = p_student_id
    GROUP BY c.title;
END //

-- Create trigger
CREATE TRIGGER trg_update_completed_date
BEFORE UPDATE ON progress
FOR EACH ROW
BEGIN
    IF NEW.completed = 1 AND OLD.completed = 0 AND NEW.completed_date IS NULL THEN
        SET NEW.completed_date = CURRENT_TIMESTAMP;
    END IF;
END //

DELIMITER ;

-- Create indexes
CREATE INDEX idx_student_email ON student(email);
CREATE INDEX idx_quiz_attempt_student ON quiz_attempt(student_id);

-- Queries
SELECT '1. Students and their courses' AS '';
SELECT s.name AS student_name, c.title AS course_title
FROM student s
JOIN enrollment e ON s.student_id = e.student_id
JOIN course c ON e.course_id = c.course_id
ORDER BY s.name;

SELECT '2. Lesson count per course' AS '';
SELECT c.title, COUNT(l.lesson_id) AS lesson_count
FROM course c
LEFT JOIN lesson l ON c.course_id = l.course_id
GROUP BY c.course_id, c.title;

SELECT '3. Average quiz score per student' AS '';
SELECT s.name, AVG(qa.score) AS avg_score
FROM student s
JOIN quiz_attempt qa ON s.student_id = qa.student_id
GROUP BY s.student_id, s.name
ORDER BY avg_score DESC;

SELECT '4. Students with more than 2 completed lessons' AS '';
SELECT s.name, COUNT(p.lesson_id) AS completed_lessons
FROM student s
JOIN progress p ON s.student_id = p.student_id
WHERE p.completed = 1
GROUP BY s.student_id, s.name
HAVING COUNT(p.lesson_id) > 2;

SELECT '5. Courses with average rating > 4.5' AS '';
SELECT c.title, AVG(r.rating) AS avg_rating
FROM course c
JOIN review r ON c.course_id = r.course_id
GROUP BY c.course_id, c.title
HAVING AVG(r.rating) > 4.5;

SELECT '6. Students who never completed any lesson' AS '';
SELECT name FROM student s
WHERE NOT EXISTS (
    SELECT 1 FROM progress p
    WHERE p.student_id = s.student_id AND p.completed = 1
);

SELECT '7. Lessons and their quiz questions' AS '';
SELECT l.title AS lesson_title, q.question
FROM lesson l
JOIN quiz q ON l.lesson_id = q.lesson_id;

SELECT '8. Course progress view (course_id=1)' AS '';
SELECT * FROM course_progress WHERE course_id = 1;

SELECT '9. Top 3 students by total quiz score' AS '';
SELECT s.name, SUM(qa.score) AS total_score
FROM student s
JOIN quiz_attempt qa ON s.student_id = qa.student_id
GROUP BY s.student_id, s.name
ORDER BY total_score DESC
LIMIT 3;

SELECT '10. Courses with no reviews' AS '';
SELECT c.title
FROM course c
LEFT JOIN review r ON c.course_id = r.course_id
WHERE r.review_id IS NULL;

SELECT '11. Number of students per course' AS '';
SELECT c.title, COUNT(e.student_id) AS student_count
FROM course c
LEFT JOIN enrollment e ON c.course_id = e.course_id
GROUP BY c.course_id, c.title;

SELECT '12. Call stored procedure for student 1' AS '';
CALL GetStudentProgress(1);

SELECT '13. Transaction example: enroll student 2 in course 3' AS '';
START TRANSACTION;
    INSERT INTO enrollment (student_id, course_id) VALUES (2, 3);
    INSERT INTO progress (student_id, lesson_id, completed)
    SELECT 2, lesson_id, 0 FROM lesson WHERE course_id = 3;
COMMIT;
SELECT 'Enrollment and progress added' AS '';

SELECT '14. Students who scored above average in any quiz' AS '';
SELECT name FROM student
WHERE student_id = ANY (
    SELECT student_id FROM quiz_attempt
    WHERE score > (SELECT AVG(score) FROM quiz_attempt)
);

SELECT '15. All emails (student + instructor)' AS '';
SELECT email FROM student
UNION
SELECT email FROM instructor;

SELECT '16. Performance category for quiz scores' AS '';
SELECT s.name, qa.score,
       CASE
           WHEN qa.score >= 9 THEN 'Excellent'
           WHEN qa.score >= 7 THEN 'Good'
           WHEN qa.score >= 5 THEN 'Average'
           ELSE 'Poor'
       END AS performance
FROM student s
JOIN quiz_attempt qa ON s.student_id = qa.student_id;

SELECT '17. Rank students by total quiz score (using ROW_NUMBER)' AS '';
WITH ScoreTotals AS (
    SELECT s.name, SUM(qa.score) AS total_score
    FROM student s
    JOIN quiz_attempt qa ON s.student_id = qa.student_id
    GROUP BY s.student_id, s.name
)
SELECT name, total_score,
       ROW_NUMBER() OVER (ORDER BY total_score DESC) AS `rank`
FROM ScoreTotals;

SELECT '18. Students who completed all lessons of a course (course_id=1)' AS '';
SELECT s.name, c.title
FROM student s
JOIN enrollment e ON s.student_id = e.student_id
JOIN course c ON e.course_id = c.course_id
WHERE NOT EXISTS (
    SELECT 1 FROM lesson l
    WHERE l.course_id = c.course_id
    AND NOT EXISTS (
        SELECT 1 FROM progress p
        WHERE p.student_id = s.student_id AND p.lesson_id = l.lesson_id AND p.completed = 1
    )
);
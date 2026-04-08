@echo off
echo ================================
echo   EduPath E-Learning Platform
echo ================================
echo.
echo Starting backend server...
cd /d "%~dp0backend"
start "EduPath Backend" cmd /k "node server.js"
timeout /t 3 /nobreak >nul
echo.
echo Opening frontend...
start "" "%~dp0frontend\login.html"
echo.
echo ================================
echo   Server running at:
echo   http://localhost:3000
echo   Frontend opened in browser!
echo ================================
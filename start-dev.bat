@echo off
echo Starting Anonymous Cybersecurity Club Website...
echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
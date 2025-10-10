@echo off
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║     ANONYMOUS CYBERSECURITY CLUB - Starting Servers...       ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                    SERVERS STARTED!                           ║
echo ║                                                               ║
echo ║  Backend:  http://localhost:5000                             ║
echo ║  Frontend: http://localhost:5173                             ║
echo ║                                                               ║
echo ║  Login Credentials:                                          ║
echo ║  Admin: admin@anonymous.club / admin123                      ║
echo ║  User:  hacker@anonymous.club / hacker123                    ║
echo ║                                                               ║
echo ║  Opening browser in 5 seconds...                             ║
echo ╚═══════════════════════════════════════════════════════════════╝
timeout /t 5 /nobreak >nul
start http://localhost:5173

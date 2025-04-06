@echo off
echo ===============================
echo   Skippy Launch Sequence Online
echo ===============================
cd /d %~dp0

rem === FRONTEND ===
echo Launching frontend (Vite @ 5174)...
start "Frontend" cmd /k "cd ui && npm run dev -- --port 5174"

rem === BACKEND ===
echo Launching backend (Node API @ 3001)...
start "Backend" cmd /k "cd api && npm run dev"

echo ===============================
echo   Frontend @ http://localhost:5174
echo   Backend  @ http://localhost:3001
echo ===============================
pause

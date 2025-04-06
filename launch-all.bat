@echo off
echo ===============================
echo  Skippy Launch Sequence Online 
echo ===============================
cd /d %~dp0

rem === CLEANUP PHASE ===
echo Cleaning old frontend build artifacts...
IF EXIST "frontend\dist" rmdir /s /q frontend\dist
IF EXIST "frontend\.vite" rmdir /s /q frontend\.vite

rem === BACKEND PHASE ===
echo Launching Backend Server...
start cmd /k "cd backend && npm run dev"

rem === FRONTEND PHASE ===
echo Launching Frontend UI...
start cmd /k "cd frontend && npm run dev"

echo ===============================
echo  Skippy Launch Complete! 🧠💥
echo ===============================
pause
@echo off
echo ===============================
echo   Skippy Launch Sequence Online
echo ===============================
cd /d %~dp0

rem === CLEANUP PHASE ===
echo Cleaning Vite frontend artifacts...
IF EXIST "frontend\dist" rmdir /s /q frontend\dist
IF EXIST "frontend\.vite" rmdir /s /q frontend\.vite

rem === LAUNCH BACKEND (server.js @ project root) ===
echo Launching backend from project root...
start cmd /k "node server.js"

rem === LAUNCH FRONTEND (frontend/ @ 5174) ===
echo Launching frontend on port 5174...
start cmd /k "cd frontend && npm run dev -- --port 5174"

echo ===============================
echo   Launch Complete: Backend @3001 | UI @5174
echo ===============================
pause

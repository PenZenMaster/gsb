@echo off
REM 🧼 Skippy's Cleanup & Launch Script for RankRocket UI

echo Cleaning up old PostCSS and Tailwind configs...

REM Delete CommonJS conflicts
del postcss.config.js >nul 2>&1
del tailwind.config.js >nul 2>&1

echo ✅ Cleanup complete.
echo 🔥 Launching frontend on http://localhost:5173 ...

REM Launch Vite dev server
npm run dev

@echo off
REM 🧠 Skippy's Full Launch Sequence

echo 🚀 Launching RankRocket Backend...
start "RankRocket Backend" cmd /k "cd /d E:\projects\gsb && node server.js"

echo 💻 Launching RankRocket Frontend (Vite)...
start "RankRocket Frontend" cmd /k "cd /d E:\projects\gsb\rankrocket-ui && npm run dev"

echo ✅ All systems launching...
exit

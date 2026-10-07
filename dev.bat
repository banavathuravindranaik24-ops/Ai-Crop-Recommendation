@echo off
cd /d "%~dp0"
echo ====================================================
echo Starting AI Crop Recommendation in Development Mode...
echo ====================================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not found in PATH!
    pause
    exit /b 1
)

echo Starting Backend Server on port 5000...
start "Crop Backend (Express)" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Starting Frontend Dev Server on port 3000...
start "Crop Frontend (React Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Both servers launched in separate windows!
echo Frontend will be accessible at: http://localhost:3000
echo Backend will be accessible at: http://localhost:5000

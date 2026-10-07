@echo off
cd /d "%~dp0"
echo ====================================================
echo Starting AI Crop Recommendation System...
echo ====================================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not found in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting unified server (Frontend + Backend)...
npm start
if %errorlevel% neq 0 (
    echo.
    echo Server failed to start.
    pause
)

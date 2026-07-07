@echo off
REM ============================================================
REM   AI Career Hub - One-Click Launcher (Windows)
REM   Double-click this file OR run "start.bat" in a terminal.
REM ============================================================

echo.
echo ============================================================
echo    AI CAREER HUB - Starting up...
echo ============================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js 18+ from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Install dependencies only if node_modules is missing
if not exist "node_modules" (
    echo [1/2] Installing dependencies for the first time...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
) else (
    echo [1/2] Dependencies already installed. Skipping.
)

echo.
echo [2/2] Launching the app at http://localhost:5173
echo Your browser will open automatically. Press Ctrl+C to stop.
echo.

REM Open the browser after a short delay, then start the dev server
start "" cmd /c "timeout /t 3 >nul && start http://localhost:5173"
call npm run dev

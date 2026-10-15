@echo off
title Bluey - Windows & Android Desktop Companion
echo ========================================================
echo   Starting Bluey (Windows & Android Companion)
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18 or newer from https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if node_modules is missing
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo Starting Bluey on http://localhost:3000 ...
echo.
echo Hotkeys on Windows:
echo   Alt+Space      : Wake up / Sleep
echo   Ctrl+Alt+F     : Toggle Follow Mouse
echo   Ctrl+Alt+P     : Point to Mouse
echo   Ctrl+Alt+D     : Dock at bottom of screen
echo   Ctrl+Alt+T     : Talk bounce test
echo   Ctrl+Alt+S     : Emergency Stop
echo.

start http://localhost:3000
call npm run dev

@echo off
title Bluey - Windows Desktop Companion
echo ========================================================
echo   Launching Bluey Windows Desktop Companion
echo ========================================================
echo.

set APP_URL=https://ais-pre-i2ejhtnfja2hequjcpfrjz-209220523134.europe-west2.run.app

:: 1. Try launching in Edge Standalone App Window (Native UI)
start "" msedge --app=%APP_URL% --window-size=1280,820 2>nul
if %ERRORLEVEL% equ 0 exit /b 0

:: 2. Try launching in Chrome Standalone App Window
start "" chrome --app=%APP_URL% --window-size=1280,820 2>nul
if %ERRORLEVEL% equ 0 exit /b 0

:: 3. Fallback to default system browser
start "" %APP_URL%
exit /b 0

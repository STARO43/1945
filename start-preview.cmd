@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js or upload dist to a static host.
  pause
  exit /b 1
)
start "" "http://127.0.0.1:8767/"
node preview.mjs
pause

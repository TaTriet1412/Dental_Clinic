@echo off
set SERVICE_NAME=%1
if "%SERVICE_NAME%"=="" set SERVICE_NAME=auth-service

echo 🚀 Starting development mode for %SERVICE_NAME%...

echo 📦 Stopping existing %SERVICE_NAME% container...
docker-compose stop %SERVICE_NAME% 2>nul

echo 🔨 Building development image for %SERVICE_NAME%...
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml build %SERVICE_NAME%

echo ▶️  Starting %SERVICE_NAME% in development mode...
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d %SERVICE_NAME%

echo 📋 Showing logs for %SERVICE_NAME% (Press Ctrl+C to stop viewing logs)...
timeout /t 2 /nobreak >nul
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f %SERVICE_NAME%
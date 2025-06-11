#!/bin/bash

SERVICE_NAME=${1:-auth-service}

echo "🚀 Starting development mode for $SERVICE_NAME..."

# Dừng service cụ thể nếu đang chạy
echo "📦 Stopping existing $SERVICE_NAME container..."
docker-compose stop $SERVICE_NAME 2>/dev/null || echo "Service was not running"

# Build development image
echo "🔨 Building development image for $SERVICE_NAME..."
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml build $SERVICE_NAME

# Chạy lại với development configuration
echo "▶️  Starting $SERVICE_NAME in development mode..."
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d $SERVICE_NAME

# Hiển thị logs
echo "📋 Showing logs for $SERVICE_NAME (Press Ctrl+C to stop viewing logs)..."
sleep 2
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml logs -f $SERVICE_NAME
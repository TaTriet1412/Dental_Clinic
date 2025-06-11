#!/bin/bash

SERVICE_NAME=${1:-all}

if [ "$SERVICE_NAME" = "all" ]; then
    echo "🛑 Stopping all development services..."
    docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml down
    echo "🔄 Starting production mode..."
    docker-compose up -d
else
    echo "🛑 Stopping development mode for $SERVICE_NAME..."
    docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml stop $SERVICE_NAME
    echo "🔄 Starting $SERVICE_NAME in production mode..."
    docker-compose up -d $SERVICE_NAME
fi

echo "✅ Done!"
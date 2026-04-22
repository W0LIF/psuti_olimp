#!/bin/bash
set -e

echo "Starting application..."

# Run migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    if alembic upgrade head; then
        echo "Migrations completed successfully"
    else
        echo "Warning: Migrations failed, but continuing with app startup"
    fi
else
    echo "No DATABASE_URL set, skipping migrations"
fi

# Start the application
echo "Starting application..."
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}

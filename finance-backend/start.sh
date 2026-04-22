#!/bin/bash
set -e

# Run migrations if DATABASE_URL is set and not running tests
if [ -n "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    alembic upgrade head || echo "Migrations failed or already applied"
fi

# Start the application
echo "Starting application..."
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}

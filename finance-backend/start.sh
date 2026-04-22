#!/bin/bash
set -e

echo "Starting application..."

# Run migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
    echo "Running database migrations..."
    for i in {1..5}; do
        echo "Migration attempt $i..."
        if alembic upgrade head; then
            echo "Migrations completed successfully"
            break
        else
            echo "Migration attempt $i failed, waiting before retry..."
            sleep 5
        fi
    done
else
    echo "No DATABASE_URL set, skipping migrations"
fi

# Start the application
echo "Starting application..."
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}

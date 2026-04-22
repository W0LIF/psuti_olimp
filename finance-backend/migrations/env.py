import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from alembic import context
from sqlalchemy import create_engine
from app.models import Base
from app.config import settings

# Преобразуем асинхронный URL в синхронный (для psycopg2)
sync_url = settings.DATABASE_URL.replace('+asyncpg', '').replace('postgresql+asyncpg://', 'postgresql://')

target_metadata = Base.metadata

def run_migrations_offline():
    context.configure(url=sync_url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(sync_url)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
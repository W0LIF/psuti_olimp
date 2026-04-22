from app.models import Base
from app.config import settings
from sqlalchemy.ext.asyncio import create_async_engine

target_metadata = Base.metadata

async def run_migrations_online():
    connectable = create_async_engine(settings.DATABASE_URL)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
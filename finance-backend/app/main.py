from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.routers import auth, transactions, statistics, budget, insights, categories
from app.config import settings

app = FastAPI(title="Student Finance API", version="1.0")

raw_origins = settings.ALLOWED_ORIGINS or "*"
origins = [origin.strip().strip('"').strip("'") for origin in raw_origins.split(",") if origin.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(statistics.router)
app.include_router(budget.router)
app.include_router(insights.router)
app.include_router(categories.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.post("/migrate")
def run_migrations():
    """Manually run database migrations"""
    import subprocess
    try:
        result = subprocess.run(["alembic", "upgrade", "head"], capture_output=True, text=True)
        if result.returncode == 0:
            return {"status": "success", "message": "Migrations completed"}
        else:
            return {"status": "error", "message": result.stderr}
    except Exception as e:
        return {"status": "error", "message": str(e)}
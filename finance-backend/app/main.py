from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, transactions, statistics, budgets, insights

app = FastAPI(title="Student Finance API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для разработки; в продакшене укажи домен фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(statistics.router)
app.include_router(budgets.router)
app.include_router(insights.router)

@app.get("/")
def root():
    return {"message": "Student Finance API"}
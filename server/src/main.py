from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from src.database import engine, Base
from src.routes import auth, stocks, orders, users, admin, alerts
from src.routes import prices as prices_router
from src.middleware.rate_limit import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StockSight AI API",
    description="Kinetic Ledger — AI-Powered Trading Insights Platform",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ALLOWED_ORIGINS = [
    "https://stocksight-vision.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "service": "StockSight AI API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy", "environment": os.getenv("ENVIRONMENT", "production")}

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(prices_router.router, prefix="/market", tags=["Market"])

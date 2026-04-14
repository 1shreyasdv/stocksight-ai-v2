import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from src.database import engine, Base
from src.routes import auth, stocks, orders, users, admin, alerts
from src.routes import market          # ← replaces old "prices" import
from src.middleware.rate_limit import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StockSight AI API",
    description="Kinetic Ledger — AI-Powered Trading Insights Platform",
    version="2.0.0",
)

# ── Rate limiting ─────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Add any preview/branch URLs in EXTRA_ORIGINS env var (comma-separated)
_extra = [o.strip() for o in os.getenv("EXTRA_ORIGINS", "").split(",") if o.strip()]
frontend_url = os.getenv("FRONTEND_URL")

ALLOWED_ORIGINS = [
    "https://stocksight-vision.vercel.app",
    "https://stocksight-vision-lk4m37x12-1shreyasdvs-projects.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    *_extra,
]

if frontend_url:
    ALLOWED_ORIGINS.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Use "*" temporarily to see if the CORS error disappears
    # allow_credentials=True, # Disabled to allow "*" origins without FastAPI throwing an exception
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ── Health / root ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "status":  "ok",
        "service": "StockSight AI API",
        "version": "2.0.0",
    }


@app.get("/health")
def health():
    return {
        "status":      "healthy",
        "environment": os.getenv("ENVIRONMENT", "production"),
    }


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,    prefix="/auth",    tags=["Auth"])
app.include_router(stocks.router,  prefix="/stocks",  tags=["Stocks"])
app.include_router(orders.router,  prefix="/orders",  tags=["Orders"])
app.include_router(users.router,   prefix="/users",   tags=["Users"])
app.include_router(admin.router,   prefix="/admin",   tags=["Admin"])
app.include_router(alerts.router,  prefix="/alerts",  tags=["Alerts"])
app.include_router(market.router)  # router already has prefix="/market"

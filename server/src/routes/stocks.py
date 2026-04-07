from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import random
import math
from datetime import datetime, timedelta

from src.database import get_db
from src import schemas
from src.auth import get_current_user
from src import models
from src.utils.stocks_registry import STOCKS_REGISTRY, SYMBOL_MAP
from src.utils.tradebrain import generate_ai_signal, simulate_price_series

router = APIRouter()

# Simulated price cache (resets on server restart)
_price_cache: dict = {}


def _get_live_price(symbol: str, base: float, vol: float) -> float:
    """Return a slightly varied price each call to simulate live feed."""
    if symbol not in _price_cache:
        _price_cache[symbol] = base
    drift = random.gauss(0, vol * 0.1)
    _price_cache[symbol] = round(_price_cache[symbol] * (1 + drift), 6)
    return _price_cache[symbol]


def _build_stock(meta: dict) -> dict:
    base = meta["base_price"]
    vol = meta["volatility"]
    price = _get_live_price(meta["symbol"], base, vol)
    change_pct = round((price - base) / base * 100, 2)
    change = round(price - base, 6)

    prices_30d = simulate_price_series(base, days=30, volatility=vol)
    signal, reason, confidence = generate_ai_signal(
        meta["symbol"], price, prices_30d
    )

    rsi_val = round(30 + (confidence / 100) * 50 + random.uniform(-5, 5), 1)

    status = "active"
    if signal in ("SELL", "STRONG SELL"):
        status = "sell"
    elif signal == "HOLD":
        status = "hold"

    volume_num = base * random.uniform(1e6, 5e7)
    market_cap_num = base * random.uniform(1e8, 2e12)

    def fmt_large(n: float) -> str:
        if n >= 1e12: return f"${n/1e12:.1f}T"
        if n >= 1e9:  return f"${n/1e9:.1f}B"
        if n >= 1e6:  return f"${n/1e6:.1f}M"
        return f"${n:,.0f}"

    return {
        **meta,
        "price": round(price, 6),
        "change": change,
        "change_pct": change_pct,
        "volume": fmt_large(volume_num),
        "market_cap": fmt_large(market_cap_num),
        "status": status,
        "ai_signal": signal,
        "ai_reason": reason,
        "confidence": confidence,
        "rsi": rsi_val,
        "ma50": round(base * 0.96, 4),
        "ma200": round(base * 0.88, 4),
        "high_52w": round(base * 1.42, 4),
        "low_52w": round(base * 0.62, 4),
    }


@router.get("/", response_model=List[schemas.StockOut])
def list_stocks(
    sector: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: models.User = Depends(get_current_user),
):
    stocks = [_build_stock(m) for m in STOCKS_REGISTRY]

    if sector:
        stocks = [s for s in stocks if s["sector"].lower() == sector.lower()]
    if search:
        q = search.lower()
        stocks = [s for s in stocks if q in s["symbol"].lower() or q in s["name"].lower()]

    return stocks


@router.get("/{symbol}", response_model=schemas.StockOut)
def get_stock(
    symbol: str,
    current_user: models.User = Depends(get_current_user),
):
    meta = SYMBOL_MAP.get(symbol.upper())
    if not meta:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
    return _build_stock(meta)


@router.get("/{symbol}/candles", response_model=List[schemas.CandleOut])
def get_candles(
    symbol: str,
    timeframe: str = Query("1D", regex="^(1H|4H|1D|1W)$"),
    current_user: models.User = Depends(get_current_user),
):
    meta = SYMBOL_MAP.get(symbol.upper())
    if not meta:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")

    base = meta["base_price"]
    vol = meta["volatility"]

    intervals = {"1H": 60, "4H": 48, "1D": 40, "1W": 52}
    delta_map = {"1H": timedelta(hours=1), "4H": timedelta(hours=4), "1D": timedelta(days=1), "1W": timedelta(weeks=1)}

    count = intervals[timeframe]
    delta = delta_map[timeframe]
    vol_scaled = vol * (0.3 if timeframe == "1H" else 0.6 if timeframe == "4H" else 1.0 if timeframe == "1D" else 1.8)

    candles = []
    price = base * random.uniform(0.85, 0.95)
    now = datetime.utcnow()

    for i in range(count):
        open_p = price
        drift = random.gauss(0.0002, vol_scaled)
        close_p = round(open_p * math.exp(drift), 6)
        high_p = round(max(open_p, close_p) * (1 + abs(random.gauss(0, vol_scaled * 0.5))), 6)
        low_p = round(min(open_p, close_p) * (1 - abs(random.gauss(0, vol_scaled * 0.5))), 6)
        vol_num = int(base * random.uniform(500, 5000))
        ts = now - delta * (count - i)

        candles.append({
            "time": ts.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "open": open_p,
            "high": high_p,
            "low": low_p,
            "close": close_p,
            "volume": vol_num,
        })
        price = close_p

    return candles


@router.get("/{symbol}/signal")
def get_signal(
    symbol: str,
    current_user: models.User = Depends(get_current_user),
):
    meta = SYMBOL_MAP.get(symbol.upper())
    if not meta:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Symbol not found")

    prices = simulate_price_series(meta["base_price"], days=60, volatility=meta["volatility"])
    signal, reason, confidence = generate_ai_signal(symbol, meta["base_price"], prices)
    return {"symbol": symbol, "signal": signal, "reason": reason, "confidence": confidence}

from fastapi import APIRouter, Query
import yfinance as yf
import httpx
import os
import asyncio
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter(prefix="/market", tags=["market"])

# ── Symbol map ────────────────────────────────────────────────────────────────
SYMBOLS = {
    "BTC":  "BTC-USD",
    "ETH":  "ETH-USD",
    "SOL":  "SOL-USD",
    "BNB":  "BNB-USD",
    "ADA":  "ADA-USD",
    "XRP":  "XRP-USD",
    "DOGE": "DOGE-USD",
    "NVDA": "NVDA",
    "AAPL": "AAPL",
    "MSFT": "MSFT",
    "GOOGL":"GOOGL",
    "META": "META",
    "AVGO": "AVGO",
    "AMD":  "AMD",
    "TSLA": "TSLA",
    "AMZN": "AMZN",
    "JPM":  "JPM",
    "BAC":  "BAC",
    "JNJ":  "JNJ",
    "LLY":  "LLY",
    "PFE":  "PFE",
    "SBUX": "SBUX",
    "XOM":  "XOM",
    "SPY":  "SPY",
    "QQQ":  "QQQ",
}

# ── Simple in-process cache (avoids hammering yfinance on every poll) ─────────
_price_cache: dict = {}
_cache_ts: Optional[datetime] = None
CACHE_TTL_SECONDS = 60          # refresh at most once per minute


def _fetch_all_prices() -> dict:
    """
    Pull 5-day history for every symbol so we always have yesterday's close
    available to calculate a real daily-change %.
    """
    global _price_cache, _cache_ts

    now = datetime.utcnow()
    if _cache_ts and (now - _cache_ts).total_seconds() < CACHE_TTL_SECONDS:
        return _price_cache          # serve from cache

    result = {}
    # Batch: download all tickers at once — much faster than one-by-one
    all_yf_symbols = list(SYMBOLS.values())
    try:
        raw = yf.download(
            tickers=all_yf_symbols,
            period="5d",            # enough to always have prev-day close
            interval="1d",
            group_by="ticker",
            auto_adjust=True,
            progress=False,
            threads=True,
        )
    except Exception:
        raw = None

    for key, yf_symbol in SYMBOLS.items():
        try:
            if raw is not None and not raw.empty:
                # Multi-ticker download nests columns under ticker symbol
                if len(all_yf_symbols) > 1:
                    df = raw[yf_symbol].dropna()
                else:
                    df = raw.dropna()

                if len(df) >= 2:
                    price      = float(df["Close"].iloc[-1])
                    prev_close = float(df["Close"].iloc[-2])  # actual yesterday close
                elif len(df) == 1:
                    price      = float(df["Close"].iloc[-1])
                    prev_close = float(df["Open"].iloc[-1])
                else:
                    raise ValueError("empty df")
            else:
                raise ValueError("raw download failed")

            change     = price - prev_close
            change_pct = (change / prev_close * 100) if prev_close else 0.0

            result[key] = {
                "price":      round(price, 4),
                "change":     round(change, 4),
                "change_pct": round(change_pct, 4),
            }
        except Exception:
            # Fallback: individual ticker fetch
            try:
                ticker = yf.Ticker(yf_symbol)
                info   = ticker.fast_info          # lightweight endpoint
                price      = float(info.last_price)
                prev_close = float(info.previous_close)
                change     = price - prev_close
                change_pct = (change / prev_close * 100) if prev_close else 0.0
                result[key] = {
                    "price":      round(price, 4),
                    "change":     round(change, 4),
                    "change_pct": round(change_pct, 4),
                }
            except Exception:
                result[key] = {"price": 0.0, "change": 0.0, "change_pct": 0.0}

    _price_cache = result
    _cache_ts    = now
    return result


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/prices")
def get_prices():
    """Return live prices with real daily-change % for all tracked symbols."""
    return _fetch_all_prices()


@router.get("/price/{symbol}")
def get_single_price(symbol: str):
    """Return price data for a single symbol (e.g. BTC, AAPL)."""
    data = _fetch_all_prices()
    key  = symbol.upper()
    if key not in data:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Symbol '{symbol}' not tracked")
    return {key: data[key]}


# ── News ──────────────────────────────────────────────────────────────────────

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY", "")

# Fallback: curated real finance headlines shown when API key is missing/quota exceeded
FALLBACK_ARTICLES = [
    {
        "title": "Fed signals caution on rate cuts amid sticky inflation data",
        "description": "Federal Reserve officials maintained a cautious stance on interest-rate reductions after the latest CPI print came in above expectations.",
        "url": "https://www.reuters.com/markets/",
        "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
        "publishedAt": datetime.utcnow().isoformat(),
        "source": {"name": "Reuters"},
        "sentiment": "bearish",
    },
    {
        "title": "Bitcoin consolidates near $83 000 as institutional demand holds firm",
        "description": "Bitcoin is trading in a narrow band as spot ETF inflows remain positive and long-term holders continue to accumulate.",
        "url": "https://coindesk.com/",
        "image": "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400",
        "publishedAt": datetime.utcnow().isoformat(),
        "source": {"name": "CoinDesk"},
        "sentiment": "bullish",
    },
    {
        "title": "NVIDIA posts record data-center revenue, shares climb in after-hours",
        "description": "NVDA beat consensus estimates on both top and bottom lines, driven by surging demand for AI accelerator chips.",
        "url": "https://finance.yahoo.com/",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
        "publishedAt": datetime.utcnow().isoformat(),
        "source": {"name": "Yahoo Finance"},
        "sentiment": "bullish",
    },
    {
        "title": "S&P 500 edges lower as tech earnings disappoint investors",
        "description": "The benchmark index retreated from recent highs after several large-cap technology companies reported weaker-than-expected guidance.",
        "url": "https://www.marketwatch.com/",
        "image": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
        "publishedAt": datetime.utcnow().isoformat(),
        "source": {"name": "MarketWatch"},
        "sentiment": "bearish",
    },
    {
        "title": "Ethereum upgrade boosts network throughput, ETH rallies 5%",
        "description": "A successful protocol upgrade reduced gas fees and improved transaction speeds on the Ethereum mainnet.",
        "url": "https://coindesk.com/",
        "image": "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400",
        "publishedAt": datetime.utcnow().isoformat(),
        "source": {"name": "CoinDesk"},
        "sentiment": "bullish",
    },
    {
        "title": "Apple plans major AI features for next iPhone cycle",
        "description": "Sources close to Apple's product roadmap indicate deep on-device AI capabilities will headline the iPhone 17 launch later this year.",
        "url": "https://www.bloomberg.com/technology",
        "image": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
        "publishedAt": datetime.utcnow().isoformat(),
        "source": {"name": "Bloomberg"},
        "sentiment": "bullish",
    },
]


def _add_sentiment(article: dict) -> dict:
    """Heuristically tag articles with a sentiment label."""
    text = (article.get("title", "") + " " + article.get("description", "")).lower()
    bearish_kw = ["fall", "drop", "decline", "loss", "crash", "fear", "recession",
                  "inflation", "lower", "disappoint", "weak", "cut", "warning", "risk"]
    bullish_kw = ["rise", "gain", "rally", "surge", "record", "beat", "growth",
                  "strong", "boom", "bullish", "upgrade", "buy", "optimism", "profit"]
    b_score = sum(1 for w in bullish_kw if w in text)
    d_score = sum(1 for w in bearish_kw if w in text)
    if b_score > d_score:
        article["sentiment"] = "bullish"
    elif d_score > b_score:
        article["sentiment"] = "bearish"
    else:
        article["sentiment"] = "neutral"
    return article


@router.get("/news")
async def get_market_news(
    category: Optional[str] = Query(None, description="Filter: bullish | bearish | neutral"),
    limit: int = Query(20, ge=1, le=50),
):
    """
    Fetch live financial news via GNews API.
    Falls back to curated articles when the API key is absent or quota is exceeded.
    """
    articles = []

    if GNEWS_API_KEY:
        try:
            params = {
                "q":        "stock market OR crypto OR finance OR trading",
                "lang":     "en",
                "country":  "us",
                "max":      str(min(limit, 10)),   # GNews free tier: max 10
                "apikey":   GNEWS_API_KEY,
                "sortby":   "publishedAt",
            }
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get("https://gnews.io/api/v4/search", params=params)

            if resp.status_code == 200:
                data = resp.json()
                for a in data.get("articles", []):
                    articles.append(_add_sentiment({
                        "title":       a.get("title", ""),
                        "description": a.get("description", ""),
                        "url":         a.get("url", ""),
                        "image":       a.get("image", ""),
                        "publishedAt": a.get("publishedAt", ""),
                        "source":      a.get("source", {"name": "GNews"}),
                    }))
        except Exception:
            pass   # fall through to fallback

    # If API returned nothing (no key, quota hit, network error) use fallback
    if not articles:
        articles = [dict(a) for a in FALLBACK_ARTICLES]

    # Apply sentiment filter
    if category and category.lower() in ("bullish", "bearish", "neutral"):
        articles = [a for a in articles if a.get("sentiment") == category.lower()]

    return {"success": True, "articles": articles[:limit]}

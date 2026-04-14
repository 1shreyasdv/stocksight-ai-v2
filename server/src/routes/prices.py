from fastapi import APIRouter
import httpx

router = APIRouter()

YAHOO_SYMBOLS = [
    "BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "ADA-USD", "XRP-USD", "DOGE-USD",
    "NVDA", "AAPL", "MSFT", "GOOGL", "META", "AVGO", "AMD", "TSLA", "AMZN",
    "JPM", "LLY", "PFE", "XOM", "SPY", "QQQ"
]

@router.get("/prices")
async def get_live_prices():
    symbols = ",".join(YAHOO_SYMBOLS)
    url = f"https://query1.finance.yahoo.com/v7/finance/quote?symbols={symbols}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url, headers=headers)
            if res.status_code == 200:
                data = res.json()
                quotes = data.get("quoteResponse", {}).get("result", [])
                result = {}
                for q in quotes:
                    result[q["symbol"]] = {
                        "price": q.get("regularMarketPrice", 0),
                        "change": q.get("regularMarketChange", 0),
                        "change_pct": q.get("regularMarketChangePercent", 0),
                    }
                return {"success": True, "data": result}
    except Exception as e:
        pass
    
    # Try query2 as fallback
    try:
        url2 = url.replace("query1", "query2")
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url2, headers=headers)
            if res.status_code == 200:
                data = res.json()
                quotes = data.get("quoteResponse", {}).get("result", [])
                result = {}
                for q in quotes:
                    result[q["symbol"]] = {
                        "price": q.get("regularMarketPrice", 0),
                        "change": q.get("regularMarketChange", 0),
                        "change_pct": q.get("regularMarketChangePercent", 0),
                    }
                return {"success": True, "data": result}
    except Exception as e:
        pass
    
    return {"success": False, "data": {}}


@router.get("/news")
async def get_market_news():
    import os
    api_key = os.getenv("GNEWS_API_KEY", "")
    if not api_key:
        return {"success": False, "articles": []}
    
    url = f"https://gnews.io/api/v4/search?q=stock+market+crypto+finance&lang=en&max=20&sortby=publishedAt&token={api_key}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url)
            if res.status_code == 200:
                data = res.json()
                return {"success": True, "articles": data.get("articles", [])}
    except Exception as e:
        pass
    return {"success": False, "articles": []}

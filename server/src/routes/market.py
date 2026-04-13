from fastapi import APIRouter
import yfinance as yf

router = APIRouter(prefix="/market", tags=["market"])

SYMBOLS = {
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
    "SOL": "SOL-USD",
    "BNB": "BNB-USD",
    "ADA": "ADA-USD",
    "XRP": "XRP-USD",
    "DOGE": "DOGE-USD",
    "NVDA": "NVDA",
    "AAPL": "AAPL",
    "MSFT": "MSFT",
    "GOOGL": "GOOGL",
    "META": "META",
    "AVGO": "AVGO",
    "AMD": "AMD",
    "TSLA": "TSLA",
    "AMZN": "AMZN",
    "JPM": "JPM",
    "LLY": "LLY",
    "PFE": "PFE",
    "XOM": "XOM",
    "SPY": "SPY",
    "QQQ": "QQQ",
}

@router.get("/prices")
def get_prices():
    result = {}

    for key, symbol in SYMBOLS.items():
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")

            if not data.empty:
                price = float(data["Close"].iloc[-1])
                open_price = float(data["Open"].iloc[-1])
                change = price - open_price
                change_pct = (change / open_price) * 100 if open_price else 0

                result[key] = {
                    "price": round(price, 2),
                    "change": round(change, 2),
                    "change_pct": round(change_pct, 2),
                }
        except Exception as e:
            result[key] = {"price": 0, "change": 0, "change_pct": 0}

    return result

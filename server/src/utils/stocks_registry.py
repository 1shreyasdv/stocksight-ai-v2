"""
Master stocks registry. In production, prices are fetched from Alpha Vantage.
This module provides the static metadata + simulated live prices as fallback.
"""

STOCKS_REGISTRY = [
    # Crypto
    {"symbol": "BTC",   "name": "Bitcoin",               "sector": "Crypto",         "logo_color": "#f7931a20", "logo_letter": "₿",  "base_price": 84000, "volatility": 0.025},
    {"symbol": "ETH",   "name": "Ethereum",              "sector": "Crypto",         "logo_color": "#627eea20", "logo_letter": "Ξ",  "base_price": 1800,  "volatility": 0.028},
    {"symbol": "SOL",   "name": "Solana",                "sector": "Crypto",         "logo_color": "#9945ff20", "logo_letter": "S",  "base_price": 130,   "volatility": 0.035},
    {"symbol": "BNB",   "name": "BNB Chain",             "sector": "Crypto",         "logo_color": "#f0b90b20", "logo_letter": "B",  "base_price": 590,   "volatility": 0.022},
    {"symbol": "ADA",   "name": "Cardano",               "sector": "Crypto",         "logo_color": "#0033ad20", "logo_letter": "A",  "base_price": 0.65,  "volatility": 0.040},
    {"symbol": "XRP",   "name": "Ripple",                "sector": "Crypto",         "logo_color": "#00aae420", "logo_letter": "X",  "base_price": 2.10,  "volatility": 0.030},
    {"symbol": "DOGE",  "name": "Dogecoin",              "sector": "Crypto",         "logo_color": "#c2a63320", "logo_letter": "D",  "base_price": 0.17,  "volatility": 0.055},
    # Tech
    {"symbol": "NVDA",  "name": "NVIDIA Corp",           "sector": "Technology",     "logo_color": "#76b90020", "logo_letter": "N",  "base_price": 875,   "volatility": 0.022},
    {"symbol": "AAPL",  "name": "Apple Inc",             "sector": "Technology",     "logo_color": "#aaaaaa20", "logo_letter": "A",  "base_price": 210,   "volatility": 0.012},
    {"symbol": "MSFT",  "name": "Microsoft",             "sector": "Technology",     "logo_color": "#00a4ef20", "logo_letter": "M",  "base_price": 380,   "volatility": 0.013},
    {"symbol": "GOOGL", "name": "Alphabet Inc",          "sector": "Technology",     "logo_color": "#4285f420", "logo_letter": "G",  "base_price": 165,   "volatility": 0.014},
    {"symbol": "META",  "name": "Meta Platforms",        "sector": "Technology",     "logo_color": "#0866ff20", "logo_letter": "M",  "base_price": 510,   "volatility": 0.018},
    {"symbol": "AVGO",  "name": "Broadcom",              "sector": "Semiconductors", "logo_color": "#cc000020", "logo_letter": "B",  "base_price": 1450,  "volatility": 0.020},
    {"symbol": "AMD",   "name": "Advanced Micro Devices","sector": "Semiconductors", "logo_color": "#ed1c2420", "logo_letter": "A",  "base_price": 155,   "volatility": 0.024},
    {"symbol": "INTC",  "name": "Intel Corp",            "sector": "Semiconductors", "logo_color": "#0071c520", "logo_letter": "I",  "base_price": 22,    "volatility": 0.016},
    {"symbol": "TSLA",  "name": "Tesla Inc",             "sector": "Automotive",     "logo_color": "#e3101420", "logo_letter": "T",  "base_price": 240,   "volatility": 0.032},
    {"symbol": "AMZN",  "name": "Amazon",                "sector": "E-Commerce",     "logo_color": "#ff990020", "logo_letter": "A",  "base_price": 185,   "volatility": 0.015},
    # Finance
    {"symbol": "JPM",   "name": "JPMorgan Chase",        "sector": "Finance",        "logo_color": "#00000020", "logo_letter": "J",  "base_price": 230,   "volatility": 0.012},
    {"symbol": "GS",    "name": "Goldman Sachs",         "sector": "Finance",        "logo_color": "#6ab04c20", "logo_letter": "G",  "base_price": 490,   "volatility": 0.014},
    {"symbol": "V",     "name": "Visa Inc",              "sector": "Finance",        "logo_color": "#1a1f7120", "logo_letter": "V",  "base_price": 330,   "volatility": 0.010},
    {"symbol": "BAC",   "name": "Bank of America",       "sector": "Finance",        "logo_color": "#e3102020", "logo_letter": "B",  "base_price": 40,    "volatility": 0.013},
    # Healthcare
    {"symbol": "JNJ",   "name": "Johnson & Johnson",     "sector": "Healthcare",     "logo_color": "#cc000020", "logo_letter": "J",  "base_price": 155,   "volatility": 0.010},
    {"symbol": "LLY",   "name": "Eli Lilly",             "sector": "Healthcare",     "logo_color": "#cc000020", "logo_letter": "L",  "base_price": 810,   "volatility": 0.018},
    {"symbol": "PFE",   "name": "Pfizer Inc",            "sector": "Healthcare",     "logo_color": "#0093d020", "logo_letter": "P",  "base_price": 27,    "volatility": 0.012},
    # Consumer
    {"symbol": "SBUX",  "name": "Starbucks",             "sector": "Consumer",       "logo_color": "#00704a20", "logo_letter": "S",  "base_price": 82,    "volatility": 0.014},
    {"symbol": "MCD",   "name": "McDonald's",            "sector": "Consumer",       "logo_color": "#ffbc0d20", "logo_letter": "M",  "base_price": 295,   "volatility": 0.010},
    # Energy
    {"symbol": "XOM",   "name": "ExxonMobil",            "sector": "Energy",         "logo_color": "#cc000020", "logo_letter": "X",  "base_price": 120,   "volatility": 0.013},
    {"symbol": "CVX",   "name": "Chevron",               "sector": "Energy",         "logo_color": "#00497920", "logo_letter": "C",  "base_price": 165,   "volatility": 0.012},
    # ETF
    {"symbol": "SPY",   "name": "S&P 500 ETF",           "sector": "ETF",            "logo_color": "#22d3a020", "logo_letter": "S",  "base_price": 530,   "volatility": 0.009},
    {"symbol": "QQQ",   "name": "Nasdaq 100 ETF",        "sector": "ETF",            "logo_color": "#60a5fa20", "logo_letter": "Q",  "base_price": 450,   "volatility": 0.011},
]

SYMBOL_MAP = {s["symbol"]: s for s in STOCKS_REGISTRY}

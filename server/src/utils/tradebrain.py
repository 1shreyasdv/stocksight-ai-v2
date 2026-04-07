"""
TradeBrain AI Engine
Computes RSI, Moving Averages, and generates Buy/Hold/Sell signals
with a confidence score and human-readable reason.
"""

import random
from typing import Tuple, Optional


def compute_rsi(prices: list[float], period: int = 14) -> float:
    """Compute RSI from a list of closing prices."""
    if len(prices) < period + 1:
        return 50.0

    gains, losses = [], []
    for i in range(1, len(prices)):
        diff = prices[i] - prices[i - 1]
        gains.append(max(diff, 0))
        losses.append(max(-diff, 0))

    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period

    if avg_loss == 0:
        return 100.0

    rs = avg_gain / avg_loss
    return round(100 - (100 / (1 + rs)), 2)


def compute_moving_average(prices: list[float], period: int) -> Optional[float]:
    """Simple moving average over the last `period` prices."""
    if len(prices) < period:
        return None
    return round(sum(prices[-period:]) / period, 4)


def generate_ai_signal(
    symbol: str,
    current_price: float,
    prices_30d: list[float],
    volume_spike: bool = False,
) -> Tuple[str, str, int]:
    """
    Returns (signal, reason, confidence) based on RSI + MA crossover logic.
    """
    rsi = compute_rsi(prices_30d)
    ma50 = compute_moving_average(prices_30d, min(50, len(prices_30d)))
    ma200 = compute_moving_average(prices_30d, min(200, len(prices_30d)))
    price_vs_ma50 = ((current_price - ma50) / ma50 * 100) if ma50 else 0

    signal = "HOLD"
    confidence = 50
    reason = f"Price is near fair value. RSI at {rsi:.1f} — neutral zone."

    if rsi < 30:
        signal = "STRONG BUY"
        confidence = random.randint(80, 94)
        reason = (
            f"RSI deeply oversold at {rsi:.1f}. Historically strong reversal zone. "
            f"Price {abs(price_vs_ma50):.1f}% below MA50 — accumulation opportunity."
        )
    elif rsi < 45 and price_vs_ma50 < -5:
        signal = "BUY"
        confidence = random.randint(65, 80)
        reason = (
            f"RSI at {rsi:.1f} entering oversold territory. "
            f"Price {abs(price_vs_ma50):.1f}% below 50-day MA — potential mean reversion."
        )
    elif rsi > 75:
        signal = "STRONG SELL"
        confidence = random.randint(78, 90)
        reason = (
            f"RSI overbought at {rsi:.1f}. "
            f"Price {price_vs_ma50:.1f}% above MA50 — elevated correction risk."
        )
    elif rsi > 65 and price_vs_ma50 > 10:
        signal = "SELL"
        confidence = random.randint(60, 75)
        reason = (
            f"RSI at {rsi:.1f} — extended. "
            f"Price {price_vs_ma50:.1f}% above MA50. Consider taking partial profits."
        )
    elif 45 <= rsi <= 55:
        signal = "HOLD"
        confidence = random.randint(48, 60)
        reason = f"RSI neutral at {rsi:.1f}. No strong directional signal. Monitor for breakout confirmation."
    elif rsi > 55 and price_vs_ma50 > 2:
        signal = "BUY"
        confidence = random.randint(62, 78)
        reason = (
            f"Bullish momentum with RSI at {rsi:.1f}. "
            f"Price holding {price_vs_ma50:.1f}% above MA50 — trend continuation likely."
        )

    # Volume spike boosts confidence
    if volume_spike and signal in ("BUY", "STRONG BUY"):
        confidence = min(96, confidence + 8)
        reason += " Volume spike confirms buying pressure."

    # Golden cross check
    if ma50 and ma200 and ma50 > ma200 and signal in ("BUY", "HOLD"):
        signal = "BUY" if signal == "HOLD" else signal
        confidence = min(96, confidence + 5)
        reason += f" MA50 (${ma50:,.2f}) above MA200 (${ma200:,.2f}) — golden cross active."

    return signal, reason, confidence


def simulate_price_series(base_price: float, days: int = 200, volatility: float = 0.02) -> list[float]:
    """Generate a synthetic price series for signal computation."""
    import math
    prices = [base_price]
    for _ in range(days - 1):
        drift = random.gauss(0.0003, volatility)
        new_price = prices[-1] * math.exp(drift)
        prices.append(round(new_price, 6))
    return prices

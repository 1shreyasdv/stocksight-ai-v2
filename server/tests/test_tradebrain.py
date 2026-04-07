import pytest
from src.utils.tradebrain import generate_ai_signal, compute_rsi, compute_moving_average

def test_compute_rsi():
    prices = [100, 102, 101, 105, 107, 108, 110, 109, 112, 115, 118, 117, 120, 122, 125]
    rsi = compute_rsi(prices)
    assert 0 <= rsi <= 100
    assert rsi > 50  # Since prices are generally rising

def test_compute_moving_average():
    prices = [10, 20, 30, 40, 50]
    ma = compute_moving_average(prices, 3)
    assert ma == (30 + 40 + 50) / 3

def test_generate_ai_signal_buy():
    # RSI < 30 case
    prices_30d = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30]
    signal, reason, confidence = generate_ai_signal("AAPL", 30, prices_30d)
    assert "BUY" in signal
    assert confidence >= 80

def test_generate_ai_signal_sell():
    # RSI > 75 case
    prices_30d = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240]
    signal, reason, confidence = generate_ai_signal("TSLA", 240, prices_30d)
    assert "SELL" in signal
    assert confidence >= 78

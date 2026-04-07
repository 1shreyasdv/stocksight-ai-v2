import type { Stock } from '@/types';

export const STOCKS_DATA: Stock[] = [
  // Crypto
  { symbol: 'BTC', name: 'Bitcoin', price: 84000, change: 1521.30, change_pct: 2.43, volume: '$32.1B', market_cap: '$1.26T', sector: 'Crypto', status: 'active', logo_color: '#f7931a20', logo_letter: '₿', ai_signal: 'STRONG BUY', ai_reason: 'RSI recovering from oversold. Accumulation phase ending. Target $88,500.', confidence: 87, rsi: 62, ma50: 81200, ma200: 72800, high_52w: 83800, low_52w: 38500 },
  { symbol: 'ETH', name: 'Ethereum', price: 1800, change: -42.10, change_pct: -1.20, volume: '$14.8B', market_cap: '$214B', sector: 'Crypto', status: 'hold', logo_color: '#627eea20', logo_letter: 'Ξ', ai_signal: 'HOLD', ai_reason: 'Consolidating below resistance at $1,900. Wait for breakout confirmation.', confidence: 61, rsi: 48, ma50: 1780, ma200: 1640, high_52w: 4090, low_52w: 1220 },
  { symbol: 'SOL', name: 'Solana', price: 130, change: -0.89, change_pct: -0.61, volume: '$2.1B', market_cap: '$53B', sector: 'Crypto', status: 'active', logo_color: '#9945ff20', logo_letter: 'S', ai_signal: 'BUY', ai_reason: 'Strong on-chain activity. Moving average crossover bullish. Target $145.', confidence: 74, rsi: 55, ma50: 128, ma200: 108, high_52w: 204, low_52w: 58 },
  { symbol: 'BNB', name: 'BNB Chain', price: 590, change: 11.20, change_pct: 1.96, volume: '$1.4B', market_cap: '$85B', sector: 'Crypto', status: 'active', logo_color: '#f0b90b20', logo_letter: 'B', ai_signal: 'BUY', ai_reason: 'Ecosystem growth driving price. Support at $560 holding strong.', confidence: 70, rsi: 58, ma50: 568, ma200: 480, high_52w: 720, low_52w: 310 },
  { symbol: 'ADA', name: 'Cardano', price: 0.65, change: 0.0091, change_pct: 1.92, volume: '$420M', market_cap: '$17B', sector: 'Crypto', status: 'hold', logo_color: '#0033ad20', logo_letter: 'A', ai_signal: 'HOLD', ai_reason: 'Weak momentum. Needs volume confirmation before entry.', confidence: 45, rsi: 42, ma50: 0.64, ma200: 0.52, high_52w: 0.82, low_52w: 0.25 },
  { symbol: 'XRP', name: 'Ripple', price: 2.10, change: 0.0142, change_pct: 2.80, volume: '$1.2B', market_cap: '$128B', sector: 'Crypto', status: 'active', logo_color: '#00aae420', logo_letter: 'X', ai_signal: 'BUY', ai_reason: 'Legal clarity driving adoption. Target $2.50.', confidence: 68, rsi: 60, ma50: 1.90, ma200: 1.44, high_52w: 2.93, low_52w: 0.40 },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.17, change: 0.0082, change_pct: 5.33, volume: '$1.8B', market_cap: '$23B', sector: 'Crypto', status: 'active', logo_color: '#c2a63320', logo_letter: 'D', ai_signal: 'HOLD', ai_reason: 'Meme-driven volatility. High risk.', confidence: 38, rsi: 70, ma50: 0.16, ma200: 0.12, high_52w: 0.229, low_52w: 0.065 },
  // US Tech
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875, change: 44.20, change_pct: 5.20, volume: '$8.4B', market_cap: '$2.2T', sector: 'Technology', status: 'active', logo_color: '#76b90020', logo_letter: 'N', ai_signal: 'STRONG BUY', ai_reason: 'AI chip demand accelerating. Target $1,000.', confidence: 91, rsi: 68, ma50: 840, ma200: 680, high_52w: 974, low_52w: 410 },
  { symbol: 'AAPL', name: 'Apple Inc', price: 210, change: 1.51, change_pct: 0.80, volume: '$3.2B', market_cap: '$2.9T', sector: 'Technology', status: 'active', logo_color: '#aaaaaa20', logo_letter: 'A', ai_signal: 'BUY', ai_reason: 'Services segment growing. iPhone cycle incoming.', confidence: 78, rsi: 54, ma50: 202, ma200: 176, high_52w: 220, low_52w: 165 },
  { symbol: 'MSFT', name: 'Microsoft', price: 380, change: 4.52, change_pct: 1.10, volume: '$2.8B', market_cap: '$3.1T', sector: 'Technology', status: 'active', logo_color: '#00a4ef20', logo_letter: 'M', ai_signal: 'STRONG BUY', ai_reason: 'Azure AI integration driving cloud growth.', confidence: 88, rsi: 62, ma50: 372, ma200: 335, high_52w: 430, low_52w: 310 },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 165, change: 2.14, change_pct: 1.23, volume: '$1.9B', market_cap: '$2.2T', sector: 'Technology', status: 'active', logo_color: '#4285f420', logo_letter: 'G', ai_signal: 'BUY', ai_reason: 'Search market dominant. YouTube growth strong.', confidence: 76, rsi: 57, ma50: 161, ma200: 152, high_52w: 191, low_52w: 121 },
  { symbol: 'META', name: 'Meta Platforms', price: 510, change: -3.20, change_pct: -0.65, volume: '$2.1B', market_cap: '$1.25T', sector: 'Technology', status: 'active', logo_color: '#0866ff20', logo_letter: 'M', ai_signal: 'BUY', ai_reason: 'Ad revenue recovery strong. Llama AI moat widening.', confidence: 72, rsi: 53, ma50: 490, ma200: 420, high_52w: 531, low_52w: 274 },
  { symbol: 'AVGO', name: 'Broadcom', price: 1450, change: 32.10, change_pct: 2.20, volume: '$980M', market_cap: '$695B', sector: 'Semiconductors', status: 'active', logo_color: '#cc000020', logo_letter: 'B', ai_signal: 'BUY', ai_reason: 'AI custom chip business booming.', confidence: 80, rsi: 65, ma50: 1420, ma200: 1240, high_52w: 1980, low_52w: 780 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 155, change: 4.80, change_pct: 2.93, volume: '$2.4B', market_cap: '$272B', sector: 'Semiconductors', status: 'active', logo_color: '#ed1c2420', logo_letter: 'A', ai_signal: 'BUY', ai_reason: 'MI300X gaining AI workload market share.', confidence: 77, rsi: 59, ma50: 152, ma200: 142, high_52w: 227, low_52w: 93 },
  { symbol: 'INTC', name: 'Intel Corp', price: 22, change: -0.42, change_pct: -1.30, volume: '$680M', market_cap: '$134B', sector: 'Semiconductors', status: 'hold', logo_color: '#0071c520', logo_letter: 'I', ai_signal: 'HOLD', ai_reason: 'Foundry transformation risky.', confidence: 40, rsi: 35, ma50: 24, ma200: 30, high_52w: 51, low_52w: 19 },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 240, change: -5.62, change_pct: -3.10, volume: '$5.8B', market_cap: '$756B', sector: 'Automotive', status: 'hold', logo_color: '#e3101420', logo_letter: 'T', ai_signal: 'HOLD', ai_reason: 'FSD progress a wildcard. Wait for update.', confidence: 50, rsi: 38, ma50: 235, ma200: 220, high_52w: 299, low_52w: 138 },
  { symbol: 'AMZN', name: 'Amazon', price: 185, change: 0.57, change_pct: 0.30, volume: '$1.7B', market_cap: '$1.98T', sector: 'E-Commerce', status: 'active', logo_color: '#ff990020', logo_letter: 'A', ai_signal: 'STRONG BUY', ai_reason: 'AWS re-accelerating. AI investments paying off.', confidence: 85, rsi: 60, ma50: 182, ma200: 168, high_52w: 201, low_52w: 118 },
  // Finance
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 230, change: 1.80, change_pct: 0.87, volume: '$1.2B', market_cap: '$600B', sector: 'Finance', status: 'active', logo_color: '#00000020', logo_letter: 'J', ai_signal: 'BUY', ai_reason: 'Strong net interest income.', confidence: 73, rsi: 56, ma50: 222, ma200: 188, high_52w: 241, low_52w: 135 },
  { symbol: 'GS', name: 'Goldman Sachs', price: 490, change: 5.60, change_pct: 1.22, volume: '$540M', market_cap: '$155B', sector: 'Finance', status: 'active', logo_color: '#6ab04c20', logo_letter: 'G', ai_signal: 'BUY', ai_reason: 'IB rebound in H2.', confidence: 69, rsi: 58, ma50: 478, ma200: 402, high_52w: 500, low_52w: 295 },
  { symbol: 'V', name: 'Visa Inc', price: 330, change: 2.10, change_pct: 0.77, volume: '$890M', market_cap: '$563B', sector: 'Finance', status: 'active', logo_color: '#1a1f7120', logo_letter: 'V', ai_signal: 'STRONG BUY', ai_reason: 'Consumer spending resilient.', confidence: 82, rsi: 60, ma50: 322, ma200: 248, high_52w: 340, low_52w: 218 },
  { symbol: 'BAC', name: 'Bank of America', price: 40, change: 0.42, change_pct: 1.11, volume: '$1.1B', market_cap: '$300B', sector: 'Finance', status: 'hold', logo_color: '#e3102020', logo_letter: 'B', ai_signal: 'HOLD', ai_reason: 'Rate sensitivity a risk.', confidence: 48, rsi: 45, ma50: 39, ma200: 33, high_52w: 42, low_52w: 24 },
  // Healthcare
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 155, change: -0.80, change_pct: -0.54, volume: '$420M', market_cap: '$355B', sector: 'Healthcare', status: 'hold', logo_color: '#cc000020', logo_letter: 'J', ai_signal: 'HOLD', ai_reason: 'Overhang remains.', confidence: 51, rsi: 44, ma50: 153, ma200: 158, high_52w: 175, low_52w: 143 },
  { symbol: 'LLY', name: 'Eli Lilly', price: 810, change: 18.20, change_pct: 2.35, volume: '$820M', market_cap: '$750B', sector: 'Healthcare', status: 'active', logo_color: '#cc000020', logo_letter: 'L', ai_signal: 'STRONG BUY', ai_reason: 'Obesity market dominance.', confidence: 92, rsi: 70, ma50: 790, ma200: 620, high_52w: 858, low_52w: 384 },
  { symbol: 'PFE', name: 'Pfizer Inc', price: 27, change: -0.30, change_pct: -1.07, volume: '$580M', market_cap: '$157B', sector: 'Healthcare', status: 'sell', logo_color: '#0093d020', logo_letter: 'P', ai_signal: 'SELL', ai_reason: 'Revenue cliff continues.', confidence: 65, rsi: 32, ma50: 28, ma200: 33, high_52w: 39, low_52w: 25 },
  // Consumer
  { symbol: 'SBUX', name: 'Starbucks', price: 82, change: -0.92, change_pct: -1.16, volume: '$340M', market_cap: '$89B', sector: 'Consumer', status: 'hold', logo_color: '#00704a20', logo_letter: 'S', ai_signal: 'HOLD', ai_reason: 'Traffic declining.', confidence: 44, rsi: 38, ma50: 84, ma200: 92, high_52w: 105, low_52w: 72 },
  { symbol: 'MCD', name: "McDonald's", price: 295, change: 1.40, change_pct: 0.50, volume: '$290M', market_cap: '$204B', sector: 'Consumer', status: 'active', logo_color: '#ffbc0d20', logo_letter: 'M', ai_signal: 'BUY', ai_reason: 'Value strategy winning.', confidence: 71, rsi: 54, ma50: 290, ma200: 268, high_52w: 312, low_52w: 248 },
  // Energy
  { symbol: 'XOM', name: 'ExxonMobil', price: 120, change: 0.92, change_pct: 0.78, volume: '$620M', market_cap: '$472B', sector: 'Energy', status: 'active', logo_color: '#cc000020', logo_letter: 'X', ai_signal: 'BUY', ai_reason: 'Strong free cash flow.', confidence: 74, rsi: 56, ma50: 118, ma200: 108, high_52w: 125, low_52w: 95 },
  { symbol: 'CVX', name: 'Chevron', price: 165, change: 1.20, change_pct: 0.76, volume: '$490M', market_cap: '$293B', sector: 'Energy', status: 'active', logo_color: '#00497920', logo_letter: 'C', ai_signal: 'BUY', ai_reason: 'Permian output growing.', confidence: 70, rsi: 54, ma50: 162, ma200: 149, high_52w: 175, low_52w: 138 },
  // ETFs / Index
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 530, change: 3.21, change_pct: 0.61, volume: '$18.4B', market_cap: '$495B', sector: 'ETF', status: 'active', logo_color: '#22d3a020', logo_letter: 'S', ai_signal: 'BUY', ai_reason: 'Market uptrend intact.', confidence: 76, rsi: 58, ma50: 520, ma200: 490, high_52w: 550, low_52w: 410 },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', price: 450, change: 4.80, change_pct: 1.09, volume: '$9.8B', market_cap: '$220B', sector: 'ETF', status: 'active', logo_color: '#60a5fa20', logo_letter: 'Q', ai_signal: 'STRONG BUY', ai_reason: 'Tech momentum strong.', confidence: 83, rsi: 64, ma50: 438, ma200: 398, high_52w: 470, low_52w: 328 },
];

export const TICKER_DATA = STOCKS_DATA.map(s => ({
  sym: s.symbol,
  val: s.price < 10 ? `$${s.price.toFixed(4)}` : s.price < 100 ? `$${s.price.toFixed(2)}` : `$${s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  chg: `${s.change_pct >= 0 ? '+' : ''}${s.change_pct.toFixed(2)}%`,
  up: s.change_pct >= 0,
}));

export function generateCandlestickData(symbol: string, days = 60) {
  const stock = STOCKS_DATA.find(s => s.symbol === symbol);
  const basePrice = stock?.price || 100;
  const data = [];
  let price = basePrice * 0.85;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const open = price;
    const change = (Math.random() - 0.48) * price * 0.03;
    const close = open + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    data.push({
      time: new Date(now - i * 86400000).toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.floor(Math.random() * 1000000 + 500000)
    });
    price = close;
  }
  return data;
}

import type { Stock } from '@/types';

export const STOCKS_METADATA: Omit<Stock, 'price' | 'change' | 'change_pct'>[] = [
  { symbol: 'BTC', name: 'Bitcoin', volume: '$32.1B', market_cap: '$1.26T', sector: 'Crypto', status: 'active', logo_color: '#f7931a20', logo_letter: '₿', ai_signal: 'STRONG BUY', ai_reason: 'RSI recovering from oversold. Accumulation phase ending. Target $88,500.', confidence: 87, rsi: 62, ma50: 81200, ma200: 72800, high_52w: 83800, low_52w: 38500 },
  { symbol: 'ETH', name: 'Ethereum', volume: '$14.8B', market_cap: '$214B', sector: 'Crypto', status: 'hold', logo_color: '#627eea20', logo_letter: 'Ξ', ai_signal: 'HOLD', ai_reason: 'Consolidating below resistance at $1,900. Wait for breakout confirmation.', confidence: 61, rsi: 48, ma50: 1780, ma200: 1640, high_52w: 4090, low_52w: 1220 },
  { symbol: 'SOL', name: 'Solana', volume: '$2.1B', market_cap: '$53B', sector: 'Crypto', status: 'active', logo_color: '#9945ff20', logo_letter: 'S', ai_signal: 'BUY', ai_reason: 'Strong on-chain activity. Moving average crossover bullish. Target $145.', confidence: 74, rsi: 55, ma50: 128, ma200: 108, high_52w: 204, low_52w: 58 },
  { symbol: 'BNB', name: 'BNB Chain', volume: '$1.4B', market_cap: '$85B', sector: 'Crypto', status: 'active', logo_color: '#f0b90b20', logo_letter: 'B', ai_signal: 'BUY', ai_reason: 'Ecosystem growth driving price. Support at $560 holding strong.', confidence: 70, rsi: 58, ma50: 568, ma200: 480, high_52w: 720, low_52w: 310 },
  { symbol: 'ADA', name: 'Cardano', volume: '$420M', market_cap: '$17B', sector: 'Crypto', status: 'hold', logo_color: '#0033ad20', logo_letter: 'A', ai_signal: 'HOLD', ai_reason: 'Weak momentum. Needs volume confirmation before entry.', confidence: 45, rsi: 42, ma50: 0.64, ma200: 0.52, high_52w: 0.82, low_52w: 0.25 },
  { symbol: 'XRP', name: 'Ripple', volume: '$1.2B', market_cap: '$128B', sector: 'Crypto', status: 'active', logo_color: '#00aae420', logo_letter: 'X', ai_signal: 'BUY', ai_reason: 'Legal clarity driving adoption. Target $2.50.', confidence: 68, rsi: 60, ma50: 1.90, ma200: 1.44, high_52w: 2.93, low_52w: 0.40 },
  { symbol: 'DOGE', name: 'Dogecoin', volume: '$1.8B', market_cap: '$23B', sector: 'Crypto', status: 'active', logo_color: '#c2a63320', logo_letter: 'D', ai_signal: 'HOLD', ai_reason: 'Meme-driven volatility. High risk.', confidence: 38, rsi: 70, ma50: 0.16, ma200: 0.12, high_52w: 0.229, low_52w: 0.065 },
  { symbol: 'NVDA', name: 'NVIDIA Corp', volume: '$8.4B', market_cap: '$2.2T', sector: 'Technology', status: 'active', logo_color: '#76b90020', logo_letter: 'N', ai_signal: 'STRONG BUY', ai_reason: 'AI chip demand accelerating. Target $1,000.', confidence: 91, rsi: 68, ma50: 840, ma200: 680, high_52w: 974, low_52w: 410 },
  { symbol: 'AAPL', name: 'Apple Inc', volume: '$3.2B', market_cap: '$2.9T', sector: 'Technology', status: 'active', logo_color: '#aaaaaa20', logo_letter: 'A', ai_signal: 'BUY', ai_reason: 'Services segment growing. iPhone cycle incoming.', confidence: 78, rsi: 54, ma50: 202, ma200: 176, high_52w: 220, low_52w: 165 },
  { symbol: 'MSFT', name: 'Microsoft', volume: '$2.8B', market_cap: '$3.1T', sector: 'Technology', status: 'active', logo_color: '#00a4ef20', logo_letter: 'M', ai_signal: 'STRONG BUY', ai_reason: 'Azure AI integration driving cloud growth.', confidence: 88, rsi: 62, ma50: 372, ma200: 335, high_52w: 430, low_52w: 310 },
  { symbol: 'GOOGL', name: 'Alphabet Inc', volume: '$1.9B', market_cap: '$2.2T', sector: 'Technology', status: 'active', logo_color: '#4285f420', logo_letter: 'G', ai_signal: 'BUY', ai_reason: 'Search market dominant. YouTube growth strong.', confidence: 76, rsi: 57, ma50: 161, ma200: 152, high_52w: 191, low_52w: 121 },
  { symbol: 'META', name: 'Meta Platforms', volume: '$2.1B', market_cap: '$1.25T', sector: 'Technology', status: 'active', logo_color: '#0866ff20', logo_letter: 'M', ai_signal: 'BUY', ai_reason: 'Ad revenue recovery strong. Llama AI moat widening.', confidence: 72, rsi: 53, ma50: 490, ma200: 420, high_52w: 531, low_52w: 274 },
  { symbol: 'AVGO', name: 'Broadcom', volume: '$980M', market_cap: '$695B', sector: 'Semiconductors', status: 'active', logo_color: '#cc000020', logo_letter: 'B', ai_signal: 'BUY', ai_reason: 'AI custom chip business booming.', confidence: 80, rsi: 65, ma50: 1420, ma200: 1240, high_52w: 1980, low_52w: 780 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', volume: '$2.4B', market_cap: '$272B', sector: 'Semiconductors', status: 'active', logo_color: '#ed1c2420', logo_letter: 'A', ai_signal: 'BUY', ai_reason: 'MI300X gaining AI workload market share.', confidence: 77, rsi: 59, ma50: 152, ma200: 142, high_52w: 227, low_52w: 93 },
  { symbol: 'TSLA', name: 'Tesla Inc', volume: '$5.8B', market_cap: '$756B', sector: 'Automotive', status: 'hold', logo_color: '#e3101420', logo_letter: 'T', ai_signal: 'HOLD', ai_reason: 'FSD progress a wildcard. Wait for update.', confidence: 50, rsi: 38, ma50: 235, ma200: 220, high_52w: 299, low_52w: 138 },
  { symbol: 'AMZN', name: 'Amazon', volume: '$1.7B', market_cap: '$1.98T', sector: 'E-Commerce', status: 'active', logo_color: '#ff990020', logo_letter: 'A', ai_signal: 'STRONG BUY', ai_reason: 'AWS re-accelerating. AI investments paying off.', confidence: 85, rsi: 60, ma50: 182, ma200: 168, high_52w: 201, low_52w: 118 },
  { symbol: 'JPM', name: 'JPMorgan Chase', volume: '$1.2B', market_cap: '$600B', sector: 'Finance', status: 'active', logo_color: '#00000020', logo_letter: 'J', ai_signal: 'BUY', ai_reason: 'Strong net interest income.', confidence: 73, rsi: 56, ma50: 222, ma200: 188, high_52w: 241, low_52w: 135 },
  { symbol: 'LLY', name: 'Eli Lilly', volume: '$820M', market_cap: '$750B', sector: 'Healthcare', status: 'active', logo_color: '#cc000020', logo_letter: 'L', ai_signal: 'STRONG BUY', ai_reason: 'Obesity market dominance.', confidence: 92, rsi: 70, ma50: 790, ma200: 620, high_52w: 858, low_52w: 384 },
  { symbol: 'PFE', name: 'Pfizer Inc', volume: '$580M', market_cap: '$157B', sector: 'Healthcare', status: 'sell', logo_color: '#0093d020', logo_letter: 'P', ai_signal: 'SELL', ai_reason: 'Revenue cliff continues.', confidence: 65, rsi: 32, ma50: 28, ma200: 33, high_52w: 39, low_52w: 25 },
  { symbol: 'XOM', name: 'ExxonMobil', volume: '$620M', market_cap: '$472B', sector: 'Energy', status: 'active', logo_color: '#cc000020', logo_letter: 'X', ai_signal: 'BUY', ai_reason: 'Strong free cash flow.', confidence: 74, rsi: 56, ma50: 118, ma200: 108, high_52w: 125, low_52w: 95 },
  { symbol: 'SPY', name: 'S&P 500 ETF', volume: '$18.4B', market_cap: '$495B', sector: 'ETF', status: 'active', logo_color: '#22d3a020', logo_letter: 'S', ai_signal: 'BUY', ai_reason: 'Market uptrend intact.', confidence: 76, rsi: 58, ma50: 520, ma200: 490, high_52w: 550, low_52w: 410 },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', volume: '$9.8B', market_cap: '$220B', sector: 'ETF', status: 'active', logo_color: '#60a5fa20', logo_letter: 'Q', ai_signal: 'STRONG BUY', ai_reason: 'Tech momentum strong.', confidence: 83, rsi: 64, ma50: 438, ma200: 398, high_52w: 470, low_52w: 328 },
];

const YAHOO_SYMBOLS: Record<string, string> = {
  BTC: 'BTC-USD', ETH: 'ETH-USD', SOL: 'SOL-USD', BNB: 'BNB-USD',
  ADA: 'ADA-USD', XRP: 'XRP-USD', DOGE: 'DOGE-USD',
  NVDA: 'NVDA', AAPL: 'AAPL', MSFT: 'MSFT', GOOGL: 'GOOGL',
  META: 'META', AVGO: 'AVGO', AMD: 'AMD', TSLA: 'TSLA', AMZN: 'AMZN',
  JPM: 'JPM', LLY: 'LLY', PFE: 'PFE', XOM: 'XOM', SPY: 'SPY', QQQ: 'QQQ',
};

const FALLBACK_PRICES: Record<string, number> = {
  BTC: 84000, ETH: 1800, SOL: 130, BNB: 590, ADA: 0.65, XRP: 2.10, DOGE: 0.17,
  NVDA: 875, AAPL: 210, MSFT: 380, GOOGL: 165, META: 510, AVGO: 1450, AMD: 155,
  TSLA: 240, AMZN: 185, JPM: 230, LLY: 810, PFE: 27, XOM: 120, SPY: 530, QQQ: 450,
};

let priceCache: Record<string, { price: number; change: number; change_pct: number }> = {};
let lastFetchTime = 0;
const CACHE_TTL = 10000;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stocksight-ai-v2-api.onrender.com';

export async function fetchLivePrices(): Promise<Record<string, { price: number; change: number; change_pct: number }>> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL && Object.keys(priceCache).length > 0) {
    return priceCache;
  }

  try {
    const res = await fetch(`${API_URL}/market/prices`, {
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json && typeof json === 'object' && !json.error) {
        // If the backend wraps it in data, use it, else use raw json
        const pricesData = json.data || json;
        const result: Record<string, { price: number; change: number; change_pct: number }> = {};
        for (const [sym, appKey] of Object.entries(YAHOO_SYMBOLS)) {
          // Check if it's indexed by our DB symbol (BTC) or Yahoo symbol (BTC-USD)
          const q = pricesData[appKey as string] || pricesData[sym];
          if (q) {
            result[sym] = {
              price: q.price ?? FALLBACK_PRICES[sym],
              change: q.change ?? 0,
              change_pct: q.change_pct ?? 0,
            };
          }
        }
        priceCache = result;
        lastFetchTime = now;
        return result;
      }
    }
  } catch (e) {
    console.warn('Backend price proxy failed, using fallback');
  }

  const fallback: Record<string, { price: number; change: number; change_pct: number }> = {};
  for (const sym of Object.keys(FALLBACK_PRICES)) {
    fallback[sym] = { price: FALLBACK_PRICES[sym], change: 0, change_pct: 0 };
  }
  return fallback;
}

export function buildStocksData(
  prices: Record<string, { price: number; change: number; change_pct: number }>
): Stock[] {
  return STOCKS_METADATA.map(meta => ({
    ...meta,
    price: prices[meta.symbol]?.price ?? FALLBACK_PRICES[meta.symbol] ?? 0,
    change: prices[meta.symbol]?.change ?? 0,
    change_pct: prices[meta.symbol]?.change_pct ?? 0,
  }));
}

// Static fallback export — used before live data loads
export const STOCKS_DATA: Stock[] = STOCKS_METADATA.map(meta => ({
  ...meta,
  price: FALLBACK_PRICES[meta.symbol] ?? 0,
  change: 0,
  change_pct: 0,
}));

export const TICKER_DATA = STOCKS_DATA.map(s => ({
  sym: s.symbol,
  val: s.price < 1 ? `$${s.price.toFixed(4)}` : s.price < 100 ? `$${s.price.toFixed(2)}` : `$${s.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  chg: `${s.change_pct >= 0 ? '+' : ''}${s.change_pct.toFixed(2)}%`,
  up: s.change_pct >= 0,
}));

export function generateCandlestickData(symbol: string, basePrice?: number, days = 60) {
  const price = basePrice ?? FALLBACK_PRICES[symbol] ?? 100;
  const data = [];
  let current = price * 0.85;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const open = current;
    const change = (Math.random() - 0.48) * current * 0.03;
    const close = open + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    data.push({
      time: new Date(now - i * 86400000).toISOString().split('T')[0],
      open: +open.toFixed(2), high: +high.toFixed(2),
      low: +low.toFixed(2), close: +close.toFixed(2),
      volume: Math.floor(Math.random() * 1000000 + 500000),
    });
    current = close;
  }
  return data;
}

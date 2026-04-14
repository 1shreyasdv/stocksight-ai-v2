'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CandlestickChart from '@/components/charts/CandlestickChart';
import { STOCKS_DATA, buildStocksData, fetchLivePrices } from '@/lib/stocksData';
import { getToken } from '@/lib/api';
import type { Stock } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stocksight-ai-v2-api.onrender.com';

export default function DashboardPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>(STOCKS_DATA);
  const [selectedStock, setSelectedStock] = useState<Stock>(STOCKS_DATA[0]);
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('');
  const [tradeType, setTradeType] = useState('Market Order');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(true);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load live prices on mount and every 60s
  useEffect(() => {
    const loadPrices = async () => {
      setPricesLoading(true);
      try {
        const prices = await fetchLivePrices();
        const liveStocks = buildStocksData(prices);
        setStocks(liveStocks);
        setSelectedStock(prev => liveStocks.find(s => s.symbol === prev.symbol) ?? prev);
      } finally {
        setPricesLoading(false);
      }
    };
    loadPrices();
    const interval = setInterval(loadPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoadingOrders(false); return; }
    try {
      const res = await fetch(`${API_URL}/orders/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (e) { console.error('fetchOrders:', e); }
    finally { setLoadingOrders(false); }
  }, []);

  const fetchPortfolio = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/portfolio`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolioValue(data.reduce((s: number, h: any) => s + (h.current_value || 0), 0));
      }
    } catch (e) { console.error('fetchPortfolio:', e); }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchPortfolio();
    const interval = setInterval(() => { fetchOrders(); fetchPortfolio(); }, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders, fetchPortfolio]);

  const handleSelectStock = (symbol: string) => {
    const found = stocks.find(s => s.symbol === symbol);
    if (found) setSelectedStock(found);
  };

  const price = selectedStock.price;
  const qty = parseFloat(amount) || 0;
  const total = qty * price;
  const fee = total * 0.001;
  const baseBalance = 10000;

  const handlePlaceOrder = async () => {
    const token = getToken();
    if (!token) { showToast('Please login to trade', 'error'); return; }
    const parsedQty = parseFloat(amount);
    if (!parsedQty || parsedQty <= 0) { showToast('Enter a valid quantity', 'error'); return; }
    try {
      const res = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          order_type: orderSide.toLowerCase(),
          quantity: parsedQty,
          price: price
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`${orderSide} order placed — ${parsedQty} ${selectedStock.symbol} @ $${price.toLocaleString()}`, 'success');
        setAmount('0.00');
        fetchOrders();
        fetchPortfolio();
      } else {
        const msg = typeof data.detail === 'string' ? data.detail
          : Array.isArray(data.detail) ? data.detail.map((e: any) => e.msg).join(', ')
          : 'Order failed';
        showToast(msg, 'error');
      }
    } catch { showToast('Network error. Is backend running?', 'error'); }
  };

  const signalColor = selectedStock.ai_signal?.includes('BUY') ? '#22d3a0' : selectedStock.ai_signal?.includes('SELL') ? '#f56565' : '#fbbf24';
  const signalBg = selectedStock.ai_signal?.includes('BUY') ? 'rgba(34,211,160,0.08)' : selectedStock.ai_signal?.includes('SELL') ? 'rgba(245,101,101,0.08)' : 'rgba(251,191,36,0.08)';

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? '#0d2b1e' : '#2b0d0d',
          border: `1px solid ${toast.type === 'success' ? '#10b98155' : '#ef444455'}`,
          color: toast.type === 'success' ? '#10b981' : '#ef4444',
          padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 10, minWidth: 280,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
        }}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {/* Live price indicator */}
      {pricesLoading && (
        <div className="flex items-center gap-2 text-xs text-[#555870]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
          Fetching live prices...
        </div>
      )}

      {/* Stat Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Portfolio Value', val: '$' + portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), chg: '-', up: null as null | boolean },
          { label: '24H Gain / Loss', val: '+$0.00', chg: 'LIVE', up: true },
          { label: 'Watchlist Alerts', val: orders.length + ' Orders', chg: 'Updated live', up: null },
        ].map((s) => (
          <div key={s.label} className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
            <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#555870] mb-3">{s.label}</div>
            <div className="text-2xl font-bold font-mono mb-1">{s.val}</div>
            {s.up === null
              ? <div className="text-xs text-[#555870]">{s.chg}</div>
              : s.up
              ? <div className="inline-flex items-center gap-1.5 bg-[rgba(34,211,160,0.1)] border border-[rgba(34,211,160,0.2)] rounded-full px-2 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22d3a0] blink" />
                  <span className="text-[10px] font-mono text-[#22d3a0] font-semibold">{s.chg}</span>
                </div>
              : <div className="text-xs font-mono text-[#f56565]">{s.chg}</div>
            }
            <div className="flex items-end gap-1 mt-3 h-7">
              {[40,55,45,65,50,80,60,75,55,70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm"
                  style={{ height: `${h}%`, background: i === 9 ? (s.up === false ? '#f56565' : '#7c6ff7') : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stock Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scroll">
        {stocks.map(s => (
          <button key={s.symbol} onClick={() => handleSelectStock(s.symbol)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all ${selectedStock.symbol === s.symbol ? 'border-[#7c6ff7] bg-[rgba(124,111,247,0.1)] text-[#a99ff5]' : 'border-[rgba(255,255,255,0.07)] text-[#8b8fa8] hover:border-[rgba(255,255,255,0.15)]'}`}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: s.logo_color, color: s.logo_color.replace('20', '') }}>
              {s.logo_letter}
            </div>
            {s.symbol}
            <span className={s.change_pct >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}>
              {s.change_pct >= 0 ? '+' : ''}{s.change_pct.toFixed(2)}%
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          <CandlestickChart symbol={selectedStock.symbol} basePrice={selectedStock.price} volatility={selectedStock.price * 0.012} />

          {/* Recent Activity */}
          <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold">Recent Portfolio Activity</div>
              <button onClick={() => router.push('/dashboard/history')} className="text-xs text-[#a99ff5] hover:underline">View Full History →</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-wider text-[#555870] border-b border-[rgba(255,255,255,0.05)]">
                  <th className="text-left pb-3">Asset</th>
                  <th className="text-left pb-3">Type</th>
                  <th className="text-left pb-3">Amount</th>
                  <th className="text-left pb-3">Price</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <tr><td colSpan={5} className="text-center py-8 text-[#666]">Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-[#666] text-[13px]">No trades yet. Place your first order above.</td></tr>
                ) : orders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #ffffff08' }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#ffffff15] flex items-center justify-center text-[11px] font-semibold">
                          {order.symbol?.slice(0, 1)}
                        </div>
                        {order.symbol}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span style={{
                        background: order.order_type === 'buy' ? '#10b98122' : '#ef444422',
                        color: order.order_type === 'buy' ? '#10b981' : '#ef4444',
                        padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600
                      }}>{order.order_type?.toUpperCase()}</span>
                    </td>
                    <td className="py-3 px-4 text-[13px]">{order.quantity} {order.symbol}</td>
                    <td className="py-3 px-4 text-[13px]">${Number(order.price).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span style={{ background: '#10b98122', color: '#10b981', padding: '3px 10px', borderRadius: 4, fontSize: 11 }}>
                        {(order.status || 'COMPLETED').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Panel */}
        <div className="space-y-4">
          <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Place Order</span>
                <span className="text-xs font-mono text-[#555870]">{selectedStock.symbol}/USD</span>
              </div>
              <span className="text-lg font-bold font-mono">
                ${price < 10 ? price.toFixed(4) : price < 1000 ? price.toFixed(2) : price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`text-xs font-mono mb-5 ${selectedStock.change_pct >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
              {selectedStock.change_pct >= 0 ? '+' : ''}{selectedStock.change_pct.toFixed(2)}% today
            </div>

            <div className="flex bg-[#181b22] rounded-lg p-1 mb-5">
              {(['BUY', 'SELL'] as const).map(t => (
                <button key={t} onClick={() => setOrderSide(t)}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${orderSide === t ? (t === 'BUY' ? 'bg-[#22d3a0] text-black' : 'bg-[#f56565] text-white') : 'text-[#555870]'}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#555870] mb-2">Price (USD)</div>
                <div className="flex gap-2">
                  <input type="text" readOnly
                    value={price < 10 ? price.toFixed(4) : price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    className="flex-1 bg-[#181b22] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2.5 text-sm font-mono outline-none" />
                  <div className="bg-[#181b22] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2.5 text-xs text-[#555870] font-mono">MARKET</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#555870] mb-2">Amount ({selectedStock.symbol})</div>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                  className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:border-[#7c6ff7] transition-colors" />
                <div className="flex gap-1.5 mt-2">
                  {[0.25, 0.50, 0.75, 1.00].map((pct, i) => (
                    <button key={i} onClick={() => setAmount(String((baseBalance * pct / (price || 1)).toFixed(6)))}
                      className="flex-1 py-1.5 bg-[#181b22] border border-[rgba(255,255,255,0.07)] rounded-md text-xs font-mono text-[#8b8fa8] hover:border-[#7c6ff7] hover:text-[#a99ff5] transition-all">
                      {pct * 100}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#555870] mb-2">Trade Type</div>
                <select value={tradeType} onChange={e => setTradeType(e.target.value)}
                  className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2.5 text-sm font-mono outline-none cursor-pointer">
                  {['Market Order', 'Limit Order', 'Stop Loss'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="space-y-1 pt-1 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#555870]">Total (USD)</span>
                  <span className="font-mono">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#555870]">Fee (0.1%)</span>
                  <span className="font-mono">${fee.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handlePlaceOrder}
                className="w-full py-3 rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: orderSide === 'BUY' ? 'linear-gradient(135deg,#22d3a0,#059669)' : 'linear-gradient(135deg,#f56565,#dc2626)' }}>
                ⚡ PLACE {orderSide} ORDER
              </button>
            </div>
          </div>

          {/* AI Signal */}
          <div className="rounded-xl p-4 border" style={{ background: signalBg, borderColor: signalColor + '40' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full blink" style={{ background: signalColor }} />
              <span className="text-xs font-bold font-mono tracking-wider" style={{ color: signalColor }}>
                AI SIGNAL: {selectedStock.ai_signal}
              </span>
            </div>
            <p className="text-xs text-[#8b8fa8] leading-relaxed">{selectedStock.ai_reason}</p>
            {selectedStock.confidence && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#555870]">Confidence</span>
                  <span className="font-mono" style={{ color: signalColor }}>{selectedStock.confidence}%</span>
                </div>
                <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)]">
                  <div className="h-full rounded-full" style={{ width: `${selectedStock.confidence}%`, background: signalColor }} />
                </div>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-4">
            <div className="text-xs font-semibold text-[#555870] mb-3 tracking-wider">METRICS</div>
            <div className="space-y-2">
              {[
                ['RSI (14)', selectedStock.rsi ?? '—'],
                ['MA 50', selectedStock.ma50 ? `$${selectedStock.ma50.toLocaleString()}` : '—'],
                ['MA 200', selectedStock.ma200 ? `$${selectedStock.ma200.toLocaleString()}` : '—'],
                ['52W High', selectedStock.high_52w ? `$${selectedStock.high_52w.toLocaleString()}` : '—'],
                ['52W Low', selectedStock.low_52w ? `$${selectedStock.low_52w.toLocaleString()}` : '—'],
                ['Volume', selectedStock.volume],
                ['Market Cap', selectedStock.market_cap],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-xs">
                  <span className="text-[#555870]">{k}</span>
                  <span className="font-mono">{v as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

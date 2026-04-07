'use client';
import { useState } from 'react';
import { STOCKS_DATA } from '@/lib/stocksData';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<string[]>(['BTC', 'AAPL', 'NVDA', 'ETH']);

  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const watchlistStocks = STOCKS_DATA.filter((s) => watchlist.includes(s.symbol));
  const otherStocks = STOCKS_DATA.filter((s) => !watchlist.includes(s.symbol));

  const renderTable = (stocks: typeof STOCKS_DATA, isWatchlist: boolean) => (
    <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.07)]">
            {['Asset', 'Price', '24H Change', 'Volume', 'AI Signal', 'Action'].map((h) => (
              <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#555870] font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => {
            const signalColor = s.ai_signal?.includes('BUY') ? '#22d3a0' : s.ai_signal?.includes('SELL') ? '#f56565' : '#fbbf24';
            const signalBg = s.ai_signal?.includes('BUY') ? 'rgba(34,211,160,0.1)' : s.ai_signal?.includes('SELL') ? 'rgba(245,101,101,0.1)' : 'rgba(251,191,36,0.1)';

            return (
              <tr key={s.symbol} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: s.logo_color, color: s.logo_color.replace('20', '') }}>
                      {s.logo_letter}
                    </div>
                    <div>
                      <div className="font-medium text-xs">{s.name}</div>
                      <div className="text-[10px] text-[#555870] font-mono">{s.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs">${s.price < 10 ? s.price.toFixed(4) : s.price.toLocaleString()}</td>
                <td className={`px-5 py-4 font-mono text-xs font-semibold ${s.change_pct >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
                  {s.change_pct >= 0 ? '+' : ''}{s.change_pct.toFixed(2)}%
                </td>
                <td className="px-5 py-4 text-xs text-[#8b8fa8]">{s.volume}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase" style={{ background: signalBg, color: signalColor }}>
                    {s.ai_signal}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleWatchlist(s.symbol)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      isWatchlist
                        ? 'bg-[rgba(245,101,101,0.05)] text-[#f56565] border border-[rgba(245,101,101,0.2)] hover:bg-[rgba(245,101,101,0.1)]'
                        : 'bg-[#7c6ff7] text-white hover:bg-[#6a5ced]'
                    }`}
                  >
                    {isWatchlist ? 'Remove' : 'Add to List'}
                  </button>
                </td>
              </tr>
            );
          })}
          {stocks.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-[#555870] text-xs">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">My Watchlist</h1>
        <p className="text-xs text-[#555870] mt-1">Track your favorite assets and AI signals</p>
        {renderTable(watchlistStocks, true)}
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8b8fa8] pl-1">Discover Markets</h2>
        {renderTable(otherStocks, false)}
      </div>
    </div>
  );
}

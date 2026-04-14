'use client';
import { useEffect, useState } from 'react';
import { STOCKS_DATA, buildStocksData, fetchLivePrices } from '@/lib/stocksData';
import type { Stock } from '@/types';

export default function AdminMarketPage() {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Hold' | 'Sell'>('All');
  const [stocks, setStocks] = useState<Stock[]>(STOCKS_DATA);

  useEffect(() => {
    fetchLivePrices().then(prices => setStocks(buildStocksData(prices)));
    const interval = setInterval(() => {
      fetchLivePrices().then(prices => setStocks(buildStocksData(prices)));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = stocks.filter(s => filter === 'All' || s.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Market Overview</h1>
          <p className="text-xs text-[#555870] mt-1">Live prices updated every 60 seconds</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22d3a0] animate-pulse" />
          <span className="text-[10px] font-mono text-[#22d3a0]">LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#111318] p-2 rounded-lg border border-[rgba(255,255,255,0.07)] w-max">
        {(['All', 'Active', 'Hold', 'Sell'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${filter === f ? 'bg-[rgba(255,255,255,0.1)] text-white' : 'text-[#8b8fa8] hover:bg-[rgba(255,255,255,0.05)]'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {['Asset','Ticker','Price','24H Change','Volume','Market Cap','Status','Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-[#555870] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.symbol} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: s.logo_color, color: s.logo_color.replace('20','') }}>{s.logo_letter}</div>
                    <span className="font-medium text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#8b8fa8]">{s.symbol}</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold">${s.price < 1 ? s.price.toFixed(4) : s.price < 100 ? s.price.toFixed(2) : s.price.toLocaleString()}</td>
                <td className={`px-4 py-3 font-mono text-xs font-semibold ${s.change_pct >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
                  {s.change_pct >= 0 ? '+' : ''}{s.change_pct.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-xs text-[#8b8fa8]">{s.volume}</td>
                <td className="px-4 py-3 text-xs text-[#8b8fa8]">{s.market_cap}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.status === 'active' ? 'bg-[rgba(34,211,160,0.1)] text-[#22d3a0]' : s.status === 'hold' ? 'bg-[rgba(96,165,250,0.1)] text-[#60a5fa]' : 'bg-[rgba(245,101,101,0.1)] text-[#f56565]'}`}>
                    {s.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="px-2.5 py-1 bg-[#181b22] border border-[rgba(255,255,255,0.07)] rounded-md text-xs text-[#8b8fa8] hover:border-[rgba(255,255,255,0.2)] transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

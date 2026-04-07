'use client';
import { useEffect, useState } from 'react';
import { TICKER_DATA } from '@/lib/stocksData';
import api from '@/lib/api';

export default function TickerBar() {
  const [tickerData, setTickerData] = useState(TICKER_DATA);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await api.get('/stocks/');
        if (res.data && Array.isArray(res.data)) {
          const formatted = res.data.map((s: any) => ({
            sym: s.symbol,
            val: `$${s.price.toFixed(2)}`,
            chg: `${s.change_pct >= 0 ? '+' : ''}${s.change_pct.toFixed(2)}%`,
            up: s.change_pct >= 0,
          }));
          setTickerData(formatted);
        }
      } catch (e) {
        // Silently fallback to TICKER_DATA
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...tickerData, ...tickerData];
  
  return (
    <div className="overflow-hidden whitespace-nowrap border-b border-[rgba(255,255,255,0.07)] bg-[#111318] py-2">
      <div className="ticker-animate inline-flex gap-8">
        {doubled.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs font-mono">
            <span className="text-[#555870]">{t.sym}</span>
            <span className="font-medium">{t.val}</span>
            <span className={t.up ? 'text-[#22d3a0]' : 'text-[#f56565]'}>{t.chg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

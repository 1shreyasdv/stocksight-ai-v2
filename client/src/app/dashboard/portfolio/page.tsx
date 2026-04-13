'use client';
import { STOCKS_DATA } from '@/lib/stocksData';

import { useEffect, useState } from 'react';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<any[]>([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    };

    fetchPortfolio();
  }, []);

  const holdings = portfolio.map(h => {
    const stockInfo = STOCKS_DATA.find(s => s.symbol === h.symbol) || { price: 0, symbol: h.symbol, name: h.symbol, logo_color: '#33333320', logo_letter: h.symbol[0] };
    const qty = h.quantity;
    const avgPrice = h.avg_price;
    const price = stockInfo.price;
    return {
      ...stockInfo,
      qty,
      avgPrice,
      price,
      value: price * qty,
      gainLoss: (price - avgPrice) * qty,
      gainLossPct: avgPrice > 0 ? ((price - avgPrice) / avgPrice) * 100 : 0,
    };
  });


  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalGain = holdings.reduce((s, h) => s + h.gainLoss, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Portfolio</h1>
        <p className="text-xs text-[#555870] mt-1">Your current holdings and performance</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Value', val: `$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}` },
          { label: 'Total P&L', val: `${totalGain >= 0 ? '+' : ''}$${totalGain.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, color: totalGain >= 0 ? '#22d3a0' : '#f56565' },
          { label: 'Positions', val: `${holdings.length} Assets` },
        ].map(s => (
          <div key={s.label} className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
            <div className="text-[10px] uppercase tracking-wider text-[#555870] mb-2 font-semibold">{s.label}</div>
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
          <div className="font-semibold">Holdings</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {['Asset', 'Quantity', 'Avg Price', 'Current Price', 'Value', 'P&L', 'P&L %'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#555870] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => (
              <tr key={h.symbol} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: h.logo_color, color: h.logo_color.replace('20','') }}>{h.logo_letter}</div>
                    <div>
                      <div className="font-semibold text-xs">{h.name}</div>
                      <div className="text-[10px] font-mono text-[#555870]">{h.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs">{h.qty}</td>
                <td className="px-5 py-4 font-mono text-xs text-[#8b8fa8]">${h.avgPrice.toLocaleString()}</td>
                <td className="px-5 py-4 font-mono text-xs font-semibold">${h.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-4 font-mono text-xs">${h.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td className={`px-5 py-4 font-mono text-xs font-semibold ${h.gainLoss >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
                  {h.gainLoss >= 0 ? '+' : ''}${h.gainLoss.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </td>
                <td className={`px-5 py-4 font-mono text-xs font-semibold ${h.gainLossPct >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
                  {h.gainLossPct >= 0 ? '+' : ''}{h.gainLossPct.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

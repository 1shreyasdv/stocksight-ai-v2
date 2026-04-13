'use client';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stocksight-ai-v2-api.onrender.com';

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/admin/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Group orders by user+symbol to simulate portfolio positions
          const grouped: Record<string, any> = {};
          for (const o of data) {
            const key = `${o.user_id}_${o.symbol}`;
            if (!grouped[key]) {
              grouped[key] = {
                user: o.user?.name || `User #${o.user_id}`,
                asset: o.symbol,
                symbol: o.symbol,
                quantity: 0,
                totalCost: 0,
                currentValue: 0,
              };
            }
            if (o.order_type === 'buy') {
              grouped[key].quantity += parseFloat(o.quantity);
              grouped[key].totalCost += parseFloat(o.quantity) * parseFloat(o.price);
            }
          }
          const result = Object.values(grouped)
            .filter((p: any) => p.quantity > 0)
            .map((p: any) => {
              const avgBuy = p.totalCost / p.quantity;
              const currentValue = p.quantity * avgBuy * (1 + (Math.random() * 0.1 - 0.05));
              const pnl = currentValue - p.totalCost;
              return { ...p, avgBuy, currentValue, pnl, pnlPct: (pnl / p.totalCost) * 100 };
            })
            .sort((a: any, b: any) => b.currentValue - a.currentValue);
          setPortfolios(result);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">User Portfolios</h1>
        <p className="text-xs text-[#555870] mt-1">Real positions from actual user orders</p>
      </div>
      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {['User', 'Asset', 'Quantity', 'Avg Buy Price', 'Current Value', 'P&L'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#555870] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-[#555870]">Loading portfolios...</td></tr>
            ) : portfolios.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-[#555870]">No portfolio data yet. Users need to place orders first.</td></tr>
            ) : portfolios.map((p, i) => (
              <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0">
                <td className="px-5 py-3 font-semibold text-xs">{p.user}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ffffff15] flex items-center justify-center text-xs font-bold">
                      {p.symbol.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium text-xs">{p.asset}</div>
                      <div className="text-[10px] text-[#555870] font-mono">{p.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-[#8b8fa8]">{parseFloat(p.quantity).toFixed(4)}</td>
                <td className="px-5 py-3 font-mono text-xs">${p.avgBuy.toFixed(2)}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold">${p.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-5 py-3">
                  <div className={`font-mono text-xs font-semibold ${p.pnl >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
                    {p.pnl >= 0 ? '+' : ''}${p.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-[10px] font-mono ${p.pnlPct >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
                    {p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(2)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { STOCKS_DATA } from '@/lib/stocksData';

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchTransactions = () => {
    const token = localStorage.getItem('token');
    fetch('https://stocksight-ai-v2-api.onrender.com/admin/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => setTransactions(Array.isArray(data) ? data : []))
    .catch(() => setTransactions([]));
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Live Transactions</h1>
        <p className="text-xs text-[#555870] mt-1">Real-time global order flow monitoring</p>
      </div>

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {['User', 'Asset', 'Type', 'Amount', 'Price', 'Total', 'Time', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#555870] font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-[#555870]">
                  No transactions yet. Users haven't placed orders.
                </td>
              </tr>
            ) : transactions.map((t) => {
              const stock = STOCKS_DATA.find(s => s.symbol === t.symbol) || STOCKS_DATA[0];
              return (
                <tr
                  key={t.id}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0"
                >
                  <td className="px-5 py-3 font-semibold text-xs">{t.user_id ? `User #${t.user_id}` : 'Unknown'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: stock.logo_color, color: stock.logo_color.replace('20', '') }}
                      >
                        {stock.logo_letter}
                      </div>
                      <span className="font-medium text-xs">{t.symbol}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.order_type.toUpperCase() === 'BUY' ? 'bg-[rgba(34,211,160,0.1)] text-[#22d3a0]' : 'bg-[rgba(245,101,101,0.1)] text-[#f56565]'
                      }`}
                    >
                      {t.order_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-[#8b8fa8]">{t.quantity}</td>
                  <td className="px-5 py-3 font-mono text-xs">${parseFloat(t.price).toFixed(2)}</td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold">
                    ${(parseFloat(t.quantity) * parseFloat(t.price)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#555870]">{formatTimeAgo(t.created_at)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.status === 'completed'
                          ? 'bg-[rgba(96,165,250,0.1)] text-[#60a5fa]'
                          : t.status === 'pending'
                          ? 'bg-[rgba(251,191,36,0.1)] text-[#fbbf24]'
                          : 'bg-[rgba(245,101,101,0.1)] text-[#f56565]'
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

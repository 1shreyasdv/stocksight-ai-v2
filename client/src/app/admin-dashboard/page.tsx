'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { STOCKS_DATA, buildStocksData, fetchLivePrices } from '@/lib/stocksData';
import { getToken } from '@/lib/api';
import type { Stock } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stocksight-ai-v2-api.onrender.com';

export default function AdminDashPage() {
  const [buyOrders, setBuyOrders] = useState<any[]>([]);
  const [sellOrders, setSellOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_revenue: 0, total_users: 0, active_traders: 0, total_orders: 0 });
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [liveStocks, setLiveStocks] = useState<Stock[]>(STOCKS_DATA);

  const token = () => getToken();

  const fetchStats = async () => {
    const t = token(); if (!t) return;
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } });
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const fetchCharts = async () => {
    const t = token(); if (!t) return;
    try {
      const [g, v] = await Promise.all([
        fetch(`${API_URL}/admin/chart/user-growth`, { headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } }),
        fetch(`${API_URL}/admin/chart/trading-volume`, { headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } }),
      ]);
      if (g.ok) {
        const data = await g.json();
        setUserGrowthData(data.map((d: any) => ({ month: d.label, users: d.value })));
      }
      if (v.ok) {
        const data = await v.json();
        setVolumeData(data.map((d: any) => ({ day: d.label, buy: d.buy, sell: d.sell })));
      }
    } catch {}
  };

  const fetchLiveOrders = async () => {
    const t = token(); if (!t) return;
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } });
      if (!res.ok) return;
      const data = await res.json();
      setBuyOrders(data.filter((o: any) => o.order_type === 'buy').slice(0, 10));
      setSellOrders(data.filter((o: any) => o.order_type === 'sell').slice(0, 10));
    } catch {}
  };

  useEffect(() => {
    fetchStats();
    fetchCharts();
    fetchLiveOrders();
    fetchLivePrices().then(prices => setLiveStocks(buildStocksData(prices)));
    const i1 = setInterval(fetchStats, 30000);
    const i2 = setInterval(fetchLiveOrders, 8000);
    const i3 = setInterval(fetchCharts, 60000);
    const i4 = setInterval(() => fetchLivePrices().then(p => setLiveStocks(buildStocksData(p))), 60000);
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); clearInterval(i4); };
  }, []);

  const OrderTable = ({ orders, type }: { orders: any[], type: 'buy' | 'sell' }) => (
    <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl flex flex-col h-[420px]">
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between sticky top-0 bg-[#111318] z-10 rounded-t-xl">
        <div className={`font-semibold ${type === 'buy' ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
          Active {type === 'buy' ? 'Buy' : 'Sell'} Orders
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${type === 'buy' ? 'bg-[rgba(34,211,160,0.1)] text-[#22d3a0]' : 'bg-[rgba(245,101,101,0.1)] text-[#f56565]'}`}>
          <div className={`w-1.5 h-1.5 rounded-full blink ${type === 'buy' ? 'bg-[#22d3a0]' : 'bg-[#f56565]'}`} />
          Live
        </div>
      </div>
      <div className="overflow-y-auto custom-scroll flex-1 p-2">
        <table className="w-full text-sm">
          <thead>
            <tr>{['User','Asset','Amount','Price','Time','Status'].map(h => (
              <th key={h} className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-[#555870] font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-[#555870] text-[13px]">
                Waiting for users to place {type} orders...
              </td></tr>
            ) : orders.map((o, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ffffff08' }}>
                <td className="px-3 py-2.5 text-[13px]">{o.user?.name || `User #${o.user_id}`}</td>
                <td className="px-3 py-2.5 text-[13px] font-semibold">{o.symbol}</td>
                <td className="px-3 py-2.5 text-[13px]">{o.quantity}</td>
                <td className={`px-3 py-2.5 text-[13px] ${type === 'buy' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  ${Number(o.price).toLocaleString()}
                </td>
                <td className="px-3 py-2.5 text-[11px] text-[#888]">{new Date(o.created_at).toLocaleTimeString()}</td>
                <td className="px-3 py-2.5">
                  <span className="bg-[#10b98122] text-[#10b981] px-2 py-0.5 rounded text-[11px]">
                    {(o.status || 'COMPLETED').toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', val: '$' + stats.total_revenue.toLocaleString('en-US', { maximumFractionDigits: 0 }), chg: 'Real data', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.2)' },
          { label: 'Total Users', val: stats.total_users.toLocaleString(), chg: 'Registered', color: '#a855f7', borderColor: 'rgba(168,85,247,0.2)' },
          { label: 'Active Traders', val: stats.active_traders.toLocaleString(), chg: 'Has orders', color: '#22d3a0', borderColor: 'rgba(34,211,160,0.2)' },
        ].map(s => (
          <div key={s.label} className="bg-[#111318] rounded-xl p-5 border" style={{ borderColor: s.borderColor }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: s.color + '99' }}>{s.label}</div>
            <div className="text-3xl font-bold font-mono mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs font-mono font-semibold text-[#22d3a0]">↑ {s.chg}</div>
            <div className="flex items-end gap-1 mt-4 h-8">
              {[30,45,40,60,50,80,65,75,55,70,60,90].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 11 ? s.color : s.color + '25' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts — Real Data */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
          <div className="font-semibold mb-1">User Growth</div>
          <div className="text-xs text-[#555870] mb-4">
            {userGrowthData.length === 0 ? 'Loading real data...' : 'Real signups from database'}
          </div>
          {userGrowthData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-[#555870] text-sm">No signup data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  formatter={(v: any) => [Number(v).toLocaleString(), 'Users']} />
                <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#userGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="font-semibold">Trading Volume</div>
            <div className="text-sm font-mono font-semibold text-[#22d3a0]">Real orders</div>
          </div>
          <div className="text-xs text-[#555870] mb-4">Last 7 days from database</div>
          {volumeData.length === 0 ? (
            <div className="h-[160px] flex items-center justify-center text-[#555870] text-sm">No order data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={volumeData} barSize={12} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#555870', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 12 }}
                  formatter={(v: any, name: string) => [Number(v).toLocaleString() + ' orders', name === 'buy' ? 'Buy' : 'Sell']} />
                <Bar dataKey="buy" fill="#10b981" radius={[2,2,0,0]} />
                <Bar dataKey="sell" fill="#ef4444" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-[#555870]"><div className="w-2 h-2 rounded-sm bg-[#22d3a0]" />Buy Orders</div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#555870]"><div className="w-2 h-2 rounded-sm bg-[#f56565]" />Sell Orders</div>
          </div>
        </div>
      </div>

      {/* Live Orders */}
      <div className="grid grid-cols-2 gap-4">
        <OrderTable orders={buyOrders} type="buy" />
        <OrderTable orders={sellOrders} type="sell" />
      </div>

      {/* Live Market Table */}
      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
          <div>
            <div className="font-semibold">Live Market Data</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22d3a0] blink" />
              <span className="text-[10px] font-mono text-[#22d3a0]">LIVE PRICES</span>
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {['Asset','Ticker','Price','24H Change','Volume','Market Cap','Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-[#555870] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {liveStocks.slice(0, 10).map(s => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

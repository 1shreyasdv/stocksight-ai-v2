'use client';
import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { STOCKS_DATA } from '@/lib/stocksData';

const userGrowthData = [
  { month: 'Jan', users: 8200 },
  { month: 'Feb', users: 12400 },
  { month: 'Mar', users: 11800 },
  { month: 'Apr', users: 15600 },
  { month: 'May', users: 18900 },
  { month: 'Jun', users: 24300 },
  { month: 'Jul', users: 31200 },
  { month: 'Aug', users: 38700 },
  { month: 'Sep', users: 47100 },
  { month: 'Oct', users: 58400 },
  { month: 'Nov', users: 98200 },
  { month: 'Dec', users: 128402 },
];

const volumeData = [
  { day: 'MON', buy: 842000, sell: 623000 },
  { day: 'TUE', buy: 912000, sell: 589000 },
  { day: 'WED', buy: 785000, sell: 842000 },
  { day: 'THU', buy: 1120000, sell: 745000 },
  { day: 'FRI', buy: 984000, sell: 1120000 },
  { day: 'SAT', buy: 542000, sell: 421000 },
  { day: 'SUN', buy: 489000, sell: 398000 },
];

export default function AdminDashPage() {
  const [buyOrders, setBuyOrders] = useState<any[]>([]);
  const [sellOrders, setSellOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_users: 0,
    active_traders: 0,
    total_orders: 0
  });

  const token = () => localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/stats', {
        headers: { 'Authorization': `Bearer ${token()}` }
      });
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const fetchLiveOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/orders', {
        headers: { 'Authorization': `Bearer ${token()}` }
      });
      if (!res.ok) return;
      const data = await res.json();

      setBuyOrders(
        data.filter((o: any) =>
          o.order_type === 'buy' &&
          o.user?.role !== 'admin'
        ).slice(0, 10)
      );
      setSellOrders(
        data.filter((o: any) =>
          o.order_type === 'sell' &&
          o.user?.role !== 'admin'
        ).slice(0, 10)
      );
    } catch (e) {
      console.error('Failed to fetch live orders', e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLiveOrders();
    const i1 = setInterval(fetchStats, 30000);
    const i2 = setInterval(fetchLiveOrders, 8000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, []);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', val: '$' + stats.total_revenue.toLocaleString('en-US', { maximumFractionDigits: 0 }), chg: 'Real data', up: true, color: '#60a5fa', borderColor: 'rgba(96,165,250,0.2)' },
          { label: 'Total Users', val: stats.total_users.toLocaleString(), chg: 'Registered', up: true, color: '#a855f7', borderColor: 'rgba(168,85,247,0.2)' },
          { label: 'Active Traders', val: stats.active_traders.toLocaleString(), chg: 'Has orders', up: true, color: '#22d3a0', borderColor: 'rgba(34,211,160,0.2)' },
        ].map(s => (
          <div key={s.label} className="bg-[#111318] rounded-xl p-5 border" style={{ borderColor: s.borderColor }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: s.color + '99' }}>{s.label}</div>
            <div className="text-3xl font-bold font-mono mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className={`text-xs font-mono font-semibold ${s.up ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>{s.up ? '↑' : '↓'} {s.chg}</div>
            <div className="flex items-end gap-1 mt-4 h-8">
              {[30,45,40,60,50,80,65,75,55,70,60,90].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 11 ? s.color : s.color + '25' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold">User Growth</div>
              <div className="text-xs text-[#555870] mt-0.5">12 month trajectory</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} 
                axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #6366f1',
                  borderRadius: 8, color: '#fff', fontSize: 12 }}
                formatter={(v: any) => [Number(v).toLocaleString(), 'Users']}
              />
              <Area type="monotone" dataKey="users" stroke="#6366f1" 
                strokeWidth={2} fill="url(#userGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold">Trading Volume</div>
              <div className="text-xs text-[#555870] mt-0.5">Daily liquidity pulse</div>
            </div>
            <div className="text-sm font-mono font-semibold text-[#22d3a0]">$842.1M <span className="text-[#555870] text-xs">avg</span></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={volumeData} barSize={12} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#555870', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12
                }}
                formatter={(value: any, name: string) => [
                  '$' + Number(value).toLocaleString(),
                  name === 'buy' ? 'Buy Volume' : 'Sell Volume'
                ]}
              />
              <Bar dataKey="buy" fill="#10b981" radius={[2,2,0,0]} />
              <Bar dataKey="sell" fill="#ef4444" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-[#555870]"><div className="w-2 h-2 rounded-sm bg-[#22d3a0]" />Buy Volume</div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#555870]"><div className="w-2 h-2 rounded-sm bg-[#f56565]" />Sell Volume</div>
          </div>
        </div>
      </div>

      {/* Live Order Flow */}
      <div className="grid grid-cols-2 gap-4">
        {/* Buy Orders */}
        <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl flex flex-col h-[420px]">
          <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between sticky top-0 bg-[#111318] z-10 rounded-t-xl">
            <div>
              <div className="font-semibold text-[#22d3a0]">Active Buy Orders</div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[rgba(34,211,160,0.1)] rounded text-[10px] font-bold text-[#22d3a0] tracking-wider uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22d3a0] blink" />
              Live
            </div>
          </div>
          <div className="overflow-y-auto custom-scroll flex-1 p-2">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['User', 'Asset', 'Amount', 'Price', 'Time', 'Status'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-[#555870] font-semibold sticky top-0 bg-[#111318]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buyOrders.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: 13 }}>
                    Waiting for users to place buy orders...
                  </td></tr>
                ) : buyOrders.map((o: any, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ffffff08' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>
                      {o.user?.name || 'User #' + o.user_id}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500 }}>
                      {o.symbol}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>
                      {o.quantity}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 13, color: '#10b981' }}>
                      ${Number(o.price).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#888' }}>
                      {new Date(o.created_at).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{
                        background: '#10b98122', color: '#10b981',
                        padding: '2px 8px', borderRadius: 4, fontSize: 11
                      }}>
                        {(o.status || 'COMPLETED').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sell Orders */}
        <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl flex flex-col h-[420px]">
          <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between sticky top-0 bg-[#111318] z-10 rounded-t-xl">
            <div>
              <div className="font-semibold text-[#f56565]">Active Sell Orders</div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[rgba(245,101,101,0.1)] rounded text-[10px] font-bold text-[#f56565] tracking-wider uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f56565] blink" />
              Live
            </div>
          </div>
          <div className="overflow-y-auto custom-scroll flex-1 p-2">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['User', 'Asset', 'Amount', 'Price', 'Time', 'Status'].map(h => (
                    <th key={h} className="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-[#555870] font-semibold sticky top-0 bg-[#111318]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sellOrders.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: 13 }}>
                    Waiting for users to place sell orders...
                  </td></tr>
                ) : sellOrders.map((o: any, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ffffff08' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>
                      {o.user?.name || 'User #' + o.user_id}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500 }}>
                      {o.symbol}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>
                      {o.quantity}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 13, color: '#ef4444' }}>
                      ${Number(o.price).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#888' }}>
                      {new Date(o.created_at).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{
                        background: '#10b98122', color: '#10b981',
                        padding: '2px 8px', borderRadius: 4, fontSize: 11
                      }}>
                        {(o.status || 'COMPLETED').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Market Table */}
      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
          <div>
            <div className="font-semibold">Live Market Data</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22d3a0] blink" />
              <span className="text-[10px] font-mono text-[#22d3a0]">ENGINE ACTIVE</span>
            </div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {['Asset', 'Ticker', 'Price', '24H Change', 'Volume', 'Market Cap', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-[#555870] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STOCKS_DATA.slice(0, 10).map(s => (
              <tr key={s.symbol} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: s.logo_color, color: s.logo_color.replace('20','') }}>{s.logo_letter}</div>
                    <span className="font-medium text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#8b8fa8]">{s.symbol}</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold">${s.price < 10 ? s.price.toFixed(4) : s.price.toLocaleString()}</td>
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

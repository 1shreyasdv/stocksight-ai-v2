'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STOCKS_DATA } from '@/lib/stocksData';

const SECTORS = ['All', 'Crypto', 'Technology', 'Finance', 'Healthcare', 'Consumer', 'Energy', 'ETF', 'Semiconductors', 'Automotive', 'E-Commerce'];

export default function MarketPage() {
  const router = useRouter();
  const [sector, setSector] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'market_cap', dir: 'desc' });

  const filtered = STOCKS_DATA.filter(s =>
    (sector === 'All' || s.sector === sector) &&
    (s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => {
    const mul = sort.dir === 'asc' ? 1 : -1;
    if (sort.key === 'price') return (a.price - b.price) * mul;
    if (sort.key === 'change_pct') return (a.change_pct - b.change_pct) * mul;
    if (sort.key === 'name') return a.name.localeCompare(b.name) * mul;
    return 0;
  });

  const toggleSort = (key: string) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  };

  const signalColor = (sig?: string) => sig?.includes('STRONG BUY') ? '#22d3a0' : sig?.includes('BUY') ? '#4ade80' : sig?.includes('SELL') ? '#f56565' : '#fbbf24';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Live Market</h1>
          <p className="text-xs text-[#555870] mt-1">Real-time data · {STOCKS_DATA.length} instruments tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22d3a0] blink" />
          <span className="text-xs font-mono text-[#22d3a0]">ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets…"
          className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c6ff7] transition-colors w-52" />
        <div className="flex gap-1 flex-wrap">
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${sector === s ? 'bg-[#7c6ff7] text-white' : 'bg-[#111318] border border-[rgba(255,255,255,0.07)] text-[#8b8fa8] hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {[
                { label: '#', key: '' }, { label: 'Asset', key: 'name' }, { label: 'Sector', key: '' },
                { label: 'Price', key: 'price' }, { label: '24H Change', key: 'change_pct' },
                { label: 'Volume', key: '' }, { label: 'Market Cap', key: '' },
                { label: 'AI Signal', key: '' }, { label: 'Confidence', key: '' }, { label: 'Action', key: '' },
              ].map(({ label, key }) => (
                <th key={label} onClick={() => key && toggleSort(key)}
                  className={`text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#555870] ${key ? 'cursor-pointer hover:text-[#8b8fa8]' : ''}`}>
                  {label} {key && sort.key === key ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.symbol} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0">
                <td className="px-4 py-3 text-xs font-mono text-[#555870]">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: s.logo_color, color: s.logo_color.replace('20', '') }}>{s.logo_letter}</div>
                    <div>
                      <div className="font-semibold text-xs">{s.name}</div>
                      <div className="text-[10px] font-mono text-[#555870]">{s.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[#8b8fa8]">{s.sector}</span></td>
                <td className="px-4 py-3 font-mono font-semibold text-xs">
                  {s.price < 10 ? `$${s.price.toFixed(4)}` : s.price < 100 ? `$${s.price.toFixed(2)}` : `$${s.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </td>
                <td className={`px-4 py-3 font-mono text-xs font-semibold ${s.change_pct >= 0 ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
                  {s.change_pct >= 0 ? '+' : ''}{s.change_pct.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-xs text-[#8b8fa8]">{s.volume}</td>
                <td className="px-4 py-3 text-xs text-[#8b8fa8]">{s.market_cap}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded" style={{ color: signalColor(s.ai_signal), background: signalColor(s.ai_signal) + '18' }}>
                    {s.ai_signal || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.confidence && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 rounded-full bg-[rgba(255,255,255,0.06)]">
                        <div className="h-full rounded-full" style={{ width: `${s.confidence}%`, background: signalColor(s.ai_signal) }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#555870]">{s.confidence}%</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => router.push('/dashboard')}
                    className="px-3 py-1.5 bg-[#181b22] border border-[rgba(255,255,255,0.07)] rounded-lg text-xs text-[#8b8fa8] hover:border-[#7c6ff7] hover:text-[#a99ff5] transition-all">
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

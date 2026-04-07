'use client';
import { STOCKS_DATA } from '@/lib/stocksData';

const HOLDINGS = [
  { ...STOCKS_DATA.find(s => s.symbol === 'BTC')!, qty: 0.85, avgPrice: 58200 },
  { ...STOCKS_DATA.find(s => s.symbol === 'ETH')!, qty: 4.2, avgPrice: 3100 },
  { ...STOCKS_DATA.find(s => s.symbol === 'NVDA')!, qty: 15, avgPrice: 780 },
  { ...STOCKS_DATA.find(s => s.symbol === 'AAPL')!, qty: 50, avgPrice: 175 },
  { ...STOCKS_DATA.find(s => s.symbol === 'MSFT')!, qty: 20, avgPrice: 390 },
  { ...STOCKS_DATA.find(s => s.symbol === 'SPY')!, qty: 10, avgPrice: 490 },
];

export default function PortfolioPage() {
  const holdings = HOLDINGS.map(h => ({
    ...h,
    value: h.price * h.qty,
    gainLoss: (h.price - h.avgPrice) * h.qty,
    gainLossPct: ((h.price - h.avgPrice) / h.avgPrice) * 100,
  }));

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

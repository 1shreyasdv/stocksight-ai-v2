'use client';
import { STOCKS_DATA } from '@/lib/stocksData';

export default function AIInsightsPage() {
  const buySignals = STOCKS_DATA.filter((s) => s.ai_signal?.includes('BUY'));
  const sellSignals = STOCKS_DATA.filter((s) => s.ai_signal?.includes('SELL') || s.ai_signal?.includes('HOLD')); // Including hold for variety if not enough sells

  const renderCard = (s: any, isBuy: boolean) => {
    const color = isBuy ? '#22d3a0' : '#f56565';
    const bg = isBuy ? 'rgba(34,211,160,0.05)' : 'rgba(245,101,101,0.05)';

    return (
      <div key={s.symbol} className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 mb-4 hover:border-[rgba(255,255,255,0.15)] transition-colors">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: s.logo_color, color: s.logo_color.replace('20', '') }}
            >
              {s.logo_letter}
            </div>
            <div>
              <div className="font-semibold text-sm">{s.name}</div>
              <div className="text-[10px] text-[#555870] font-mono">{s.symbol}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm">${s.price.toFixed(2)}</div>
            <div className={`text-[10px] font-mono font-semibold ${color}`}>{s.change_pct >= 0 ? '+' : ''}{s.change_pct}%</div>
          </div>
        </div>

        <div className="rounded-lg p-3 border" style={{ background: bg, borderColor: color + '40' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full blink" style={{ background: color }} />
            <span className="text-[10px] font-bold font-mono tracking-wider" style={{ color }}>
              {s.ai_signal}
            </span>
          </div>
          <p className="text-xs text-[#8b8fa8] leading-relaxed mb-3">{s.ai_reason}</p>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#555870] uppercase">Confidence Meter</span>
              <span className="font-mono" style={{ color }}>{s.confidence}%</span>
            </div>
            <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.confidence}%`, background: color }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">AI Trading Signals</h1>
        <p className="text-xs text-[#555870] mt-1">Deep-learning generated market positioning recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-[#22d3a0] shadow-[0_0_8px_#22d3a0]" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#22d3a0]">Buy Signals</h2>
          </div>
          <div className="space-y-4">
            {buySignals.map((s) => renderCard(s, true))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-[#f56565] shadow-[0_0_8px_#f56565]" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#f56565]">Sell & Hold Signals</h2>
          </div>
          <div className="space-y-4">
            {sellSignals.map((s) => renderCard(s, false))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';

import { generateCandlestickData } from '@/lib/stocksData';

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  time?: string;
  volume?: number;
}

interface CandlestickChartProps {
  symbol: string;
  basePrice: number;
  volatility: number;
  timeframe?: string;
}

const TIMEFRAMES = ['1H', '4H', '1D', '1W'];
const VIEWS = ['Area', 'Candlestick'];

export default function CandlestickChart({ symbol, basePrice, volatility, timeframe = '1D' }: CandlestickChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeTime, setActiveTime] = useState(timeframe);
  const [activeView, setActiveView] = useState('Candlestick');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [hovered, setHovered] = useState<{ candle: Candle; x: number; y: number } | null>(null);

  useEffect(() => {
    const count = activeTime === '1H' ? 30 : activeTime === '4H' ? 36 : activeTime === '1D' ? 40 : 52;
    setCandles(generateCandlestickData(symbol, count));
  }, [activeTime, symbol]);

  const renderChart = () => {
    if (!candles.length) return null;
    const W = 760;
    const H = 240;
    const PAD = { top: 12, bottom: 24, left: 8, right: 8 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const minP = Math.min(...allPrices);
    const maxP = Math.max(...allPrices);
    const range = maxP - minP || 1;

    const scaleY = (v: number) => PAD.top + chartH * (1 - (v - minP) / range);
    const cw = Math.max(4, chartW / candles.length - 2);

    return (
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(pct => (
          <line
            key={pct}
            x1={PAD.left} y1={PAD.top + chartH * pct}
            x2={W - PAD.right} y2={PAD.top + chartH * pct}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"
          />
        ))}

        {activeView === 'Area' ? (
          <g>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c6ff7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7c6ff7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const pts = candles.map((c, i) => {
                const x = PAD.left + (i + 0.5) * (chartW / candles.length);
                const y = scaleY(c.close);
                return `${x},${y}`;
              });
              const first = pts[0].split(',');
              const last = pts[pts.length - 1].split(',');
              const polyPts = `${pts.join(' ')} ${last[0]},${PAD.top + chartH} ${first[0]},${PAD.top + chartH}`;
              return (
                <>
                  <polygon points={polyPts} fill="url(#areaGrad)" />
                  <polyline points={pts.join(' ')} fill="none" stroke="#7c6ff7" strokeWidth="2" />
                </>
              );
            })()}
          </g>
        ) : (
          <g>
            {candles.map((c, i) => {
              const x = PAD.left + i * (chartW / candles.length) + cw / 2;
              const isUp = c.close >= c.open;
              const color = isUp ? '#22d3a0' : '#f56565';
              const bodyTop = scaleY(Math.max(c.open, c.close));
              const bodyBot = scaleY(Math.min(c.open, c.close));
              const bodyH = Math.max(1, bodyBot - bodyTop);
              return (
                <g
                  key={i}
                  onMouseEnter={(e) => {
                    const rect = svgRef.current?.getBoundingClientRect();
                    if (rect) setHovered({ candle: c, x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                >
                  <line x1={x} y1={scaleY(c.high)} x2={x} y2={scaleY(c.low)} stroke={color} strokeWidth="1" opacity={0.6} />
                  <rect x={x - cw / 2} y={bodyTop} width={cw} height={bodyH} fill={color} rx={1} opacity={0.9} />
                </g>
              );
            })}
          </g>
        )}

        {/* Price labels */}
        {[0, 0.5, 1].map(pct => {
          const price = minP + range * (1 - pct);
          return (
            <text key={pct} x={W - PAD.right} y={PAD.top + chartH * pct + 4} fill="#555870" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
              ${price.toFixed(price > 100 ? 0 : 2)}
            </text>
          );
        })}

        {/* Tooltip */}
        {hovered && (
          <g>
            <rect x={Math.min(hovered.x + 8, W - 130)} y={hovered.y - 50} width={120} height={56} rx={4} fill="#1e2229" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <text x={Math.min(hovered.x + 14, W - 124)} y={hovered.y - 32} fill="#8b8fa8" fontSize="9" fontFamily="JetBrains Mono">O: ${hovered.candle.open.toFixed(2)}</text>
            <text x={Math.min(hovered.x + 14, W - 124)} y={hovered.y - 20} fill="#22d3a0" fontSize="9" fontFamily="JetBrains Mono">H: ${hovered.candle.high.toFixed(2)}</text>
            <text x={Math.min(hovered.x + 14, W - 124)} y={hovered.y - 8} fill="#f56565" fontSize="9" fontFamily="JetBrains Mono">L: ${hovered.candle.low.toFixed(2)}</text>
            <text x={Math.min(hovered.x + 14, W - 124)} y={hovered.y + 4} fill="#e8eaf0" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">C: ${hovered.candle.close.toFixed(2)}</text>
          </g>
        )}
      </svg>
    );
  };

  const lastCandle = candles[candles.length - 1];
  const isUp = lastCandle ? lastCandle.close >= lastCandle.open : true;

  return (
    <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.07)] flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(124,111,247,0.15)] border border-[rgba(124,111,247,0.3)] flex items-center justify-center text-xs font-bold text-[#a99ff5]">
            {symbol[0]}
          </div>
          <div>
            <div className="text-base font-bold">{symbol} / USD</div>
            <div className="text-xs text-[#555870]">Perpetual</div>
          </div>
        </div>

        <div className="flex gap-1 ml-2">
          {VIEWS.map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-3 py-1 rounded-md text-xs transition-all ${activeView === v ? 'bg-[#181b22] text-[#e8eaf0]' : 'text-[#555870] hover:text-[#8b8fa8]'}`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {TIMEFRAMES.map(t => (
            <button
              key={t}
              onClick={() => setActiveTime(t)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all border ${activeTime === t ? 'bg-[#7c6ff7] text-white border-[#7c6ff7]' : 'text-[#555870] border-transparent hover:text-[#8b8fa8]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <div className={`text-xl font-bold font-mono ${isUp ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
            ${lastCandle ? lastCandle.close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : basePrice.toFixed(2)}
          </div>
          <div className={`text-xs font-mono ${isUp ? 'text-[#22d3a0]' : 'text-[#f56565]'}`}>
            {isUp ? '+' : ''}{lastCandle ? ((lastCandle.close - lastCandle.open) / lastCandle.open * 100).toFixed(2) : '0.00'}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 py-3 h-[264px]">
        {renderChart()}
      </div>
    </div>
  );
}

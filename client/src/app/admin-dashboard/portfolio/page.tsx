'use client';
import { STOCKS_DATA } from '@/lib/stocksData';

// Generate mock portfolio data
const generateMockPortfolios = () => {
  const users = ['Alex Rivera', 'Sarah Chen', 'Marcus Williams', 'James O\'Brien'];
  const portfolios = [];
  for (let i = 0; i < 15; i++) {
    const stock = STOCKS_DATA[Math.floor(Math.random() * STOCKS_DATA.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const qty = Math.random() * (stock.price < 100 ? 500 : 5) + 1;
    const avgBuyPrice = stock.price * (1 + (Math.random() * 0.4 - 0.2));
    const currentValue = qty * stock.price;
    const costBasis = qty * avgBuyPrice;
    const pnl = currentValue - costBasis;
    const pnlPct = (pnl / costBasis) * 100;

    portfolios.push({
      id: i,
      user,
      asset: stock.name,
      symbol: stock.symbol,
      logo_color: stock.logo_color,
      logo_letter: stock.logo_letter,
      quantity: qty.toFixed(stock.price < 100 ? 0 : 4),
      avgBuyPrice,
      currentValue,
      pnl,
      pnlPct,
    });
  }
  return portfolios.sort((a, b) => b.currentValue - a.currentValue);
};

const MOCK_PORTFOLIOS = generateMockPortfolios();

export default function AdminPortfolioPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">User Portfolios</h1>
        <p className="text-xs text-[#555870] mt-1">Cross-platform portfolio balances and positions</p>
      </div>

      <div className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.07)]">
              {['User', 'Asset', 'Quantity', 'Avg Buy Price', 'Current Value', 'P&L'].map((h) => (
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
            {MOCK_PORTFOLIOS.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#181b22] transition-colors last:border-0"
              >
                <td className="px-5 py-3 font-semibold text-xs">{p.user}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: p.logo_color, color: p.logo_color.replace('20', '') }}
                    >
                      {p.logo_letter}
                    </div>
                    <div>
                      <div className="font-medium text-xs">{p.asset}</div>
                      <div className="text-[10px] text-[#555870] font-mono">{p.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-[#8b8fa8]">{p.quantity}</td>
                <td className="px-5 py-3 font-mono text-xs">${p.avgBuyPrice.toFixed(2)}</td>
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

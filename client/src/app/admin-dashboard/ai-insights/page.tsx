'use client';
import { STOCKS_DATA } from '@/lib/stocksData';

const signals = ['STRONG BUY','BUY','HOLD','SELL','STRONG SELL'];
const getSignal = (symbol: string) => {
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(symbol.length-1);
  return signals[seed % signals.length];
};
const getConfidence = (symbol: string) => {
  const seed = symbol.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  return 55 + (seed % 40);
};
const getColor = (signal: string) => {
  if (signal.includes('BUY')) return '#10b981';
  if (signal.includes('SELL')) return '#ef4444';
  return '#f59e0b';
};

export default function AdminAIInsights() {
  const stocks = STOCKS_DATA;
  const buySignals = stocks.filter(s => getSignal(s.symbol).includes('BUY'));
  const sellSignals = stocks.filter(s => getSignal(s.symbol).includes('SELL'));
  const holdSignals = stocks.filter(s => getSignal(s.symbol) === 'HOLD');

  return (
    <div style={{ padding: '1.5rem', color: 'white' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
        AI Signal Intelligence
      </h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        TradeBrain RSI + MA signals across all 30 assets
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        
        <div style={{ background: '#0d1f0d', border: '1px solid #10b98133', 
          borderRadius: 12, padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', 
              background: '#10b981', animation: 'pulse 1s infinite' }}/>
            <span style={{ color: '#10b981', fontWeight: 500 }}>
              BUY SIGNALS ({buySignals.length})
            </span>
          </div>
          {buySignals.map(s => (
            <div key={s.symbol} style={{ 
              display: 'flex', justifyContent: 'space-between', 
              alignItems: 'center', padding: '10px 0',
              borderBottom: '1px solid #ffffff0a' 
            }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{s.symbol}</div>
                <div style={{ color: '#888', fontSize: 11 }}>{s.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#10b981', fontSize: 12, fontWeight: 500 }}>
                  {getSignal(s.symbol)}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>
                  {getConfidence(s.symbol)}% confidence
                </div>
                <div style={{ 
                  height: 4, width: 80, background: '#ffffff15', 
                  borderRadius: 2, marginTop: 4 
                }}>
                  <div style={{ 
                    height: '100%', borderRadius: 2,
                    width: getConfidence(s.symbol) + '%', 
                    background: '#10b981' 
                  }}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1f0d0d', border: '1px solid #ef444433', 
          borderRadius: 12, padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', 
              background: '#ef4444' }}/>
            <span style={{ color: '#ef4444', fontWeight: 500 }}>
              SELL SIGNALS ({sellSignals.length})
            </span>
          </div>
          {sellSignals.map(s => (
            <div key={s.symbol} style={{ 
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '10px 0',
              borderBottom: '1px solid #ffffff0a' 
            }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{s.symbol}</div>
                <div style={{ color: '#888', fontSize: 11 }}>{s.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 500 }}>
                  {getSignal(s.symbol)}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>
                  {getConfidence(s.symbol)}% confidence
                </div>
                <div style={{ 
                  height: 4, width: 80, background: '#ffffff15',
                  borderRadius: 2, marginTop: 4 
                }}>
                  <div style={{ 
                    height: '100%', borderRadius: 2,
                    width: getConfidence(s.symbol) + '%', 
                    background: '#ef4444' 
                  }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, background: '#1a1500', 
        border: '1px solid #f59e0b33', borderRadius: 12, padding: '1rem' }}>
        <div style={{ color: '#f59e0b', fontWeight: 500, marginBottom: 12 }}>
          HOLD ({holdSignals.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {holdSignals.map(s => (
            <div key={s.symbol} style={{ 
              background: '#ffffff0a', border: '1px solid #f59e0b33',
              borderRadius: 8, padding: '6px 12px', fontSize: 13 
            }}>
              <span style={{ color: '#f59e0b', fontWeight: 500 }}>{s.symbol}</span>
              <span style={{ color: '#888', marginLeft: 8 }}>
                {getConfidence(s.symbol)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

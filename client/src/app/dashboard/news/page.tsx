'use client';

const NEWS = [
  { ticker: 'BTC', sentiment: 'BULLISH',
    headline: 'Bitcoin Surges Past $84K as Institutional Demand Spikes',
    source: 'CoinDesk', time: '12 min ago',
    url: 'https://www.coindesk.com/price/bitcoin/' },
  { ticker: 'NVDA', sentiment: 'BULLISH',
    headline: 'NVIDIA Reports Record AI Chip Revenue Shares Up 5%',
    source: 'Bloomberg', time: '45 min ago',
    url: 'https://www.bloomberg.com/quote/NVDA:US' },
  { ticker: 'SPY', sentiment: 'BULLISH',
    headline: 'Fed Signals Potential Rate Cut in Next Meeting',
    source: 'Reuters', time: '1h ago',
    url: 'https://www.reuters.com/markets/us/' },
  { ticker: 'ETH', sentiment: 'BULLISH',
    headline: 'Ethereum Layer 2 Activity Hits All-Time High',
    source: 'The Block', time: '1.5h ago',
    url: 'https://www.theblock.co/prices/crypto' },
  { ticker: 'TSLA', sentiment: 'BEARISH',
    headline: 'Tesla Deliveries Miss Estimates for Q2',
    source: 'WSJ', time: '2h ago',
    url: 'https://www.wsj.com/market-data/quotes/TSLA' },
  { ticker: 'MSFT', sentiment: 'BULLISH',
    headline: 'Microsoft Azure AI Revenue Grows 29% YoY',
    source: 'CNBC', time: '3h ago',
    url: 'https://www.cnbc.com/quotes/MSFT' },
  { ticker: 'AAPL', sentiment: 'NEUTRAL',
    headline: 'Apple Vision Pro Sales Below Internal Targets',
    source: 'Bloomberg', time: '4h ago',
    url: 'https://www.bloomberg.com/quote/AAPL:US' },
  { ticker: 'XRP', sentiment: 'BULLISH',
    headline: 'Ripple Wins Key Legal Battle XRP Rallies 15%',
    source: 'CoinDesk', time: '5h ago',
    url: 'https://www.coindesk.com/price/xrp/' },
  { ticker: 'META', sentiment: 'BULLISH',
    headline: 'Meta AI Assistant Reaches 1 Billion Users',
    source: 'CNBC', time: '6h ago',
    url: 'https://www.cnbc.com/quotes/META' },
  { ticker: 'GOOGL', sentiment: 'BULLISH',
    headline: 'Google Search Ad Revenue Beats Q2 Expectations',
    source: 'Reuters', time: '7h ago',
    url: 'https://www.reuters.com/companies/GOOGL.O' },
  { ticker: 'AMZN', sentiment: 'BULLISH',
    headline: 'Amazon AWS Growth Accelerates to 28%',
    source: 'Bloomberg', time: '8h ago',
    url: 'https://www.bloomberg.com/quote/AMZN:US' },
  { ticker: 'DOGE', sentiment: 'BEARISH',
    headline: 'Dogecoin Drops 8% as Meme Coin Hype Fades',
    source: 'CoinDesk', time: '9h ago',
    url: 'https://www.coindesk.com/price/dogecoin/' },
];

const sentimentColor = (s: string) =>
  s === 'BULLISH' ? '#10b981' : s === 'BEARISH' ? '#ef4444' : '#f59e0b';

export default function NewsPage() {
  return (
    <div style={{ padding: '1.5rem', color: 'white' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Market News</h1>
        <p style={{ color: '#666', fontSize: 13 }}>
          Live financial news and sentiment analysis. Click any card to read full article.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {NEWS.map((item, i) => (
          <div
            key={i}
            onClick={() => window.open(item.url, '_blank')}
            style={{
              background: '#0d0d1a',
              border: '1px solid #ffffff10',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#ffffff30';
              e.currentTarget.style.background = '#12122a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#ffffff10';
              e.currentTarget.style.background = '#0d0d1a';
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={{
                background: '#ffffff15', color: '#fff',
                padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
              }}>{item.ticker}</span>
              <span style={{
                background: sentimentColor(item.sentiment) + '22',
                color: sentimentColor(item.sentiment),
                padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
              }}>{item.sentiment}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10, lineHeight: 1.5, color: 'white' }}>
              {item.headline}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#666' }}>
              <span style={{ fontWeight: 500 }}>{item.source}</span>
              <span>·</span>
              <span>{item.time}</span>
              <span style={{ marginLeft: 'auto', color: '#6366f1', fontSize: 12 }}>Read more →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

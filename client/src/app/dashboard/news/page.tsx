'use client';
import { useEffect, useState } from 'react';

const GNEWS_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stocksight-ai-v2-api.onrender.com';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  image?: string;
}

// Tag articles with relevant ticker based on keywords
function getTag(title: string): { symbol: string; sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' } {
  const t = title.toLowerCase();
  const symbol =
    t.includes('bitcoin') || t.includes('btc') ? 'BTC' :
    t.includes('ethereum') || t.includes('eth') ? 'ETH' :
    t.includes('nvidia') || t.includes('nvda') ? 'NVDA' :
    t.includes('apple') || t.includes('aapl') ? 'AAPL' :
    t.includes('tesla') || t.includes('tsla') ? 'TSLA' :
    t.includes('microsoft') || t.includes('msft') ? 'MSFT' :
    t.includes('amazon') || t.includes('amzn') ? 'AMZN' :
    t.includes('meta') || t.includes('facebook') ? 'META' :
    t.includes('google') || t.includes('alphabet') ? 'GOOGL' :
    t.includes('fed') || t.includes('federal reserve') || t.includes('rate') ? 'SPY' :
    t.includes('crypto') || t.includes('blockchain') ? 'BTC' :
    t.includes('oil') || t.includes('energy') ? 'XOM' :
    t.includes('solana') || t.includes('sol') ? 'SOL' :
    'MARKET';

  const bullishWords = ['surge', 'rally', 'gain', 'bull', 'record', 'high', 'beat', 'strong', 'growth', 'rise', 'up', 'profit', 'boom'];
  const bearishWords = ['drop', 'fall', 'crash', 'bear', 'loss', 'weak', 'miss', 'down', 'decline', 'cut', 'sell', 'risk', 'concern'];
  const bullScore = bullishWords.filter(w => t.includes(w)).length;
  const bearScore = bearishWords.filter(w => t.includes(w)).length;
  const sentiment = bullScore > bearScore ? 'BULLISH' : bearScore > bullScore ? 'BEARISH' : 'NEUTRAL';

  return { symbol, sentiment };
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/market/news`);
        if (!res.ok) throw new Error(`News fetch failed: ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error('News API returned no data');
        setNews(json.articles ?? []);
      } catch (e: any) {
        setError(e.message || 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    // Refresh every 10 minutes
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, []);

  const tagged = news.map(n => ({ ...n, tag: getTag(n.title) }));
  const filtered = filter === 'ALL' ? tagged : tagged.filter(n => n.tag.sentiment === filter);

  const sentimentColor = (s: string) =>
    s === 'BULLISH' ? { bg: '#10b98120', text: '#10b981', border: '#10b98140' } :
    s === 'BEARISH' ? { bg: '#ef444420', text: '#ef4444', border: '#ef444440' } :
    { bg: '#6b728020', text: '#9ca3af', border: '#6b728040' };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Market News</h1>
        <p className="text-[#555870] text-sm">
          Live financial news with sentiment analysis.
          <span className="ml-2 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22d3a0] inline-block animate-pulse" />
            <span className="text-[#22d3a0] text-xs font-mono">LIVE</span>
          </span>
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'BULLISH', 'BEARISH'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? f === 'BULLISH' ? 'bg-[#10b981] text-black border-[#10b981]'
                  : f === 'BEARISH' ? 'bg-[#ef4444] text-white border-[#ef4444]'
                  : 'bg-[#7c6ff7] text-white border-[#7c6ff7]'
                : 'border-[rgba(255,255,255,0.1)] text-[#8b8fa8] hover:border-[rgba(255,255,255,0.3)]'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-[#ffffff10] rounded w-1/4 mb-3" />
              <div className="h-4 bg-[#ffffff10] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#ffffff08] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-xl p-4 text-[#ef4444] text-sm">
          ⚠ {error} — Showing cached data if available.
        </div>
      )}

      {/* News Cards */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-[#555870]">No {filter !== 'ALL' ? filter.toLowerCase() : ''} news found.</div>
      )}

      <div className="space-y-3">
        {filtered.map((article, i) => {
          const colors = sentimentColor(article.tag.sentiment);
          return (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
              className="block bg-[#111318] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.15)] transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded border"
                      style={{ background: '#ffffff10', color: '#a99ff5', borderColor: '#7c6ff740' }}>
                      {article.tag.symbol}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border"
                      style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
                      {article.tag.sentiment}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-sm leading-snug mb-1 group-hover:text-[#a99ff5] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Description */}
                  {article.description && (
                    <p className="text-[12px] text-[#555870] line-clamp-2 mb-2">{article.description}</p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[11px] text-[#444]">
                    <span className="font-medium text-[#666]">{article.source.name}</span>
                    <span>·</span>
                    <span>{timeAgo(article.publishedAt)}</span>
                    <span className="ml-auto text-[#a99ff5] opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      Read more →
                    </span>
                  </div>
                </div>

                {/* Thumbnail */}
                {article.image && (
                  <img src={article.image} referrerPolicy="no-referrer" alt="" className="w-20 h-16 object-cover rounded-lg flex-shrink-0 opacity-80" />
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

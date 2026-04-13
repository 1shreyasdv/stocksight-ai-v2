'use client';

import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
};

const sentimentFromTitle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('surge') || t.includes('rise') || t.includes('record') || t.includes('growth')) return 'BULLISH';
  if (t.includes('drop') || t.includes('fall') || t.includes('miss') || t.includes('decline')) return 'BEARISH';
  return 'NEUTRAL';
};

const sentimentColor = (s: string) =>
  s === 'BULLISH' ? '#10b981' : s === 'BEARISH' ? '#ef4444' : '#f59e0b';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;

  const fetchNews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/news`);

      if (res.status === 429) {
        console.warn("Rate limit hit");
        return;
      }

      const data = await res.json();
      setNews(data.articles || []);
    } catch (err) {
      console.error('News fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div style={{ padding: '1.5rem', color: 'white' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500 }}>Market News</h1>
        <p style={{ color: '#666', fontSize: 13 }}>
          Live financial news (real-time).
        </p>
      </div>

      {loading ? (
        <div>Loading news...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {news.map((item, i) => {
            const sentiment = sentimentFromTitle(item.title);

            return (
              <div
                key={i}
                onClick={() => window.open(item.url, '_blank')}
                style={{
                  background: '#0d0d1a',
                  border: '1px solid #ffffff10',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span
                    style={{
                      background: sentimentColor(sentiment) + '22',
                      color: sentimentColor(sentiment),
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {sentiment}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    fontSize: 12,
                    color: '#666',
                  }}
                >
                  <span>{item.source.name}</span>
                  <span>·</span>
                  <span>
                    {new Date(item.publishedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('http://localhost:8000/orders/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => { setOrders([]); setLoading(false); });
  }, [router]);

  return (
    <div style={{ padding: '1.5rem', color: 'white' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
          Order History
        </h1>
        <p style={{ color: '#666', fontSize: 13 }}>
          Complete log of all your trades
        </p>
      </div>
      <div style={{
        background: '#0d0d1a',
        border: '1px solid #ffffff15',
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ffffff15' }}>
              {['Date', 'Asset', 'Type', 'Quantity', 'Price', 'Total', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: 11, color: '#888', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                Loading your orders...
              </td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#666', fontSize: 13 }}>
                No trades yet. Go place your first order!
              </td></tr>
            ) : orders.map((o: any) => (
              <tr key={o.id}
                style={{ borderBottom: '1px solid #ffffff08', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#ffffff05')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>
                  {o.symbol}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: o.order_type === 'buy' ? '#10b98122' : '#ef444422',
                    color: o.order_type === 'buy' ? '#10b981' : '#ef4444',
                    padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600
                  }}>
                    {o.order_type?.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  {o.quantity}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  ${Number(o.price).toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>
                  ${(o.quantity * o.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: '#10b98122', color: '#10b981',
                    padding: '3px 10px', borderRadius: 4, fontSize: 11
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
  );
}

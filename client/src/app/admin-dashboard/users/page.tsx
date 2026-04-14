'use client';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stocksight-ai-v2-api.onrender.com';
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [rowError, setRowError] = useState<number | null>(null);

  const token = () => localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token()}` }
    })
    .then(r => r.ok ? r.json() : [])
    .then(data => { setUsers(data); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  const handleBan = async (userId: number, currentlyActive: boolean) => {
    setRowError(null);
    const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_active: !currentlyActive })
    });
    if (res.ok) {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, is_active: !currentlyActive } : u
      ));
    } else {
      setRowError(userId);
      setTimeout(() => setRowError(null), 3000);
    }
  };

  const filtered = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>User Management</h1>
          <p style={{ color: '#666', fontSize: 13 }}>{users.length} registered accounts</p>
        </div>
        <button
          onClick={() => window.open('/register', '_blank')}
          style={{
            background: '#ef4444', color: 'white', border: 'none',
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            fontWeight: 500, fontSize: 13
          }}>
          + Add User
        </button>
      </div>

      <input
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: 280, height: 36, background: '#1a1a2e',
          border: '1px solid #ffffff20', borderRadius: 8,
          color: 'white', padding: '0 12px', fontSize: 13,
          marginBottom: 20, outline: 'none'
        }}
      />

      <div style={{ background: '#0d0d1a', border: '1px solid #ffffff15', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ffffff15' }}>
              {['#', 'User', 'Role', 'Status', 'Actions'].map(h => (
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
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading users...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No users found</td></tr>
            ) : filtered.map((user: any, i) => (
              <tr
                key={user.id}
                style={{ borderBottom: '1px solid #ffffff08' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#ffffff05')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px', color: '#666', fontSize: 13 }}>#{i + 1}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: user.role === 'admin' ? '#ef444433' : '#6366f133',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600,
                      color: user.role === 'admin' ? '#ef4444' : '#6366f1'
                    }}>
                      {user.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: user.role === 'admin' ? '#ef444422' : '#ffffff15',
                    color: user.role === 'admin' ? '#ef4444' : '#888',
                    padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 500
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: user.is_active ? '#10b98122' : '#ef444422',
                    color: user.is_active ? '#10b981' : '#ef4444',
                    padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 500
                  }}>
                    {user.is_active ? 'ACTIVE' : 'BANNED'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleBan(user.id, user.is_active)}
                        style={{
                          background: user.is_active ? '#ef444422' : '#10b98122',
                          color: user.is_active ? '#ef4444' : '#10b981',
                          border: `1px solid ${user.is_active ? '#ef444455' : '#10b98155'}`,
                          padding: '4px 14px', borderRadius: 6,
                          cursor: 'pointer', fontSize: 12, fontWeight: 500
                        }}
                      >
                        {user.is_active ? 'Ban' : 'Restore'}
                      </button>
                    )}
                    {rowError === user.id && (
                      <span style={{ color: '#ef4444', fontSize: 11 }}>Failed</span>
                    )}
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

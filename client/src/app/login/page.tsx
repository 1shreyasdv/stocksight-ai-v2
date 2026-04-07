'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const role = await login(email, password);
      router.push(role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex relative overflow-hidden">
      {/* Left GFX */}
      <div className="hidden lg:flex flex-col justify-end w-[56%] p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(124,111,247,0.08) 0%, transparent 70%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* SVG Chart */}
        <div className="w-full h-[200px] mb-10 relative z-10">
          <svg viewBox="0 0 500 180" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c6ff7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#7c6ff7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3a0" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#22d3a0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points="0,140 40,120 80,135 120,100 160,110 200,80 240,90 280,60 320,70 360,45 400,30 440,20 500,10 500,180 0,180" fill="url(#lg1)" />
            <polyline points="0,140 40,120 80,135 120,100 160,110 200,80 240,90 280,60 320,70 360,45 400,30 440,20 500,10" fill="none" stroke="#7c6ff7" strokeWidth="2" />
            <polygon points="0,160 40,148 80,154 120,134 160,142 200,118 240,124 280,104 320,108 360,88 400,78 440,68 500,58 500,180 0,180" fill="url(#lg2)" />
            <polyline points="0,160 40,148 80,154 120,134 160,142 200,118 240,124 280,104 320,108 360,88 400,78 440,68 500,58" fill="none" stroke="#22d3a0" strokeWidth="1.5" strokeDasharray="4,2" />
            <circle cx="500" cy="10" r="5" fill="#7c6ff7" />
            <text x="360" y="6" fill="#7c6ff7" fontSize="9" fontFamily="JetBrains Mono">LIVE MARKET SYNC</text>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="text-xs font-mono tracking-[3px] uppercase text-[#22d3a0] mb-4">The Kinetic Ledger</div>
          <h1 className="text-4xl font-bold leading-tight mb-5">
            Precision Analytics for<br />
            <span className="text-[#a99ff5]">Modern Portfolios</span>
          </h1>
          <p className="text-sm text-[#8b8fa8] leading-relaxed max-w-md mb-8">
            Leverage institutional-grade AI to detect market anomalies before they manifest. Integrated risk modeling across 40+ global exchanges and crypto liquidity pools.
          </p>
          <div className="flex gap-6">
            {[['TSLA', '+2.4%', true], ['NVDA', '+5.2%', true], ['AAPL', '-0.4%', false]].map(([sym, chg, up]) => (
              <div key={sym as string} className="text-xs font-mono">
                <span className="text-[#555870]">{sym} </span>
                <span className={up ? 'text-[#22d3a0]' : 'text-[#f56565]'}>{chg as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[44%] bg-[#111318] border-l border-[rgba(255,255,255,0.07)] flex flex-col justify-center px-10 py-12">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}>S</div>
          <div className="text-sm font-semibold">StockSight AI</div>
        </div>

        <h2 className="text-2xl font-bold mb-1">Log In to StockSight</h2>
        <p className="text-sm text-[#8b8fa8] mb-8">Access your kinetic financial terminal.</p>

        {error && (
          <div className="bg-[rgba(245,101,101,0.1)] border border-[rgba(245,101,101,0.3)] text-[#f56565] text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#555870] mb-2">Work Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555870] text-sm">✉</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.12)] rounded-lg py-3 pl-9 pr-4 text-sm outline-none focus:border-[#7c6ff7] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-semibold tracking-[2px] uppercase text-[#555870]">Security Key</label>
              <button type="button" className="text-xs text-[#a99ff5] hover:underline">Forgot Password?</button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555870] text-sm">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.12)] rounded-lg py-3 pl-9 pr-10 text-sm outline-none focus:border-[#7c6ff7] transition-colors"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555870] text-sm">
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#8b8fa8] cursor-pointer">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-[#7c6ff7]" />
            Keep session active for 30 days
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}
          >
            {isLoading ? 'Authenticating…' : 'Log In →'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="w-full py-3 rounded-lg text-sm font-medium text-[#8b8fa8] border border-[rgba(255,255,255,0.12)] flex items-center justify-center gap-2 hover:border-[#7c6ff7] hover:text-[#a99ff5] transition-all"
          >
            🛡 ADMIN PORTAL
          </button>
        </form>

        <p className="text-center text-xs text-[#555870] mt-6">
          Don't have an account?{' '}
          <button onClick={() => router.push('/register')} className="text-[#a99ff5] hover:underline">Register Now</button>
        </p>
        <p className="text-center text-[10px] text-[#333] mt-2">
          * Admin Portal transitions to secure administrative authentication terminal
        </p>
      </div>
    </div>
  );
}

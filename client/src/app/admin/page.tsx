'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminPage() {
  const router = useRouter();
  const { adminLogin, isLoading, error, clearError, setRole, setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtp = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = digit;
    setOtp(newOtp);
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;
    try {
      const token = await adminLogin(email, password, otpCode);
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      document.cookie = `token=${token}; path=/`;
      setRole('admin');
      setToken(token);
      router.push('/admin-dashboard');
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col pt-12 items-center" style={{ background: '#0a0a0a' }}>
      <div className="text-white text-sm font-medium tracking-widest uppercase mb-4 opacity-80">StockSight AI</div>
      
      <div className="w-full max-w-[420px] rounded-[12px] p-8 border" style={{ background: '#111', borderColor: '#222' }}>
        {/* Warning Banner */}
        <div className="flex items-center justify-center gap-2 rounded-md px-4 py-2.5 mb-8 text-[11px] font-bold tracking-[0.1em] uppercase border" style={{ background: '#1a0000', borderColor: '#ff000033', color: '#ff4444' }}>
          <span>⚠</span>
          AUTHORIZED ACCESS ONLY
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Admin Terminal</h2>
        <p className="text-[12px] text-[#666] mb-8">Verification required for institutional access.</p>

        {error && (
          <div className="bg-[rgba(255,0,0,0.1)] border border-[rgba(255,0,0,0.3)] text-[#ff6666] text-sm rounded-lg px-4 py-3 mb-6">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#888] mb-2">Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@stocksight.ai" required
              className="w-full h-[44px] rounded-lg px-3 text-sm outline-none transition-colors"
              style={{ background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#888] mb-2">Access Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••" required
              className="w-full h-[44px] rounded-lg px-3 text-sm outline-none transition-colors"
              style={{ background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#888] mb-3">6-Digit OTP Code</label>
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtp(e.target.value, i)}
                  onKeyDown={e => handleOtpKey(e, i)}
                  className="w-[44px] h-[44px] text-center text-[18px] font-bold rounded-lg outline-none transition-all"
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    color: 'white',
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading || otp.join('').length < 6}
            className="w-full h-[44px] rounded-lg text-white font-medium text-sm transition-colors disabled:opacity-50"
            style={{ background: '#cc0000' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = '#aa0000'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = '#cc0000'; }}
          >
            {isLoading ? 'VERIFYING…' : 'VERIFY & ENTER'}
          </button>
        </form>

        <button onClick={() => router.push('/login')}
          className="w-full mt-6 text-center text-[11px] uppercase tracking-wider text-[#666] hover:text-white transition-colors"
        >
          ← Back to User Login
        </button>

        <div className="flex justify-between mt-10 pt-6 border-t" style={{ borderColor: '#222' }}>
          {['FIDO2 SUPPORTED', 'BIOMETRIC AUTH', '256-BIT ENCRYPTED'].map(b => (
            <span key={b} className="text-[9px] font-medium tracking-tight text-[#444]">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

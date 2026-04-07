'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (step < 3) { setStep(s => s + 1); return; }
    try {
      await register(form.name, form.email, form.password);
      router.push('/dashboard');
    } catch {}
  };

  const stepLabels = ['Basic Identity', 'Security Setup', 'Confirmation'];
  const fillPct = `${(step / 3) * 100}%`;

  return (
    <div className="min-h-screen bg-[#0a0b0f] flex relative overflow-hidden">
      {/* Left GFX */}
      <div className="hidden lg:flex flex-col justify-center w-[54%] p-14 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,111,247,0.07) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="w-full h-[220px] mb-10 relative z-10">
          <svg viewBox="0 0 440 220" className="w-full h-full">
            <defs>
              <linearGradient id="rg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c6ff7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7c6ff7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[20, 48, 76, 104, 132, 160, 188, 216, 244, 272, 300, 328].map((x, i) => (
              <rect key={i} x={x} y={200 - (i + 1) * 15} width={18} height={(i + 1) * 15} fill="#7c6ff7" rx={2}
                opacity={0.3 + i * 0.06} />
            ))}
            <polyline points="29,200 57,185 85,170 113,155 141,138 169,122 197,108 225,92 253,78 281,62 309,48 337,32"
              fill="none" stroke="#22d3a0" strokeWidth="2.5" />
            <circle cx={337} cy={32} r={5} fill="#22d3a0" />
            <circle cx={337} cy={32} r={12} fill="#22d3a0" opacity={0.15} />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="text-xs font-mono tracking-[3px] uppercase text-[#22d3a0] mb-4">Intelligence Ledger</div>
          <h1 className="text-4xl font-bold leading-tight mb-5">
            Predict the rhythm of<br />
            <span className="text-[#a99ff5]">Global Capital.</span>
          </h1>
          <p className="text-sm text-[#8b8fa8] leading-relaxed max-w-sm mb-8">
            Join 50,000+ institutional investors using StockSight AI to navigate market volatility with neural-network insights.
          </p>
          <div className="flex gap-6">
            {[['TSLA', '+2.4%', true], ['NVDA', '+1.8%', true], ['AAPL', '-0.4%', false]].map(([s, c, u]) => (
              <span key={s as string} className="text-xs font-mono">
                <span className="text-[#555870]">{s} </span>
                <span className={u ? 'text-[#22d3a0]' : 'text-[#f56565]'}>{c as string}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[46%] bg-[#111318] border-l border-[rgba(255,255,255,0.07)] flex flex-col justify-center px-10 py-12 overflow-y-auto">
        {/* Step Bar */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs font-mono text-[#555870]">STEP {step} OF 3</span>
          <div className="flex-1 h-[2px] bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
            <div className="h-full bg-[#7c6ff7] rounded-full transition-all duration-500" style={{ width: fillPct }} />
          </div>
          <span className="text-xs font-mono text-[#555870]">{stepLabels[step - 1]}</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}>S</div>
          <div className="text-sm font-semibold">StockSight AI</div>
        </div>

        <h2 className="text-2xl font-bold mb-1">Create Your Account</h2>
        <p className="text-sm text-[#8b8fa8] mb-8">Begin your journey into kinetic data analytics.</p>

        {error && (
          <div className="bg-[rgba(245,101,101,0.1)] border border-[rgba(245,101,101,0.3)] text-[#f56565] text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#555870] mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555870]">👤</span>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Alexander Hamilton" required
                    className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.12)] rounded-lg py-3 pl-9 pr-4 text-sm outline-none focus:border-[#7c6ff7] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#555870] mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555870]">✉</span>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="alex@kineticledger.com" required
                    className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.12)] rounded-lg py-3 pl-9 pr-4 text-sm outline-none focus:border-[#7c6ff7] transition-colors" />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#555870] mb-2">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555870]">🔒</span>
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••••••••" required
                    className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.12)] rounded-lg py-3 pl-9 pr-10 text-sm outline-none focus:border-[#7c6ff7] transition-colors" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555870]">{showPass ? '🙈' : '👁'}</button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-[#555870] mb-2">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555870]">🔒</span>
                  <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} placeholder="••••••••••••" required
                    className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.12)] rounded-lg py-3 pl-9 pr-4 text-sm outline-none focus:border-[#7c6ff7] transition-colors" />
                </div>
              </div>
              {/* Password strength */}
              <div className="space-y-1">
                <div className="text-[10px] text-[#555870] mb-1">Password Strength</div>
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{
                      background: form.password.length === 0 ? 'rgba(255,255,255,0.08)' :
                        form.password.length < 6 && i === 1 ? '#f56565' :
                        form.password.length < 10 && i <= 2 ? '#fbbf24' :
                        form.password.length >= 10 && i <= 3 ? '#22d3a0' :
                        form.password.length >= 14 ? '#22d3a0' : 'rgba(255,255,255,0.08)'
                    }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#181b22] rounded-xl p-5 border border-[rgba(255,255,255,0.07)]">
                <div className="text-xs text-[#555870] mb-3 font-semibold tracking-wider uppercase">Review Your Details</div>
                {[['Name', form.name], ['Email', form.email], ['Password', '••••••••••••']].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                    <span className="text-xs text-[#555870]">{k}</span>
                    <span className="text-xs font-mono text-[#e8eaf0]">{v}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-2 text-xs text-[#8b8fa8] cursor-pointer">
                <input type="checkbox" required className="accent-[#7c6ff7] mt-0.5" />
                I agree to StockSight AI's Terms of Service and Privacy Policy. Security powered by 256-bit AES encryption.
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 rounded-lg text-sm text-[#8b8fa8] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.2)] transition-colors">
                ← Back
              </button>
            )}
            <button type="submit" disabled={isLoading}
              className="flex-1 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}>
              {step < 3 ? 'Next →' : isLoading ? 'Creating Account…' : 'Create Account →'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#555870] mt-6">
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} className="text-[#a99ff5] hover:underline">Back to Login</button>
        </p>
      </div>
    </div>
  );
}

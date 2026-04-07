'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface TopbarProps {
  role?: 'user' | 'admin';
}

export default function Topbar({ role = 'user' }: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isAdmin = role === 'admin';

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AR';

  return (
    <header className="h-[52px] bg-[#111318] border-b border-[rgba(255,255,255,0.07)] px-6 flex items-center gap-4 flex-shrink-0">
      <div className="relative flex-1 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555870] text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search markets, assets, or AI signals…"
          className="w-full bg-[#181b22] border border-[rgba(255,255,255,0.07)] rounded-lg py-2 pl-8 pr-4 text-sm text-[#e8eaf0] placeholder-[#555870] outline-none focus:border-[#7c6ff7] transition-colors"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="w-[34px] h-[34px] bg-[#181b22] border border-[rgba(255,255,255,0.07)] rounded-lg flex items-center justify-center text-sm hover:border-[rgba(255,255,255,0.2)] transition-colors">
          🔔
        </button>
        <button className="w-[34px] h-[34px] bg-[#181b22] border border-[rgba(255,255,255,0.07)] rounded-lg flex items-center justify-center text-sm hover:border-[rgba(255,255,255,0.2)] transition-colors">
          🌙
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-[rgba(255,255,255,0.07)]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ background: isAdmin ? 'linear-gradient(135deg,#cc0000,#ff4444)' : 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}
          >
            {initials}
          </div>
          <div>
            <div className="text-xs font-semibold">{user?.name || 'Alex Rivera'}</div>
            <div className="text-[10px]" style={{ color: isAdmin ? '#cc0000' : '#555870' }}>
              {isAdmin ? 'Administrator' : 'Senior Analyst'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

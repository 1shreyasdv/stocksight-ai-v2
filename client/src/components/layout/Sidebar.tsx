'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  section?: string;
}

const USER_NAV: NavItem[] = [
  { icon: '⬛', label: 'Overview', href: '/dashboard' },
  { icon: '📈', label: 'Market', href: '/dashboard/market' },
  { icon: '💼', label: 'Portfolio', href: '/dashboard/portfolio' },
  { icon: '⭐', label: 'Watchlist', href: '/dashboard/watchlist' },
  { icon: '🤖', label: 'AI Insights', href: '/dashboard/ai-insights' },
  { icon: '📰', label: 'News', href: '/dashboard/news' },
  { icon: '⚙', label: 'Settings', href: '/dashboard/settings' },
];

const ADMIN_NAV: NavItem[] = [
  { icon: '⬛', label: 'Overview', href: '/admin-dashboard' },
  { icon: '📈', label: 'Market', href: '/admin-dashboard/market' },
  { icon: '💼', label: 'Portfolio', href: '/admin-dashboard/portfolio' },
  { icon: '🤖', label: 'AI Insights', href: '/admin-dashboard/ai-insights' },
  { icon: '📰', label: 'News', href: '/admin-dashboard/news' },
  { icon: '🔴', label: 'Live Transactions', href: '/admin-dashboard/transactions', section: 'Live Trading' },
  { icon: '👥', label: 'Users', href: '/admin-dashboard/users', section: 'Administration' },
  { icon: '⚙', label: 'Settings', href: '/admin-dashboard/settings' },
];

interface SidebarProps {
  role?: 'user' | 'admin';
}

export default function Sidebar({ role = 'user' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const nav = role === 'admin' ? ADMIN_NAV : USER_NAV;
  const isAdmin = role === 'admin';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#111318] border-r border-[rgba(255,255,255,0.07)] flex flex-col sidebar-scroll overflow-y-auto min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ background: isAdmin ? 'linear-gradient(135deg,#cc0000,#ff4444)' : 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}
          >
            {isAdmin ? 'A' : 'S'}
          </div>
          <div>
            <div className="text-sm font-semibold">StockSight AI</div>
            <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: isAdmin ? '#cc000099' : 'var(--text3)' }}>
              {isAdmin ? 'Admin Panel' : 'Kinetic Ledger'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 pt-3">
        {nav.map((item, idx) => {
          const prev = nav[idx - 1];
          const showSection = item.section && (!prev || prev.section !== item.section);
          const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') && item.href !== (isAdmin ? '/admin-dashboard' : '/dashboard'));
          const isExact = item.href === (isAdmin ? '/admin-dashboard' : '/dashboard') ? pathname === item.href : false;
          const active = isExact || (item.href !== (isAdmin ? '/admin-dashboard' : '/dashboard') && isActive) || (item.href === (isAdmin ? '/admin-dashboard' : '/dashboard') && pathname === item.href);

          return (
            <div key={item.href}>
              {showSection && (
                <div className="px-5 pt-4 pb-2 text-[10px] font-semibold tracking-[2px] uppercase text-[#555870]">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-5 py-[9px] text-sm transition-all border-l-2 text-left ${
                  active
                    ? isAdmin
                      ? 'text-[#ff6666] border-l-[#cc0000] bg-[rgba(204,0,0,0.08)]'
                      : 'text-[#a99ff5] border-l-[#7c6ff7] bg-[rgba(124,111,247,0.1)]'
                    : 'text-[#8b8fa8] border-l-transparent hover:text-[#e8eaf0] hover:bg-[#181b22]'
                }`}
              >
                <span className="text-sm w-4 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.07)] space-y-2">
        {!isAdmin && (
          <>
            <div className="text-[10px] font-semibold tracking-[2px] uppercase text-[#555870] mb-2">Pro Signals</div>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#7c6ff7,#9333ea)' }}
            >
              Trade Now
            </button>
          </>
        )}
        {isAdmin && (
          <button
            onClick={() => router.push('/admin-dashboard')}
            className="w-full py-2 rounded-lg text-sm font-semibold text-white mb-2"
            style={{ background: 'linear-gradient(135deg,#cc0000,#ff4444)' }}
          >
            Trade Now
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg text-sm font-medium text-[#8b8fa8] border border-[rgba(255,255,255,0.07)] hover:text-[#f56565] hover:border-[#f5656540] transition-all"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

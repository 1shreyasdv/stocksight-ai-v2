import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import TickerBar from '@/components/layout/TickerBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0b0f]">
      <Sidebar role="user" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TickerBar />
        <Topbar role="user" />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

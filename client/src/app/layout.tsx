import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StockSight AI — Kinetic Ledger',
  description: 'Precision Analytics for Modern Portfolios. AI-powered stock trading insights platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0b0f] text-[#e8eaf0] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

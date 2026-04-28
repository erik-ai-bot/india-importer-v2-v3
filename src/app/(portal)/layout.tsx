'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/cash-command': 'Cash Command',
  '/shipments': 'Import Tracker',
  '/supplier-center': 'Supplier Center',
  '/cost-intel': 'Cost Intel',
  '/lc-center': 'LC Center',
  '/market-radar': 'Market Radar',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // We'll get pathname from the children — pass it via a wrapper if needed
  // For simplicity, we use a fixed title per route-group

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-[#161b27] border-b border-slate-700 px-4 md:px-6 py-3 pl-12 lg:pl-0 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-slate-400 hover:text-slate-200 flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-semibold truncate">{PAGE_TITLES[children && typeof children === 'object' && 'type' in (children as any) ? '/' : '/'] ?? 'Portal'}</h1>
              <p className="text-xs text-slate-400 hidden sm:block">April 2026 · FY 2025–26 Q1</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">● Live</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400">⚠ 3 Alerts</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-3 md:p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

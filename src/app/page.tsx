'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/ui/Sidebar';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';

const MODULES = [
  {
    href: '/cash-command',
    icon: '💰',
    label: 'Cash Command',
    desc: 'Cash position, payables & receivables tracking across 30/60/90-day horizons',
    badge: '⚠ 2',
    badgeType: 'warn',
    color: 'blue',
  },
  {
    href: '/shipments',
    icon: '🚢',
    label: 'Import Tracker',
    desc: 'Live shipment pipeline from Booking → In Transit → Customs → Delivered',
    badge: '🔴 1',
    badgeType: 'critical',
    color: 'blue',
  },
  {
    href: '/supplier-center',
    icon: '🏭',
    label: 'Supplier Center',
    desc: 'Multi-dimensional supplier scorecards & radar analysis across 6 vendors',
    badge: null,
    badgeType: null,
    color: 'blue',
  },
  {
    href: '/cost-intel',
    icon: '📦',
    label: 'Cost Intel',
    desc: 'Landing cost breakdown, margin analysis & scenario modeling for 5 product lines',
    badge: '🔴 1',
    badgeType: 'critical',
    color: 'blue',
  },
  {
    href: '/lc-center',
    icon: '🏦',
    label: 'LC Center',
    desc: 'Letter of Credit lifecycle, bank timelines & repayment schedule tracking',
    badge: null,
    badgeType: null,
    color: 'blue',
  },
  {
    href: '/market-radar',
    icon: '🌍',
    label: 'Market Radar',
    desc: 'FX rates, commodity index & regulatory duty alerts for sourcing decisions',
    badge: '3',
    badgeType: 'warn',
    color: 'blue',
  },
];

const QUICK_STATS = [
  { label: 'Open Payables', value: '₹4.2 Cr', sub: 'Due in 0–7 days', variant: 'warning' as const },
  { label: 'Receivables', value: '₹11.8 Cr', sub: 'Due in 30–60 days', variant: 'default' as const },
  { label: 'Active Shipments', value: '9', sub: 'Across 4 routes', variant: 'default' as const },
  { label: 'Avg. LC Lead Time', value: '11 days', sub: 'HDFC · ICICI · SCB', variant: 'default' as const },
  { label: 'Portfolio Margin', value: '18.4%', sub: 'vs. 15% target', variant: 'good' as const },
  { label: 'USD/INR', value: '₹83.4', sub: '+0.3% MoM', variant: 'default' as const },
];

const ALERTS = [
  { type: 'critical', icon: '🔴', title: 'JNPT Customs Hold — 2 containers', desc: 'SX-2026-0411 from Shanghai held for ADD verification. ETA now +7 days.' },
  { type: 'warn', icon: '⚠️', title: 'LC Expiry — HDFC/LC-2026-0088', desc: 'Letter of Credit expires in 5 days. Prompt buyer for amendment.' },
  { type: 'info', icon: 'ℹ️', title: 'Cotton price up 4.2% MoM', desc: 'MCX cotton futures signal rising input costs for T-shirt line.' },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#161b27] border-b border-slate-700 px-4 md:px-6 py-3 pl-12 lg:pl-0 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden text-slate-400 hover:text-slate-200 flex-shrink-0" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-semibold">Import Intelligence Dashboard</h1>
              <p className="text-xs text-slate-400 hidden sm:block">April 28, 2026 · FY 2025–26 Q1</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">● Live</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400">⚠ 3 Alerts</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 space-y-5">
          {/* Quick stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_STATS.map(kpi => (
              <KPICard key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} variant={kpi.variant} />
            ))}
          </div>

          {/* Alerts strip */}
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">⚡ Active Alerts</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {ALERTS.map((a, i) => (
                <div key={i} className={`rounded-lg p-3 border-l-2 ${
                  a.type === 'critical' ? 'bg-red-500/8 border-red-500' :
                  a.type === 'warn' ? 'bg-yellow-500/8 border-yellow-500' :
                  'bg-blue-500/8 border-blue-500'
                }`}>
                  <div className={`text-xs font-semibold ${a.type === 'critical' ? 'text-red-400' : a.type === 'warn' ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {a.icon} {a.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Module cards */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-3">📋 Modules</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODULES.map(mod => (
                <Link key={mod.href} href={mod.href} className="group bg-slate-800/60 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{mod.icon}</span>
                    {mod.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        mod.badgeType === 'critical' ? 'bg-red-500/15 text-red-400' :
                        'bg-yellow-500/15 text-yellow-400'
                      }`}>{mod.badge}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mb-1">{mod.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                  <div className="mt-3 text-[10px] text-blue-400 font-semibold">Open →</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity snapshot */}
          <Card title="Recent Activity" dot="blue">
            <div className="space-y-2">
              {[
                { time: '10:15 AM', event: 'Shipment SX-2026-0411 arrived at JNPT port', status: '🚢 In Transit → Customs' },
                { time: '09:40 AM', event: 'LC-2026-0088 amendment submitted to HDFC Bank', status: '🏦 Pending' },
                { time: '09:20 AM', event: 'Supplier rating updated — Nishat Chunian (Delivery +2)', status: '🏭 Updated' },
                { time: 'Yesterday', event: 'Payment released ₹18.5L to Ningbo Mingxing', status: '✅ Paid' },
                { time: 'Yesterday', event: 'Cotton futures alert — MCX +4.2% on month', status: '🌍 Market Radar' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-700/40 last:border-0">
                  <span className="text-[10px] text-slate-500 w-16 flex-shrink-0">{item.time}</span>
                  <span className="text-xs text-slate-300 flex-1">{item.event}</span>
                  <span className="text-[10px] text-slate-500 flex-shrink-0">{item.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

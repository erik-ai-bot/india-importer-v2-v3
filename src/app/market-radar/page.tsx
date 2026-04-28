'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import {
  LineChart, Line, BarChart, Bar, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Legend, Cell,
} from 'recharts';

// ── Mock Data ────────────────────────────────────────────────────────────────

const fxData = [
  { date: 'Apr 1', usdInr: 83.10, cnyInr: 11.42 },
  { date: 'Apr 3', usdInr: 83.15, cnyInr: 11.44 },
  { date: 'Apr 5', usdInr: 83.22, cnyInr: 11.47 },
  { date: 'Apr 7', usdInr: 83.18, cnyInr: 11.45 },
  { date: 'Apr 9', usdInr: 83.25, cnyInr: 11.50 },
  { date: 'Apr 11', usdInr: 83.30, cnyInr: 11.52 },
  { date: 'Apr 13', usdInr: 83.28, cnyInr: 11.51 },
  { date: 'Apr 15', usdInr: 83.35, cnyInr: 11.54 },
  { date: 'Apr 17', usdInr: 83.38, cnyInr: 11.56 },
  { date: 'Apr 19', usdInr: 83.32, cnyInr: 11.53 },
  { date: 'Apr 21', usdInr: 83.40, cnyInr: 11.57 },
  { date: 'Apr 23', usdInr: 83.42, cnyInr: 11.58 },
  { date: 'Apr 25', usdInr: 83.38, cnyInr: 11.55 },
  { date: 'Apr 27', usdInr: 83.45, cnyInr: 11.60 },
];

const commodityData = [
  { name: 'Cotton', price: 92.5, index: 108, change: '+4.2%', direction: 'up' },
  { name: 'Polyester', price: 78.2, index: 102, change: '+1.8%', direction: 'up' },
  { name: 'Wool', price: 115.0, index: 104, change: '+2.1%', direction: 'up' },
  { name: 'Silk', price: 240.0, index: 98, change: '-1.5%', direction: 'down' },
  { name: 'Linen', price: 88.0, index: 95, change: '-0.8%', direction: 'down' },
];

const dutyAlerts = [
  { title: 'Anti-Dumping Duty on Chinese Fabric', detail: 'ADD of $2.10/kg applied on certain polyester fabrics from China — JNPT shipments from SX-2026-0411 affected. Effective Mar 15, 2026.', impact: 'high', source: 'CBIC Ref: 15/2025-Customs', date: 'Mar 10' },
  { title: 'GST Rationalisation — Textiles 2026', detail: 'Proposed reduction in GST on man-made fibre apparel from 12% → 5% under consideration by GoM panel. Decision expected by Jul 2026.', impact: 'positive', source: 'MoF Discussion Paper', date: 'Apr 15' },
  { title: 'Bangkok Port Surcharge — NVOCC', detail: 'LCL surcharge of $28/MT at Bangkok port effective May 1. Affects consolidation shipments from Hanoi Garment JSC.', impact: 'medium', source: 'Maersk Advisory', date: 'Apr 20' },
  { title: 'RoDTEP Extension — MMF Export Benefits', detail: 'RoDTEP rates for man-made fibre apparel exports extended to Sep 30, 2026. ₹1,850 Cr budget allocated.', impact: 'positive', source: 'DGFT Circular No. 12/2025', date: 'Mar 28' },
  { title: 'Pakistan MFN Review — Fabric Duties', detail: 'Pakistan FBR reviewing 15% concession on cotton fabric imports. If withdrawn, Nishat Chunian pricing may adjust +5%.', impact: 'medium', source: 'FBR Public Notice', date: 'Apr 5' },
  { title: 'Vietnam BAFHI Compliance Update', detail: 'BAFHI requires new test reports for flame retardant fabrics from Jun 2026. Hanoi Garment already certified.', impact: 'low', source: 'BAFHI Circular 08/2026', date: 'Apr 18' },
  { title: 'Customs CFS Handling Surcharge', detail: 'JNPT CFS handling surcharge increased 18% effective Apr 1. Avg additional cost per TEU: ₹4,200.', impact: 'medium', source: 'JNPT Tariff Order 2026', date: 'Apr 1' },
  { title: 'Section 8 of SEA Agreement — Bangladesh', detail: 'India-Bangladesh trade protocol revision may affect Chittagong–Nhava Sheva route clearance timelines. Under negotiation.', impact: 'low', source: 'MEA Advisory', date: 'Apr 22' },
];

const impactBadgeCls: Record<string, string> = {
  high: 'bg-red-500/15 text-red-400',
  medium: 'bg-yellow-500/15 text-yellow-400',
  low: 'bg-blue-500/15 text-blue-400',
  positive: 'bg-emerald-500/15 text-emerald-400',
};

const impactCardCls: Record<string, string> = {
  high: 'bg-red-500/8 border-l-red-500',
  medium: 'bg-yellow-500/8 border-l-yellow-500',
  low: 'bg-blue-500/8 border-l-blue-500',
  positive: 'bg-emerald-500/8 border-l-emerald-500',
};

const impactTitleCls: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-blue-400',
  positive: 'text-emerald-400',
};

export default function MarketRadar() {
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
              <h1 className="text-sm md:text-base font-semibold">Market Radar</h1>
              <p className="text-xs text-slate-400 hidden sm:block">FX rates, commodity index &amp; regulatory duty alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400">⚠ 3 Duty Alerts</span>
            <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">USD/INR 83.45</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="USD/INR" value="₹83.45" sub="+0.42% MoM" variant="default" />
            <KPICard label="CNY/INR" value="₹11.60" sub="+1.57% MoM" variant="default" />
            <KPICard label="Cotton Index" value="108" sub="+4.2% on month" variant="warning" />
            <KPICard label="Active Duty Alerts" value="8" sub="2 high impact" variant="alert" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* USD/INR and CNY/INR LineChart */}
            <Card title="FX Rate Trend — USD/INR & CNY/INR (30 Days)" dot="blue">
              <p className="text-xs text-slate-400 mb-3">Rupee depreciation vs. major sourcing currencies</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={fxData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="usdInr" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 2 }} name="USD/INR" />
                  <Line type="monotone" dataKey="cnyInr" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} name="CNY/INR" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Commodity BarChart */}
            <Card title="Commodity Price Index — Sourcing Inputs" dot="yellow">
              <p className="text-xs text-slate-400 mb-3">Base 100 · Cotton · Polyester · Wool · Silk · Linen (MCX + ICE sources)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={commodityData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[90, 115]} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Bar dataKey="index" name="Index" radius={[4, 4, 0, 0]}>
                    {commodityData.map((entry, i) => (
                      <Cell key={i} fill={entry.direction === 'up' ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Commodity table */}
          <Card title="Commodity Price Snapshot" dot="green">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Commodity', 'Current Price (USD/kg)', 'Index (Base 100)', '30D Change', 'Signal'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commodityData.map(c => (
                    <tr key={c.name} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                      <td className="py-2 px-2 font-semibold">{c.name}</td>
                      <td className="py-2 px-2">${c.price}</td>
                      <td className="py-2 px-2">{c.index}</td>
                      <td className="py-2 px-2">
                        <span className={c.direction === 'up' ? 'text-red-400' : 'text-emerald-400'}>
                          {c.change}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <Pill variant={c.direction === 'up' ? 'red' : 'green'}>
                          {c.direction === 'up' ? '↑ Rising' : '↓ Falling'}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Regulatory duty alerts */}
          <Card title="Regulatory & Duty Alerts" dot="red">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dutyAlerts.map((alert, i) => (
                <div key={i} className={`rounded-lg p-3 border border-slate-700/60 border-l-2 ${impactCardCls[alert.impact]}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-xs font-semibold leading-snug ${impactTitleCls[alert.impact]}`}>
                      {alert.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${impactBadgeCls[alert.impact]}`}>
                      {alert.impact === 'high' ? '🔴 High' : alert.impact === 'positive' ? '🟢 Positive' : alert.impact === 'medium' ? '🟡 Med' : '🔵 Low'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.detail}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-500">📋 {alert.source}</span>
                    <span className="text-[10px] text-slate-600">{alert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

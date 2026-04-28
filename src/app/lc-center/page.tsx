'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  Tooltip, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Legend, Cell,
} from 'recharts';

// ── Mock Data ────────────────────────────────────────────────────────────────

const lcData = [
  {
    id: 'LC-2026-0088',
    bank: 'HDFC Bank',
    bankIcon: '🏦',
    supplier: 'Ningbo Mingxing Textiles',
    value: 420000,
    valueFmt: '₹42.0L',
    status: 'active',
    statusLabel: 'Active',
    issueDate: 'Mar 10, 2026',
    expiryDate: 'Jun 10, 2026',
    expiryDays: 43,
    shipmentWindow: 'Mar 10 – May 10',
    tenor: '60 days',
    tenorLabel: '60 Days',
    amendment: '1 amendment',
    amtUsed: 420000,
    amtRemaining: 0,
  },
  {
    id: 'LC-2026-0085',
    bank: 'ICICI Bank',
    bankIcon: '🏦',
    supplier: 'Nishat Chunian Ltd',
    value: 285000,
    valueFmt: '₹28.5L',
    status: 'active',
    statusLabel: 'Active',
    issueDate: 'Mar 15, 2026',
    expiryDate: 'Jun 15, 2026',
    expiryDays: 48,
    shipmentWindow: 'Mar 15 – May 15',
    tenor: '60 days',
    tenorLabel: '60 Days',
    amendment: 'None',
    amtUsed: 220000,
    amtRemaining: 65000,
  },
  {
    id: 'LC-2026-0079',
    bank: 'Standard Chartered',
    bankIcon: '🏦',
    supplier: 'Hanoi Garment JSC',
    value: 550000,
    valueFmt: '₹55.0L',
    status: 'pending',
    statusLabel: 'Pending Issuance',
    issueDate: '—',
    expiryDate: 'TBD',
    expiryDays: null,
    shipmentWindow: 'TBD',
    tenor: '90 days',
    tenorLabel: '90 Days',
    amendment: 'Under review',
    amtUsed: 0,
    amtRemaining: 550000,
  },
  {
    id: 'LC-2026-0075',
    bank: 'HSBC India',
    bankIcon: '🏦',
    supplier: 'Chittagong Fabric Co.',
    value: 180000,
    valueFmt: '₹18.0L',
    status: 'expiring',
    statusLabel: 'Expiring Soon',
    issueDate: 'Dec 1, 2025',
    expiryDate: 'May 5, 2026',
    expiryDays: 7,
    shipmentWindow: 'Dec 1 – Apr 30',
    tenor: '60 days',
    tenorLabel: '60 Days',
    amendment: '1 amendment',
    amtUsed: 180000,
    amtRemaining: 0,
  },
  {
    id: 'LC-2026-0062',
    bank: 'HDFC Bank',
    bankIcon: '🏦',
    supplier: 'Istanbul Tekstil A.Ş.',
    value: 320000,
    valueFmt: '₹32.0L',
    status: 'closed',
    statusLabel: 'Closed',
    issueDate: 'Nov 10, 2025',
    expiryDate: 'Feb 10, 2026',
    expiryDays: null,
    shipmentWindow: 'Nov 10 – Jan 10',
    tenor: '60 days',
    tenorLabel: '60 Days',
    amendment: 'None',
    amtUsed: 320000,
    amtRemaining: 0,
  },
];

const lcStatusData = [
  { status: 'Active', value: 2, fob: 72.5 },
  { status: 'Pending', value: 1, fob: 55.0 },
  { status: 'Expiring Soon', value: 1, fob: 18.0 },
  { status: 'Closed', value: 1, fob: 32.0 },
];

const repaymentSchedule = [
  { date: 'May 5, 2026', lc: 'LC-2026-0088', amount: 420000, bank: 'HDFC' },
  { date: 'May 15, 2026', lc: 'LC-2026-0085', amount: 220000, bank: 'ICICI' },
  { date: 'May 20, 2026', lc: 'LC-2026-0075', amount: 180000, bank: 'HSBC' },
  { date: 'Jun 10, 2026', lc: 'LC-2026-0088 (final)', amount: 65000, bank: 'HDFC' },
  { date: 'Jul 15, 2026', lc: 'LC-2026-0079', amount: 550000, bank: 'SCB' },
];

const repaymentTrend = [
  { month: 'Nov', used: 32, headroom: 168 },
  { month: 'Dec', used: 58, headroom: 142 },
  { month: 'Jan', used: 82, headroom: 118 },
  { month: 'Feb', used: 90, headroom: 110 },
  { month: 'Mar', used: 75, headroom: 125 },
  { month: 'Apr', used: 60, headroom: 140 },
];

const STATUS_COLORS: Record<string, string> = {
  active: '#10b981',
  pending: '#f59e0b',
  expiring: '#ef4444',
  closed: '#64748b',
};

export default function LCCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLC, setSelectedLC] = useState<string>('all');

  const filteredLCs = selectedLC === 'all' ? lcData : lcData.filter(lc => lc.status === selectedLC);

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
              <h1 className="text-sm md:text-base font-semibold">LC Center</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Letter of Credit lifecycle — HDFC · ICICI · Standard Chartered · HSBC India</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400">⚠ 1 LC Expiring in 7 days</span>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Active LCs" value="2" sub="₹70.5L outstanding" variant="default" />
            <KPICard label="Total LC Value" value="₹1.755 Cr" sub="All LCs (incl. pending)" variant="default" />
            <KPICard label="Avg. Issue Lead Time" value="11 days" sub="vs. industry 14 days" variant="good" />
            <KPICard label="Pending LCs" value="1" sub="Standard Chartered — under review" variant="warning" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LC Value by status — Horizontal BarChart */}
            <Card title="LC Value by Status (₹ Lakhs)" dot="blue">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={lcStatusData} layout="vertical" barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                  <YAxis type="category" dataKey="status" tick={{ fill: '#94a3b8', fontSize: 11 }} width={110} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Bar dataKey="fob" radius={[0, 4, 4, 0]}>
                    {lcStatusData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.status === 'Active' ? 'active' : entry.status === 'Pending' ? 'pending' : entry.status === 'Expiring Soon' ? 'expiring' : 'closed']} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Repayment schedule — AreaChart */}
            <Card title="LC Utilisation Trend & Repayment Schedule" dot="yellow">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={repaymentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Area type="monotone" dataKey="used" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="LC Utilised" />
                  <Area type="monotone" dataKey="headroom" stroke="#475569" fill="#475569" fillOpacity={0.2} name="Headroom" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* LC Register */}
          <Card title="LC Register" dot="green">
            <div className="flex flex-wrap gap-2 mb-3">
              {['all', 'active', 'pending', 'expiring', 'closed'].map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedLC(f)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                    selectedLC === f
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['LC ID', 'Bank', 'Supplier', 'Value', 'Issue Date', 'Expiry', 'Days Left', 'Tenor', 'Status', 'Amendments'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLCs.map(lc => (
                    <tr key={lc.id} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                      <td className="py-2 px-2 font-mono text-blue-400">{lc.id}</td>
                      <td className="py-2 px-2">{lc.bankIcon} {lc.bank}</td>
                      <td className="py-2 px-2">{lc.supplier}</td>
                      <td className="py-2 px-2 font-semibold">{lc.valueFmt}</td>
                      <td className="py-2 px-2">{lc.issueDate}</td>
                      <td className="py-2 px-2">{lc.expiryDate}</td>
                      <td className="py-2 px-2">
                        {lc.expiryDays !== null
                          ? <span className={lc.expiryDays <= 10 ? 'text-red-400 font-semibold' : 'text-slate-400'}>{lc.expiryDays}d</span>
                          : <span className="text-slate-600">—</span>
                        }
                      </td>
                      <td className="py-2 px-2">
                        <Pill variant="blue">{lc.tenorLabel}</Pill>
                      </td>
                      <td className="py-2 px-2">
                        <Pill variant={lc.status === 'active' ? 'green' : lc.status === 'pending' ? 'yellow' : lc.status === 'expiring' ? 'red' : 'gray'}>{lc.statusLabel}</Pill>
                      </td>
                      <td className="py-2 px-2 text-slate-400 text-[10px]">{lc.amendment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Repayment schedule table */}
          <Card title="Upcoming Repayment Schedule" dot="red">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Due Date', 'LC Reference', 'Bank', 'Repayment Amount'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {repaymentSchedule.map(r => (
                    <tr key={r.lc} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                      <td className="py-2 px-2 font-semibold">{r.date}</td>
                      <td className="py-2 px-2 font-mono">{r.lc}</td>
                      <td className="py-2 px-2">{r.bank}</td>
                      <td className="py-2 px-2 text-yellow-400 font-semibold">₹{(r.amount / 100000).toFixed(1)}L</td>
                    </tr>
                  ))}
                  <tr className="border-b-0 bg-slate-800/40">
                    <td className="py-2 px-2 font-semibold text-slate-200" colSpan={3}>Total Upcoming</td>
                    <td className="py-2 px-2 font-bold text-yellow-400">₹14.35L</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

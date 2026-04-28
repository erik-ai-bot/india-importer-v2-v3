'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import {
  LineChart, Line, BarChart, Bar, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

// ── Mock Data ────────────────────────────────────────────────────────────────

const cashPositionData = [
  { date: 'Apr 1', inflows: 12, outflows: 8, balance: 42 },
  { date: 'Apr 3', inflows: 18, outflows: 14, balance: 46 },
  { date: 'Apr 5', inflows: 18, outflows: 22, balance: 42 },
  { date: 'Apr 7', inflows: 25, outflows: 18, balance: 49 },
  { date: 'Apr 9', inflows: 25, outflows: 28, balance: 46 },
  { date: 'Apr 11', inflows: 30, outflows: 25, balance: 51 },
  { date: 'Apr 13', inflows: 35, outflows: 30, balance: 56 },
  { date: 'Apr 15', inflows: 38, outflows: 35, balance: 59 },
  { date: 'Apr 17', inflows: 42, outflows: 38, balance: 63 },
  { date: 'Apr 19', inflows: 42, outflows: 45, balance: 60 },
  { date: 'Apr 21', inflows: 48, outflows: 42, balance: 66 },
  { date: 'Apr 23', inflows: 52, outflows: 48, balance: 70 },
  { date: 'Apr 25', inflows: 55, outflows: 52, balance: 73 },
  { date: 'Apr 27', inflows: 58, outflows: 55, balance: 76 },
];

const cashPositionData60 = cashPositionData.map((d, i) => ({
  ...d,
  date: i % 2 === 0 ? d.date : '',
}));

const cashPositionData90 = [
  { date: 'Feb 1', inflows: 5, outflows: 10, balance: 38 },
  { date: 'Feb 8', inflows: 8, outflows: 12, balance: 34 },
  { date: 'Feb 15', inflows: 12, outflows: 15, balance: 31 },
  { date: 'Feb 22', inflows: 14, outflows: 16, balance: 29 },
  { date: 'Mar 1', inflows: 16, outflows: 18, balance: 27 },
  { date: 'Mar 8', inflows: 20, outflows: 20, balance: 27 },
  { date: 'Mar 15', inflows: 24, outflows: 22, balance: 29 },
  { date: 'Mar 22', inflows: 28, outflows: 25, balance: 32 },
  { date: 'Mar 29', inflows: 32, outflows: 28, balance: 36 },
  ...cashPositionData.map(d => ({ ...d, date: d.date })),
];

const monthlyData = [
  { month: 'Nov', payables: 42, receivables: 88 },
  { month: 'Dec', payables: 38, receivables: 75 },
  { month: 'Jan', payables: 55, receivables: 95 },
  { month: 'Feb', payables: 48, receivables: 82 },
  { month: 'Mar', payables: 60, receivables: 102 },
  { month: 'Apr', payables: 52, receivables: 96 },
];

const upcomingPayments = [
  { supplier: 'Ningbo Mingxing Textiles', invoice: 'INV-Apr-0412', amount: '₹18.5L', due: 'Apr 29', days: 1, status: 'urgent' },
  { supplier: 'Nishat Chunian Ltd', invoice: 'INV-Apr-0388', amount: '₹24.2L', due: 'Apr 30', days: 2, status: 'soon' },
  { supplier: 'Hanoi Garment JSC', invoice: 'INV-Apr-0399', amount: '₹12.8L', due: 'May 3', days: 5, status: 'soon' },
  { supplier: 'Istanbul Tekstil A.Ş.', invoice: 'INV-Mar-0351', amount: '₹32.0L', due: 'May 7', days: 9, status: 'normal' },
  { supplier: 'Chittagong Fabric Co.', invoice: 'INV-Apr-0405', amount: '₹8.5L', due: 'May 10', days: 12, status: 'normal' },
];

const upcomingCollections = [
  { buyer: 'Shahi Exports Pvt Ltd', invoice: 'AR-Apr-1011', amount: '₹45.0L', due: 'May 15', days: 17, status: 'normal' },
  { buyer: 'Ginni Filaments', invoice: 'AR-Apr-1005', amount: '₹28.5L', due: 'May 20', days: 22, status: 'normal' },
  { buyer: 'Raymond Ltd (Buyers)', invoice: 'AR-Apr-0998', amount: '₹62.0L', due: 'May 28', days: 30, status: 'normal' },
  { buyer: 'Arvind Mills', invoice: 'AR-Apr-0988', amount: '₹38.0L', due: 'Jun 5', days: 38, status: 'normal' },
  { buyer: 'W Exports', invoice: 'AR-Apr-0975', amount: '₹18.0L', due: 'Jun 12', days: 45, status: 'normal' },
];

// ── Chart data by period ────────────────────────────────────────────────────

const dataByPeriod: Record<string, any[]> = {
  '30': cashPositionData,
  '60': cashPositionData60,
  '90': cashPositionData90,
};

const fmtXAxis = (v: string, i: number, total: number) => {
  if (v === '') return '';
  if (total <= 15) return v;
  return i % 3 === 0 ? v : '';
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function CashCommand() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState('30');

  const chartData = dataByPeriod[period] || dataByPeriod['30'];

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
              <h1 className="text-sm md:text-base font-semibold">Cash Command</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Cash flow gap: pay suppliers Day 0 → collect from buyers Day 30–60</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400">● Live</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 space-y-5">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Current Balance" value="₹76L" sub="In major bank accounts" variant="good" />
            <KPICard label="30-Day Outflows" value="₹58L" sub="Supplier payments due" variant="warning" />
            <KPICard label="30-Day Inflows" value="₹58L" sub="Buyer collections due" variant="default" />
            <KPICard label="Cash Gap Risk" value="High" sub="₹42L gap on Day 0–7" variant="alert" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cash Position Line Chart */}
            <Card title="Cash Position Over Time" dot="blue">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400">Inflows vs. Outflows (₹ Lakhs)</p>
                <div className="flex gap-1">
                  {['30', '60', '90'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                        period === p
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600'
                      }`}
                    >
                      {p}d
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(v, i) => fmtXAxis(v, i, chartData.length)}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="inflows" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} name="Inflows" />
                  <Line type="monotone" dataKey="outflows" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} name="Outflows" />
                  <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Net Balance" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Monthly Payables vs Receivables Bar Chart */}
            <Card title="Monthly Payables vs. Receivables" dot="yellow">
              <p className="text-xs text-slate-400 mb-3">₹ Lakhs — note the persistent cash gap (30–60 day lag)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Bar dataKey="payables" name="Payables (Due Day 0–7)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="receivables" name="Receivables (Due Day 30–60)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Upcoming Supplier Payments" dot="red">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[360px]">
                  <thead>
                    <tr className="border-b border-slate-700">
                      {['Supplier', 'Invoice', 'Amount', 'Due', 'Days', 'Status'].map(h => (
                        <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingPayments.map(row => (
                      <tr key={row.invoice} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                        <td className="py-2 px-2 font-medium">{row.supplier}</td>
                        <td className="py-2 px-2 font-mono">{row.invoice}</td>
                        <td className="py-2 px-2">{row.amount}</td>
                        <td className="py-2 px-2">{row.due}</td>
                        <td className="py-2 px-2">{row.days}d</td>
                        <td className="py-2 px-2">
                          <Pill variant={row.status === 'urgent' ? 'red' : row.status === 'soon' ? 'yellow' : 'blue'}>{row.status === 'urgent' ? 'URGENT' : row.status === 'soon' ? 'Soon' : 'Normal'}</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Upcoming Buyer Collections" dot="green">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[360px]">
                  <thead>
                    <tr className="border-b border-slate-700">
                      {['Buyer', 'Invoice', 'Amount', 'Due', 'Days', 'Status'].map(h => (
                        <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingCollections.map(row => (
                      <tr key={row.invoice} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                        <td className="py-2 px-2 font-medium">{row.buyer}</td>
                        <td className="py-2 px-2 font-mono">{row.invoice}</td>
                        <td className="py-2 px-2">{row.amount}</td>
                        <td className="py-2 px-2">{row.due}</td>
                        <td className="py-2 px-2">{row.days}d</td>
                        <td className="py-2 px-2">
                          <Pill variant="green">On Track</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

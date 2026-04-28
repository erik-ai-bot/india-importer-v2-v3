'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import {
  BarChart, Bar, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Legend, Cell,
} from 'recharts';

const pipelineData = [
  { stage: 'Booking', count: 3, fob: 185 },
  { stage: 'In Transit', count: 4, fob: 290 },
  { stage: 'Customs', count: 2, fob: 145 },
  { stage: 'Delivered', count: 3, fob: 210 },
];

const shipments = [
  {
    id: 'SX-2026-0411',
    supplier: 'Ningbo Mingxing Textiles',
    route: 'Shanghai → JNPT',
    lc: 'LC-2026-0088',
    status: 'customs',
    statusLabel: 'Customs Hold',
    eta: 'May 5',
    etaDelay: '+7 days',
    docPct: 72,
    fob: '₹42.0L',
    po: 'PO-2026-0312',
    buyer: 'Shahi Exports',
  },
  {
    id: 'SX-2026-0405',
    supplier: 'Hanoi Garment JSC',
    route: 'Ho Chi Minh → Nhava Sheva',
    lc: 'LC-2026-0085',
    status: 'transit',
    statusLabel: 'In Transit',
    eta: 'Apr 30',
    etaDelay: null,
    docPct: 88,
    fob: '₹28.5L',
    po: 'PO-2026-0308',
    buyer: 'Ginni Filaments',
  },
  {
    id: 'SX-2026-0399',
    supplier: 'Nishat Chunian Ltd',
    route: 'Karachi → JNPT',
    lc: 'LC-2026-0079',
    status: 'transit',
    statusLabel: 'In Transit',
    eta: 'May 2',
    etaDelay: null,
    docPct: 95,
    fob: '₹35.0L',
    po: 'PO-2026-0301',
    buyer: 'Raymond Ltd',
  },
  {
    id: 'SX-2026-0391',
    supplier: 'Chittagong Fabric Co.',
    route: 'Chittagong → Nhava Sheva',
    lc: 'LC-2026-0075',
    status: 'booking',
    statusLabel: 'Booking Confirmed',
    eta: 'May 10',
    etaDelay: null,
    docPct: 45,
    fob: '₹18.0L',
    po: 'PO-2026-0295',
    buyer: 'W Exports',
  },
  {
    id: 'SX-2026-0382',
    supplier: 'Istanbul Tekstil A.Ş.',
    route: 'Istanbul → Mundra',
    lc: 'LC-2026-0068',
    status: 'customs',
    statusLabel: 'Docs Pending',
    eta: 'May 8',
    etaDelay: '+3 days',
    docPct: 55,
    fob: '₹55.0L',
    po: 'PO-2026-0286',
    buyer: 'Arvind Mills',
  },
  {
    id: 'SX-2026-0375',
    supplier: 'Ningbo Shengzhou Cotton',
    route: 'Ningbo → JNPT',
    lc: 'LC-2026-0062',
    status: 'transit',
    statusLabel: 'In Transit',
    eta: 'May 12',
    etaDelay: null,
    docPct: 90,
    fob: '₹22.0L',
    po: 'PO-2026-0279',
    buyer: 'Ginni Filaments',
  },
  {
    id: 'SX-2026-0366',
    supplier: 'Dhaka Woven Mills',
    route: 'Chittagong → Nhava Sheva',
    lc: 'LC-2026-0055',
    status: 'delivered',
    statusLabel: 'Delivered',
    eta: 'Apr 22',
    etaDelay: null,
    docPct: 100,
    fob: '₹31.0L',
    po: 'PO-2026-0268',
    buyer: 'Shahi Exports',
  },
  {
    id: 'SX-2026-0358',
    supplier: 'Yangzhou Hometextiles',
    route: 'Shanghai → JNPT',
    lc: 'LC-2026-0049',
    status: 'delivered',
    statusLabel: 'Delivered',
    eta: 'Apr 18',
    etaDelay: null,
    docPct: 100,
    fob: '₹19.0L',
    po: 'PO-2026-0260',
    buyer: 'Raymond Ltd',
  },
  {
    id: 'SX-2026-0348',
    supplier: 'Mandalay Knitwear',
    route: 'Yangon → Nhava Sheva',
    lc: 'LC-2026-0041',
    status: 'booking',
    statusLabel: 'Booking',
    eta: 'May 18',
    etaDelay: null,
    docPct: 30,
    fob: '₹14.0L',
    po: 'PO-2026-0248',
    buyer: 'Arvind Mills',
  },
  {
    id: 'SX-2026-0339',
    supplier: 'Karachi Spinning Mills',
    route: 'Karachi → JNPT',
    lc: 'LC-2026-0035',
    status: 'delivered',
    statusLabel: 'Delivered',
    eta: 'Apr 10',
    etaDelay: null,
    docPct: 100,
    fob: '₹16.5L',
    po: 'PO-2026-0238',
    buyer: 'W Exports',
  },
];

const statusVariant: Record<string, 'red' | 'yellow' | 'blue' | 'green'> = {
  customs: 'red',
  transit: 'yellow',
  booking: 'blue',
  delivered: 'green',
};

const CHART_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];

export default function Shipments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? shipments : shipments.filter(s => s.status === filter);

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
              <h1 className="text-sm md:text-base font-semibold">Import Tracker</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Shipment pipeline: Booking → In Transit → Customs → Delivered</p>
            </div>
          </div>
          <span className="hidden sm:inline px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400">🔴 1 Customs Hold</span>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Active Shipments" value="9" sub="Across 5 routes" variant="default" />
            <KPICard label="In Transit" value="3" sub="Avg. +0 overdue" variant="default" />
            <KPICard label="Customs Hold" value="2" sub="SX-0411, SX-0382" variant="alert" />
            <KPICard label="Total FOB" value="₹2.80 Cr" sub="Apr–May 2026 window" variant="default" />
          </div>

          {/* Pipeline funnel chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Shipment Pipeline by Stage" dot="blue">
              <p className="text-xs text-slate-400 mb-3">Count &amp; FOB value by pipeline stage (₹ Lakhs)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pipelineData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Bar dataKey="count" name="Shipments" radius={[4, 4, 0, 0]}>
                    {pipelineData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                  </Bar>
                  <Bar dataKey="fob" name="FOB (₹L)" radius={[4, 4, 0, 0]}>
                    {pipelineData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} fillOpacity={0.5} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Pipeline Summary" dot="yellow">
              <div className="space-y-4 mt-1">
                {pipelineData.map((stage, i) => (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: CHART_COLORS[i] + '22', color: CHART_COLORS[i] }}>
                      {stage.count}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-200">{stage.stage}</span>
                        <span className="text-xs text-slate-400">₹{stage.fob}L FOB</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(stage.count / 4) * 100}%`,
                            background: CHART_COLORS[i],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Shipment table */}
          <Card title="Shipment Register" dot="green">
            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-3">
              {['All', 'booking', 'transit', 'customs', 'delivered'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                    filter === f
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600'
                  }`}
                >
                  {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Shipment ID', 'Supplier', 'Route', 'LC Ref', 'PO', 'Buyer', 'FOB', 'ETA', 'Delay', 'Docs %', 'Status'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                      <td className="py-2 px-2 font-mono text-blue-400">{s.id}</td>
                      <td className="py-2 px-2 font-medium">{s.supplier}</td>
                      <td className="py-2 px-2 text-slate-400">{s.route}</td>
                      <td className="py-2 px-2 font-mono">{s.lc}</td>
                      <td className="py-2 px-2">{s.po}</td>
                      <td className="py-2 px-2">{s.buyer}</td>
                      <td className="py-2 px-2">{s.fob}</td>
                      <td className="py-2 px-2">{s.eta}</td>
                      <td className="py-2 px-2">
                        {s.etaDelay
                          ? <span className="text-red-400 font-semibold">{s.etaDelay}</span>
                          : <span className="text-slate-500">—</span>
                        }
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.docPct < 50 ? 'bg-red-500' : s.docPct < 80 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                              style={{ width: `${s.docPct}%` }}
                            />
                          </div>
                          <span className="text-slate-400 w-8">{s.docPct}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <Pill variant={statusVariant[s.status]}>{s.statusLabel}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

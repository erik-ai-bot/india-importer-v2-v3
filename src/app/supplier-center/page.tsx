'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Legend, Cell,
} from 'recharts';

const RADAR_KEYS = ['Quality', 'Delivery', 'Price', 'Comms', 'Compliance', 'Flexibility', 'Financial'];

const suppliers = [
  {
    id: 's1',
    name: 'Ningbo Mingxing Textiles',
    country: 'China',
    flag: '🇨🇳',
    orders: 28,
    value: 485,
    scores: { Quality: 8.5, Delivery: 7.2, Price: 6.8, Comms: 7.5, Compliance: 8.0, Flexibility: 6.5, Financial: 7.8 },
    risk: 'Medium',
    leadDays: 18,
    moq: '500 units',
    paymentTerms: 'T/T 30 days',
    lastShipment: 'Apr 15',
    rating: 7.6,
  },
  {
    id: 's2',
    name: 'Nishat Chunian Ltd',
    country: 'Pakistan',
    flag: '🇵🇰',
    orders: 22,
    value: 390,
    scores: { Quality: 8.0, Delivery: 8.5, Price: 7.2, Comms: 7.8, Compliance: 8.5, Flexibility: 7.0, Financial: 8.2 },
    risk: 'Low',
    leadDays: 14,
    moq: '1,000 units',
    paymentTerms: 'T/T 45 days',
    lastShipment: 'Apr 10',
    rating: 8.0,
  },
  {
    id: 's3',
    name: 'Hanoi Garment JSC',
    country: 'Vietnam',
    flag: '🇻🇳',
    orders: 18,
    value: 295,
    scores: { Quality: 8.2, Delivery: 8.8, Price: 7.8, Comms: 8.5, Compliance: 9.0, Flexibility: 8.0, Financial: 7.5 },
    risk: 'Low',
    leadDays: 16,
    moq: '300 units',
    paymentTerms: 'T/T 30 days',
    lastShipment: 'Apr 22',
    rating: 8.3,
  },
  {
    id: 's4',
    name: 'Istanbul Tekstil A.Ş.',
    country: 'Turkey',
    flag: '🇹🇷',
    orders: 12,
    value: 245,
    scores: { Quality: 7.5, Delivery: 6.5, Price: 8.2, Comms: 6.0, Compliance: 7.0, Flexibility: 7.5, Financial: 7.2 },
    risk: 'Medium',
    leadDays: 22,
    moq: '200 units',
    paymentTerms: 'L/C 60 days',
    lastShipment: 'Mar 30',
    rating: 7.1,
  },
  {
    id: 's5',
    name: 'Chittagong Fabric Co.',
    country: 'Bangladesh',
    flag: '🇧🇩',
    orders: 15,
    value: 180,
    scores: { Quality: 7.0, Delivery: 7.8, Price: 9.0, Comms: 6.5, Compliance: 7.5, Flexibility: 8.5, Financial: 8.0 },
    risk: 'Medium',
    leadDays: 20,
    moq: '1,000 units',
    paymentTerms: 'T/T 45 days',
    lastShipment: 'Apr 5',
    rating: 7.8,
  },
  {
    id: 's6',
    name: 'Yangzhou Hometextiles',
    country: 'China',
    flag: '🇨🇳',
    orders: 10,
    value: 135,
    scores: { Quality: 6.5, Delivery: 5.8, Price: 7.5, Comms: 5.5, Compliance: 6.0, Flexibility: 5.0, Financial: 6.5 },
    risk: 'High',
    leadDays: 25,
    moq: '500 units',
    paymentTerms: 'T/T 30 days',
    lastShipment: 'Mar 20',
    rating: 6.1,
  },
];

const radarColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function supplierToRadarData(s: typeof suppliers[0]) {
  return RADAR_KEYS.map(key => ({
    axis: key,
    value: s.scores[key as keyof typeof s.scores],
  }));
}

const barData = suppliers.map(s => ({
  name: s.name.split(' ')[0],
  fullName: s.name,
  orders: s.orders,
  value: s.value,
}));

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function SupplierCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<typeof suppliers[0] | null>(null);

  const radarData = selectedSupplier ? supplierToRadarData(selectedSupplier) : null;

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
              <h1 className="text-sm md:text-base font-semibold">Supplier Center</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Multi-dimensional supplier scorecards — click a supplier to view radar</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400">⚠ 1 High Risk</span>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Active Suppliers" value="6" sub="China · PAK · VN · TUR · BGD" variant="default" />
            <KPICard label="Total FOB Value" value="₹17.3 Cr" sub="Trailing 12 months" variant="default" />
            <KPICard label="Avg. Lead Time" value="19 days" sub="vs. industry 21 days" variant="good" />
            <KPICard label="On-Time Delivery" value="82%" sub="Trailing 6 shipments" variant="warning" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Radar chart */}
            <Card title={selectedSupplier ? `Radar Scorecard — ${selectedSupplier.name}` : 'Radar Scorecard — Select a supplier'} dot="blue">
              {!selectedSupplier ? (
                <div className="flex flex-col items-center justify-center h-[260px] text-slate-500">
                  <span className="text-4xl mb-3">🏭</span>
                  <p className="text-sm">Click any supplier on the right to view their radar scorecard</p>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center max-w-xs">
                    {suppliers.map(s => (
                      <button key={s.id} onClick={() => setSelectedSupplier(s)}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${s === selectedSupplier ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-slate-700 border-slate-600 hover:border-blue-500/40 text-slate-300'}`}>
                        {s.flag} {s.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suppliers.map(s => (
                      <button key={s.id} onClick={() => setSelectedSupplier(s)}
                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${s.id === selectedSupplier.id ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-slate-700 border-slate-600 hover:border-blue-500/40 text-slate-300'}`}>
                        {s.flag} {s.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData!}>
                      <PolarGrid stroke="#2d3748" />
                      <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                  {/* Score breakdown */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {RADAR_KEYS.map(key => (
                      <div key={key} className="bg-slate-700/40 rounded p-1.5 text-center">
                        <p className="text-[9px] text-slate-500">{key}</p>
                        <p className="text-sm font-bold text-slate-100">{selectedSupplier.scores[key as keyof typeof selectedSupplier.scores]}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {/* Bar chart — Supplier comparison */}
            <Card title="Supplier Comparison by Total Value" dot="yellow">
              <p className="text-xs text-slate-400 mb-3">₹ Lakhs — total FOB value (trailing 12 months)</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `₹${v}L`} />
                  <YAxis type="category" dataKey="fullName" tick={{ fill: '#94a3b8', fontSize: 10 }} width={130} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} formatter={(v) => [`₹${v}L`, '']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Supplier directory */}
          <Card title="Supplier Directory" dot="green">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Supplier', 'Country', 'Orders', 'FOB Value', 'Lead Time', 'MOQ', 'Payment Terms', 'Last Shipment', 'Risk', 'Rating', 'Action'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                      <td className="py-2 px-2">
                        <button
                          onClick={() => setSelectedSupplier(s)}
                          className={`font-medium hover:underline transition-colors ${s === selectedSupplier ? 'text-blue-400' : 'text-blue-400/80'}`}
                        >
                          {s.flag} {s.name}
                        </button>
                      </td>
                      <td className="py-2 px-2">{s.country}</td>
                      <td className="py-2 px-2">{s.orders}</td>
                      <td className="py-2 px-2">₹{s.value}L</td>
                      <td className="py-2 px-2">{s.leadDays}d</td>
                      <td className="py-2 px-2">{s.moq}</td>
                      <td className="py-2 px-2 text-slate-400">{s.paymentTerms}</td>
                      <td className="py-2 px-2 text-slate-400">{s.lastShipment}</td>
                      <td className="py-2 px-2">
                        <Pill variant={s.risk === 'High' ? 'red' : s.risk === 'Medium' ? 'yellow' : 'green'}>{s.risk}</Pill>
                      </td>
                      <td className="py-2 px-2">
                        <span className={s.rating >= 7.5 ? 'text-emerald-400' : s.rating < 7 ? 'text-red-400' : 'text-yellow-400'}>
                          {s.rating}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => setSelectedSupplier(s)}
                          className="px-2 py-0.5 rounded text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25"
                        >
                          Radar
                        </button>
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

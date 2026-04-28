'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import {
  LineChart, Line, BarChart, Bar, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Legend, Cell, ComposedChart,
} from 'recharts';

// ── Mock Data ────────────────────────────────────────────────────────────────

const products = [
  {
    name: 'T-Shirt',
    fob: 2.8,
    freight: 0.35,
    insurance: 0.05,
    customsDuty: 0.42,
    igst: 0.61,
    landingCost: 4.23,
    marginPct: 22,
    fobUsd: 3.35,
  },
  {
    name: 'Jeans',
    fob: 8.5,
    freight: 0.80,
    insurance: 0.15,
    customsDuty: 1.28,
    igst: 1.89,
    landingCost: 12.62,
    marginPct: 18,
    fobUsd: 10.20,
  },
  {
    name: 'Bed Sheet',
    fob: 5.2,
    freight: 0.55,
    insurance: 0.10,
    customsDuty: 0.78,
    igst: 1.15,
    landingCost: 7.78,
    marginPct: 16,
    fobUsd: 6.24,
  },
  {
    name: 'Towel',
    fob: 3.8,
    freight: 0.40,
    insurance: 0.07,
    customsDuty: 0.57,
    igst: 0.84,
    landingCost: 5.68,
    marginPct: 20,
    fobUsd: 4.56,
  },
  {
    name: 'Jackets',
    fob: 14.0,
    freight: 1.20,
    insurance: 0.25,
    customsDuty: 2.10,
    igst: 3.10,
    landingCost: 20.65,
    marginPct: 14,
    fobUsd: 16.80,
  },
];

// Waterfall chart data — each product shows stacking of cost components
// We show them as stacked bar segments: FOB, Freight, Insurance, Duty, IGST
// For waterfall visual, we'll show cumulative cost for each product

const marginTrendData = [
  { month: 'Nov', margin: 19.2, target: 18 },
  { month: 'Dec', margin: 18.5, target: 18 },
  { month: 'Jan', margin: 17.8, target: 18 },
  { month: 'Feb', margin: 18.2, target: 18 },
  { month: 'Mar', margin: 18.8, target: 18 },
  { month: 'Apr', margin: 18.4, target: 18 },
];

// Scenario — base + FOB +/- 10% + FX delta
// Scenario 1 = Base, Scenario 2 = FOB +10%, Scenario 3 = FOB -10%, Scenario 4 = FX +5%

const scenarioData = {
  base: products.map(p => ({ name: p.name, landing: p.landingCost, fob: p.fobUsd })),
  fobUp: products.map(p => ({ name: p.name, landing: +(p.landingCost * 1.10).toFixed(2), fob: +(p.fobUsd * 1.10).toFixed(2) })),
  fobDown: products.map(p => ({ name: p.name, landing: +(p.landingCost * 0.90).toFixed(2), fob: +(p.fobUsd * 0.90).toFixed(2) })),
  fxUp: products.map(p => ({ name: p.name, landing: +(p.landingCost * 1.05).toFixed(2), fob: p.fobUsd })),
};

type Scenario = 'base' | 'fobUp' | 'fobDown' | 'fxUp';

const COST_COMPONENTS = ['FOB', 'Freight', 'Insurance', 'Customs Duty', 'IGST'];
const WATERFALL_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444'];

// Build stacked data per product
function buildWaterfallData(prods: typeof products) {
  return prods.map(p => ({
    name: p.name,
    FOB: p.fob,
    Freight: p.freight,
    Insurance: p.insurance,
    'Customs Duty': p.customsDuty,
    IGST: p.igst,
  }));
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function CostIntel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scenario, setScenario] = useState<Scenario>('base');

  const activeData = scenarioData[scenario];
  const waterfallData = buildWaterfallData(products);

  const scenarioLabel: Record<Scenario, string> = {
    base: 'Base Case',
    fobUp: 'FOB +10%',
    fobDown: 'FOB -10%',
    fxUp: 'FX +5% (USD/INR)',
  };

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
              <h1 className="text-sm md:text-base font-semibold">Cost Intel</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Landing cost breakdown, margin analysis & scenario modeling</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400">🔴 Margin at Risk: Jackets (14%)</span>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Portfolio Margin" value="18.4%" sub="vs. 15% target" variant="default" />
            <KPICard label="Avg. Landing Cost" value="₹10.19" sub="Per unit equiv." variant="default" />
            <KPICard label="Highest Risk" value="Jackets (14%)" sub="Below 15% threshold" variant="alert" />
            <KPICard label="Cost Gap" value="₹2.35 Cr" sub="Hidden costs est." variant="warning" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Waterfall / Stacked Cost Breakdown */}
            <Card title="Landing Cost Waterfall" dot="blue">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400">FOB → Freight → Insurance → Customs → IGST → Landing (USD/unit)</p>
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(scenarioData) as Scenario[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setScenario(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        scenario === s
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600'
                      }`}
                    >
                      {scenarioLabel[s]}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={waterfallData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
                  {COST_COMPONENTS.map((comp, i) => (
                    <Bar key={comp} dataKey={comp} stackId="a" fill={WATERFALL_COLORS[i]} name={comp} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Margin % Trend LineChart */}
            <Card title="Portfolio Margin % — 6-Month Trend" dot="yellow">
              <p className="text-xs text-slate-400 mb-3">Portfolio margin vs. 18% target floor</p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={marginTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={[15, 22]} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2d3748', borderRadius: 6 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} name="Actual Margin %" />
                  <Line type="monotone" dataKey="target" stroke="#475569" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Target (18%)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Product comparison table */}
          <Card title="Product Cost Breakdown — Full Landing Analysis" dot="green">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Product', 'FOB (USD)', 'Freight', 'Insurance', 'Customs Duty', 'IGST (18%)', 'Landing Cost', 'Selling Price', 'Margin %', 'Risk'].map(h => (
                      <th key={h} className="text-left py-2 px-2 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.name} className="border-b border-slate-700/50 hover:bg-white/[0.02]">
                      <td className="py-2 px-2 font-semibold">{p.name}</td>
                      <td className="py-2 px-2">${p.fob}</td>
                      <td className="py-2 px-2">${p.freight}</td>
                      <td className="py-2 px-2">${p.insurance}</td>
                      <td className="py-2 px-2">${p.customsDuty}</td>
                      <td className="py-2 px-2">${p.igst}</td>
                      <td className="py-2 px-2 font-semibold text-blue-400">${p.landingCost}</td>
                      <td className="py-2 px-2">${(p.landingCost * 1.25).toFixed(2)}</td>
                      <td className="py-2 px-2">
                        <span className={p.marginPct >= 18 ? 'text-emerald-400' : p.marginPct >= 15 ? 'text-yellow-400' : 'text-red-400'}>
                          {p.marginPct}%
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          p.marginPct >= 18 ? 'bg-emerald-500/15 text-emerald-400' :
                          p.marginPct >= 15 ? 'bg-yellow-500/15 text-yellow-400' :
                          'bg-red-500/15 text-red-400'
                        }`}>
                          {p.marginPct >= 18 ? 'OK' : p.marginPct >= 15 ? 'Watch' : 'Action'}
                        </span>
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

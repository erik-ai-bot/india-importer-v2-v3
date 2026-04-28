# Buyer Portal — Supply Chain Command Center

A multi-persona supply chain intelligence dashboard for discount retail operations.

## Personas

### 💼 CFO Portal (v1)
Financial risk intelligence dashboard covering:
- Executive Dashboard (KPIs, alerts, margin trend)
- Cost & Margin Protection (BOM modeling, replacement cost variance)
- Geo Risk & Market Intelligence (supplier distribution, country risk trinity)
- SCF & Treasury Control (credit line, invoice ledger, financing workflows)
- Supplier Profiles (interactive world map, performance metrics)

### 🤵 Sourcing Head Portal (v2 — added Mar 2026)
Operational supply chain intelligence covering:
- Global Command Overview (OTD trends, regional heatmap, adjustable benchmark)
- Supplier & Factory Performance Matrix (7-dimension radar vs Market Norm)
- Alternative Sourcing & Resilience Engine (China disruption simulation, match scoring)
- Product DNA & Process Intelligence (lead time variance, bottleneck mapping)
- Pipeline Health & Macro Intelligence (PO WIP risk center, macro alerts)

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Database:** Supabase (falls back to mock data if not configured)
- **Deployment:** Cloudflare Pages

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If not set, the app runs in mock data mode.

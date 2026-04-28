'use client';
import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Pill } from '@/components/ui/Pill';
import type { Supplier } from '@/data/suppliers';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const riskColor: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

interface Props {
  suppliers: Supplier[];
}

export function SupplierMap({ suppliers }: Props) {
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([80, 20]);

  return (
    <div className="relative">
      {/* Map */}
      <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700" style={{ height: 420 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ zoom, coordinates }: { zoom: number; coordinates: [number, number] }) => {
              setZoom(zoom);
              setCenter(coordinates);
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e2535"
                    stroke="#2d3748"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#252d3d', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {suppliers.map(s => (
              <Marker key={s.id} coordinates={[s.lng, s.lat]}>
                <circle
                  r={6 / zoom}
                  fill={riskColor[s.riskLevel]}
                  stroke="#0f1117"
                  strokeWidth={1.5 / zoom}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(s)}
                />
                {zoom > 2 && (
                  <text
                    textAnchor="middle"
                    y={-10 / zoom}
                    style={{ fill: '#e2e8f0', fontSize: 8 / zoom, fontFamily: 'system-ui' }}
                  >
                    {s.name}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button
            onClick={() => setZoom(z => Math.min(z * 1.5, 8))}
            className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm font-bold flex items-center justify-center"
          >+</button>
          <button
            onClick={() => setZoom(z => Math.max(z / 1.5, 1))}
            className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm font-bold flex items-center justify-center"
          >−</button>
          <button
            onClick={() => { setZoom(1); setCenter([80, 20]); }}
            className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-white text-[9px] font-bold flex items-center justify-center"
          >⊙</button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex gap-3 bg-slate-900/80 rounded px-2 py-1">
          {Object.entries(riskColor).map(([risk, color]) => (
            <div key={risk} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[10px] text-slate-400">{risk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Supplier popup */}
      {selected && (
        <div className="absolute top-4 left-4 w-72 bg-[#1e2535] border border-slate-600 rounded-xl shadow-2xl z-10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700"
            style={{ borderLeftWidth: 3, borderLeftColor: riskColor[selected.riskLevel] }}>
            <div>
              <div className="font-semibold text-sm">{selected.name}</div>
              <div className="text-xs text-slate-400">{selected.city}, {selected.country}</div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="px-4 py-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Risk Level</span>
              <Pill variant={selected.riskLevel === 'Critical' ? 'red' : selected.riskLevel === 'High' ? 'red' : selected.riskLevel === 'Medium' ? 'yellow' : 'green'}>{selected.riskLevel}</Pill>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Annual Spend</span>
              <span className="font-semibold">{selected.annualSpend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Capacity</span>
              <span>{selected.productionCapacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Employees</span>
              <span>{selected.employees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Est.</span>
              <span>{selected.established}</span>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Products</div>
              <div className="flex flex-wrap gap-1">
                {selected.products.map(p => <span key={p} className="bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded text-[10px]">{p}</span>)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Certificates</div>
              <div className="flex flex-wrap gap-1">
                {selected.certificates.map(c => <span key={c} className="bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded text-[10px]">{c}</span>)}
              </div>
            </div>
            <div className="pt-1 border-t border-slate-700">
              <div className="text-slate-400">Contact</div>
              <div className="font-medium">{selected.contactName}</div>
              <div className="text-slate-400">{selected.contactEmail}</div>
            </div>
            <div className="text-slate-500 text-[10px] pt-1">{selected.address}</div>
          </div>
        </div>
      )}
    </div>
  );
}

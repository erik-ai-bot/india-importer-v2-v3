import { clsx } from 'clsx';
import type { KPICard } from '@/types';

export function KPICard({ label, value, sub, variant }: KPICard) {
  return (
    <div className={clsx(
      'rounded-lg p-4 border',
      variant === 'alert' && 'bg-red-950/30 border-red-500/40',
      variant === 'warning' && 'bg-yellow-950/30 border-yellow-500/40',
      variant === 'good' && 'bg-emerald-950/30 border-emerald-500/40',
      variant === 'default' && 'bg-slate-800/60 border-slate-700',
    )}>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</div>
      <div className={clsx(
        'text-2xl font-bold',
        variant === 'alert' && 'text-red-400',
        variant === 'warning' && 'text-yellow-400',
        variant === 'good' && 'text-emerald-400',
        variant === 'default' && 'text-slate-100',
      )}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

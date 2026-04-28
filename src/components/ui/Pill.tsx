import { clsx } from 'clsx';

interface PillProps {
  children: React.ReactNode;
  variant: 'red' | 'yellow' | 'green' | 'blue' | 'gray';
}

export function Pill({ children, variant }: PillProps) {
  return (
    <span className={clsx(
      'inline-flex px-2 py-0.5 rounded-full text-xs font-semibold',
      variant === 'red' && 'bg-red-500/15 text-red-400',
      variant === 'yellow' && 'bg-yellow-500/15 text-yellow-400',
      variant === 'green' && 'bg-emerald-500/15 text-emerald-400',
      variant === 'blue' && 'bg-blue-500/15 text-blue-400',
      variant === 'gray' && 'bg-slate-500/15 text-slate-400',
    )}>
      {children}
    </span>
  );
}

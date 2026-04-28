import { clsx } from 'clsx';

interface CardProps {
  title: string;
  dot?: 'blue' | 'red' | 'green' | 'yellow';
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, dot = 'blue', children, className }: CardProps) {
  return (
    <div className={clsx('bg-slate-800/60 border border-slate-700 rounded-lg p-4', className)}>
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full',
          dot === 'blue' && 'bg-blue-500',
          dot === 'red' && 'bg-red-500',
          dot === 'green' && 'bg-emerald-500',
          dot === 'yellow' && 'bg-yellow-500',
        )} />
        {title}
      </h3>
      {children}
    </div>
  );
}

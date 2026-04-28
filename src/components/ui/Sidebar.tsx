'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/cash-command', label: 'Cash Command', icon: '💰' },
  { href: '/shipments', label: 'Import Tracker', icon: '🚢' },
  { href: '/supplier-center', label: 'Supplier Center', icon: '🏭' },
  { href: '/cost-intel', label: 'Cost Intel', icon: '📦' },
  { href: '/lc-center', label: 'LC Center', icon: '🏦' },
  { href: '/market-radar', label: 'Market Radar', icon: '🌍' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-52 bg-[#161b27] border-r border-slate-700 flex flex-col flex-shrink-0
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-auto
      `}>
        <div className="px-4 py-5 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">India Importer</h2>
            <p className="text-xs text-slate-500 mt-0.5">Import Intelligence Portal</p>
          </div>
          <button
            className="md:hidden text-slate-400 hover:text-slate-200 p-1"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all border-l-[3px]
                  ${isActive
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500'
                    : 'text-slate-400 border-transparent hover:bg-blue-500/5 hover:text-slate-200'
                  }
                `}
              >
                <span className="text-base w-4 text-center">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-slate-700">
          <p className="text-[10px] text-slate-500">FY 2025–26 · Q1</p>
          <p className="text-[10px] text-slate-600 mt-0.5">USD/INR 83.4 · CNY/INR 11.5</p>
        </div>
      </aside>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/dashboard/recipes', label: 'Mes recettes' },
  { href: '/dashboard/planner', label: 'Mon planning' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-slate-900 text-white">
      <div className="border-b border-slate-700 px-6 py-5">
        <span className="text-lg font-bold tracking-tight">WeeklyMeals</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-700 px-6 py-4">
        <p className="text-xs text-slate-500">Account — bientôt disponible</p>
      </div>
    </aside>
  );
};
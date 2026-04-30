'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';

const navLinks = [
  { href: '/dashboard/recipes', label: 'Mes recettes' },
  { href: '/dashboard/planner', label: 'Mon planning' },
];
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <div className="contents">
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          'fixed z-50 flex h-screen w-4/5 flex-col border-r bg-slate-900 text-white',
          'lg:relative lg:z-0 lg:h-screen lg:w-60 lg:translate-x-0',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
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
                    onClick={onClose}
                    className={clsx(
                      'block rounded-md px-3 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-700 px-6 py-4">
          <p className="truncate text-sm font-medium text-white">
            {session?.user.name}
          </p>
          <p className="truncate text-xs text-slate-400">
            {session?.user.email}
          </p>
          <button
            onClick={handleSignOut}
            className="mt-3 w-full cursor-pointer rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-slate-500 hover:text-white"
          >
            Se déconnecter
          </button>
        </div>
      </aside>
    </div>
  );
};

'use client';

import clsx from 'clsx';
import { BookOpen, CalendarDays, LayoutDashboard, LogOut, Shield, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import { UserRole } from '@/types/enums';

const navLinks = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/recipes', label: 'Mes recettes', icon: BookOpen },
  { href: '/dashboard/planner', label: 'Mon planning', icon: CalendarDays },
  { href: '/dashboard/shopping-list', label: 'Liste de courses', icon: ShoppingCart },
];

const adminNavLinks = [{ href: '/dashboard/admin', label: 'Admin', icon: Shield }];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string; role: string };
};

export const Sidebar = ({ isOpen, onClose, user }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const links = [
    ...navLinks,
    ...(user.role === UserRole.admin ? adminNavLinks : []),
  ];

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
          'fixed z-50 flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar',
          'lg:relative lg:z-0 lg:translate-x-0',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <span className="font-heading text-base font-semibold tracking-tight text-sidebar-foreground">
              WeeklyMeals
            </span>
          </Link>
        </div>

        <div className="mx-3 border-b border-sidebar-border" />

        <nav className="flex-1 px-3 py-3">
          <ul className="space-y-0.5">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-l-2 border-sidebar-accent-foreground bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                <LogOut className="h-3 w-3" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

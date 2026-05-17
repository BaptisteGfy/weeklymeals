'use client';

import clsx from 'clsx';
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Shield,
  ShoppingCart,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { UserRole } from '@/types/auth';

const navLinks = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/recipes', label: 'Mes recettes', icon: BookOpen },
  { href: '/dashboard/planner', label: 'Mon planning', icon: CalendarDays },
  {
    href: '/dashboard/shopping-list',
    label: 'Liste de courses',
    icon: ShoppingCart,
  },
];

const adminNavLinks = [
  { href: '/dashboard/admin', label: 'Admin', icon: Shield },
];

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
          'border-sidebar-border bg-sidebar fixed z-50 flex h-screen w-60 flex-col border-r',
          'lg:relative lg:z-0 lg:translate-x-0',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <UtensilsCrossed
              className="text-primary h-5 w-5"
              strokeWidth={1.5}
            />
            <span className="font-heading text-sidebar-foreground text-base font-semibold tracking-tight">
              WeeklyMeals
            </span>
          </Link>
        </div>

        <div className="border-sidebar-border mx-3 border-b" />

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
                        ? 'border-sidebar-accent-foreground bg-sidebar-accent text-sidebar-accent-foreground border-l-2'
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

        <div className="border-sidebar-border border-t px-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={clsx(
                  'flex w-full items-center gap-3 rounded-lg px-1 py-1 transition-colors',
                  pathname === '/dashboard/profile'
                    ? 'bg-sidebar-accent'
                    : 'hover:bg-sidebar-accent/50',
                )}
              >
                <div className="bg-sidebar-accent text-sidebar-accent-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sidebar-foreground truncate text-sm font-medium">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" onClick={onClose}>
                  <User className="h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </div>
  );
};

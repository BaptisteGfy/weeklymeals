'use client';

import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const BENEFITS = [
  'Bibliothèque illimitée de recettes',
  'Planning collaboratif famille',
  'Liste de courses automatique',
  'Synchronisation entre vos appareils',
];

const SplitLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isSignup = pathname === '/signup';

  return (
    <div className="flex min-h-screen">
      {/* Form — gauche login, droite signup */}
      <div
        className={cn(
          'bg-neutre-50 flex w-full flex-col items-center justify-center px-8 py-16 lg:w-1/2 lg:px-16',
          isSignup ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        {children}
      </div>

      {/* Aside — droite login, gauche signup */}
      <div
        className={cn(
          'bg-terracotta-500 relative hidden overflow-hidden lg:block lg:w-1/2',
          isSignup ? 'lg:order-1' : 'lg:order-2',
        )}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              135deg,
              rgba(255,255,255,0.04) 0px,  rgba(255,255,255,0.04) 24px,
              transparent            24px, transparent            48px
            )`,
          }}
        />

        <div className="relative z-10 flex h-full flex-col p-14">
          <Logo size="sm" onDark />

          <div className="flex flex-1 flex-col justify-center space-y-6">
            <h2 className="font-serif text-5xl leading-tight font-semibold text-white">
              {isSignup ? (
                <>
                  Trois minutes
                  <br />
                  pour <em className="text-terracotta-200">poser</em>
                  <br />
                  votre semaine.
                </>
              ) : (
                <>
                  Une <em className="text-terracotta-200">semaine</em>
                  <br />
                  déjà mijotée
                  <br />
                  vous attend.
                </>
              )}
            </h2>

            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              {isSignup
                ? 'Gratuit pour toujours. Sans carte bancaire. Invitez votre famille dès que vous voulez.'
                : 'Reprenez votre planning, vos recettes favorites, et la liste de courses du week-end.'}
            </p>

            {isSignup && (
              <ul className="space-y-3 pt-2">
                {BENEFITS.map((text) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-white/80">{text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitLayout;

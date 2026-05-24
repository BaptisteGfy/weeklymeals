'use client';

import {
  Book,
  Calendar,
  Clock,
  Leaf,
  Plus,
  Search,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useCallback, useEffect, useRef, useState } from 'react';

import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { useRecipes } from '@/context/RecipesContext';
import { cn } from '@/lib/utils';

type ResultItem = {
  id: string;
  type: 'recipe' | 'page' | 'action' | 'suggestion' | 'recent';
  title: string;
  meta?: string;
  icon?: React.ReactNode;
  action: () => void;
  shortcut?: string;
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <span className="border-neutre-200 text-neutre-500 rounded-[3px] border bg-white px-[5px] py-[1px] font-mono text-[10px] leading-none">
    {children}
  </span>
);

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-terracotta-100 text-terracotta-800 rounded-[2px] px-[2px] not-italic"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};

const PAGES: ResultItem[] = [
  {
    id: 'page-shopping',
    type: 'page',
    title: 'Liste de courses · cette semaine',
    icon: <ShoppingCart size={16} />,
    action: () => {},
    shortcut: '⌘ G',
  },
  {
    id: 'page-planning',
    type: 'page',
    title: 'Mon planning',
    icon: <Calendar size={16} />,
    action: () => {},
    shortcut: '⌘ P',
  },
  {
    id: 'page-household',
    type: 'page',
    title: 'Mon foyer',
    icon: <Users size={16} />,
    action: () => {},
  },
];

const SUGGESTIONS: ResultItem[] = [
  {
    id: 'sug-season',
    type: 'suggestion',
    title: 'Recettes de saison · mai',
    meta: 'asperges, petits pois, fraises, rhubarbe',
    icon: <Leaf size={16} />,
    action: () => {},
  },
  {
    id: 'sug-fast',
    type: 'suggestion',
    title: 'Recettes en moins de 30 min',
    meta: 'Express pour les soirs en semaine',
    icon: <Clock size={16} />,
    action: () => {},
  },
];

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { recipes } = useRecipes();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => {
          if (!v) {
            setQuery('');
            setSelectedIndex(0);
          }
          return !v;
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Expose open handler for TopBar
  useEffect(() => {
    (window as Record<string, unknown>).__globalSearchOpen = handleOpen;
    return () => {
      delete (window as Record<string, unknown>).__globalSearchOpen;
    };
  }, [handleOpen]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filteredRecipes = query.trim()
    ? recipes
        .filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  const quickActions: ResultItem[] = query.trim()
    ? [
        {
          id: 'action-create',
          type: 'action',
          title: `Créer une recette avec « ${query} »`,
          icon: <Plus size={16} />,
          action: () => router.push('/dashboard/recipes/new'),
        },
      ]
    : [];

  const allResults: ResultItem[] = [
    ...filteredRecipes.map((r) => ({
      id: r.id,
      type: 'recipe' as const,
      title: r.title,
      meta: [
        (r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0) > 0
          ? `${(r.prepTimeMinutes ?? 0) + (r.cookTimeMinutes ?? 0)} min`
          : null,
        r.servings ? `${r.servings} pers.` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      action: () => router.push(`/dashboard/recipes/${r.id}`),
    })),
    ...quickActions,
  ];

  const emptyStateResults: ResultItem[] = [...SUGGESTIONS, ...PAGES];

  const activeResults = query.trim() ? allResults : emptyStateResults;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, activeResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = activeResults[selectedIndex];
      if (item) {
        item.action();
        handleClose();
      }
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(42,31,26,0.55)] backdrop-blur-sm" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed top-20 left-1/2 z-50 flex max-h-[600px] w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-[0_28px_64px_rgba(42,31,26,0.18),0_8px_16px_rgba(42,31,26,0.08)] outline-none"
          onKeyDown={handleKeyDown}
        >
          <DialogPrimitive.Title className="sr-only">
            Recherche globale
          </DialogPrimitive.Title>

          {/* Input */}
          <div className="border-neutre-100 flex items-center gap-3 border-b px-5 py-5">
            <Search size={22} className="text-neutre-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Chercher une recette, ingrédient, planning…"
              className="text-neutre-800 placeholder:text-neutre-300 flex-1 bg-transparent font-serif text-2xl outline-none"
            />
            <Kbd>esc</Kbd>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-1">
            {query.trim() ? (
              <>
                {filteredRecipes.length > 0 && (
                  <ResultGroup
                    label={`Recettes · ${filteredRecipes.length} résultat${filteredRecipes.length > 1 ? 's' : ''}`}
                  >
                    {filteredRecipes.map((recipe, i) => {
                      const globalIdx = i;
                      return (
                        <ResultRow
                          key={recipe.id}
                          selected={selectedIndex === globalIdx}
                          onSelect={() => {
                            router.push(`/dashboard/recipes/${recipe.id}`);
                            handleClose();
                          }}
                          onHover={() => setSelectedIndex(globalIdx)}
                          icon={
                            recipe.imageUrl ? (
                              <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <RecipePlaceholder
                                className="h-full w-full"
                                iconSize={12}
                              />
                            )
                          }
                          title={highlightText(recipe.title, query)}
                          meta={
                            [
                              (recipe.prepTimeMinutes ?? 0) +
                                (recipe.cookTimeMinutes ?? 0) >
                              0
                                ? `${(recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)} min`
                                : null,
                              recipe.servings
                                ? `${recipe.servings} pers.`
                                : null,
                            ]
                              .filter(Boolean)
                              .join(' · ') || undefined
                          }
                          action="↩ Ouvrir"
                        />
                      );
                    })}
                  </ResultGroup>
                )}

                {quickActions.length > 0 && (
                  <ResultGroup label="Actions rapides">
                    {quickActions.map((item, i) => {
                      const globalIdx = filteredRecipes.length + i;
                      return (
                        <ResultRow
                          key={item.id}
                          selected={selectedIndex === globalIdx}
                          onSelect={() => {
                            item.action();
                            handleClose();
                          }}
                          onHover={() => setSelectedIndex(globalIdx)}
                          icon={item.icon}
                          title={highlightText(item.title, query)}
                          action="↩"
                        />
                      );
                    })}
                  </ResultGroup>
                )}

                {filteredRecipes.length === 0 && quickActions.length === 0 && (
                  <p className="text-neutre-400 px-5 py-8 text-center text-sm">
                    Aucun résultat pour «&nbsp;{query}&nbsp;»
                  </p>
                )}

                <ResultGroup label="Bibliothèque">
                  <ResultRow
                    selected={false}
                    onSelect={() => {
                      router.push(`/dashboard/library`);
                      handleClose();
                    }}
                    onHover={() => {}}
                    icon={<Book size={16} />}
                    title={
                      <>
                        Voir «&nbsp;
                        <mark className="bg-terracotta-100 text-terracotta-800 rounded-[2px] px-[2px] not-italic">
                          {query}
                        </mark>
                        &nbsp;» dans la bibliothèque
                      </>
                    }
                    action="↩"
                  />
                </ResultGroup>
              </>
            ) : (
              <>
                <ResultGroup label="Suggestions">
                  {SUGGESTIONS.map((item, i) => (
                    <ResultRow
                      key={item.id}
                      selected={selectedIndex === i}
                      onSelect={() => {
                        item.action();
                        handleClose();
                      }}
                      onHover={() => setSelectedIndex(i)}
                      icon={item.icon}
                      title={item.title}
                      meta={item.meta}
                      action="↩"
                    />
                  ))}
                </ResultGroup>

                <ResultGroup label="Pages">
                  {PAGES.map((item, i) => {
                    const globalIdx = SUGGESTIONS.length + i;
                    return (
                      <ResultRow
                        key={item.id}
                        selected={selectedIndex === globalIdx}
                        onSelect={() => {
                          item.action();
                          handleClose();
                        }}
                        onHover={() => setSelectedIndex(globalIdx)}
                        icon={item.icon}
                        title={item.title}
                        action={item.shortcut}
                      />
                    );
                  })}
                </ResultGroup>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-neutre-100 bg-neutre-50 text-neutre-400 flex items-center justify-between border-t px-5 py-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                naviguer
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd>
                ouvrir
              </span>
              <span className="flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>↵</Kbd>
                nouvel onglet
              </span>
            </div>
            <span className="text-terracotta-600 text-[11px] italic">
              {query.trim()
                ? null
                : 'Astuce : essayez « végé rapide » ou « risotto »'}
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

const ResultGroup = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="py-3">
    <p className="text-neutre-500 px-5 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase">
      {label}
    </p>
    {children}
  </div>
);

const ResultRow = ({
  selected,
  onSelect,
  onHover,
  icon,
  title,
  meta,
  action,
}: {
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
  icon?: React.ReactNode;
  title: React.ReactNode;
  meta?: string;
  action?: string;
}) => (
  <button
    onClick={onSelect}
    onMouseEnter={onHover}
    className={cn(
      'relative flex w-full cursor-pointer items-center gap-3 px-5 py-[10px] text-left transition-colors',
      selected ? 'bg-terracotta-50' : 'hover:bg-neutre-50',
    )}
  >
    {selected && (
      <span className="bg-terracotta-500 absolute top-1 bottom-1 left-0 w-[3px] rounded-r-[2px]" />
    )}
    <span
      className={cn(
        'text-neutre-400 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md',
        selected ? 'bg-terracotta-100 text-terracotta-700' : 'bg-neutre-50',
      )}
    >
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="text-neutre-800 block truncate text-sm font-medium">
        {title}
      </span>
      {meta && <span className="text-neutre-400 block text-xs">{meta}</span>}
    </span>
    {action && (
      <span className="text-neutre-400 shrink-0 font-mono text-xs">
        {action}
      </span>
    )}
  </button>
);

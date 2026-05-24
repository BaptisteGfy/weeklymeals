'use client';

import clsx from 'clsx';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Info,
  Plus,
  RotateCcw,
  Share2,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { getPlannedMeals } from '@/actions/planner-actions';
import {
  addManualItem,
  checkAllItems,
  deleteManualItem,
  resetCheckedItems,
  syncShoppingList,
  toggleCheckedItem,
} from '@/actions/shopping-list-actions';
import { getWeekLabel, getWeekStart } from '@/features/planner/utils/date';
import { buildShoppingList } from '@/features/shopping-list/utils/buildShoppingList';
import {
  ingredientCategoryEmojis,
  ingredientCategoryLabels,
} from '@/labels/ingredients';
import { unitLabels } from '@/labels/recipes';
import type { PlannedMeal } from '@/types/planner';
import type {
  IngredientCategory,
  IngredientUnit,
  Recipe,
} from '@/types/recipes';
import type { ShoppingListItem } from '@/types/shopping-list';

// ─── Color theming ────────────────────────────────────────────────────────────

type CategoryTheme = 'olive' | 'terracotta' | 'sable' | 'bordeaux';

const CATEGORY_THEMES: Partial<Record<IngredientCategory, CategoryTheme>> = {
  vegetables: 'olive',
  tubers: 'olive',
  fruits: 'olive',
  legumes: 'olive',
  nuts: 'olive',
  mushrooms: 'olive',
  herbs: 'olive',
  plant_proteins: 'olive',
  meat: 'bordeaux',
  fish: 'bordeaux',
  deli: 'bordeaux',
  shellfish: 'bordeaux',
  dairy: 'sable',
  eggs: 'sable',
};

const getCategoryTheme = (cat: IngredientCategory): CategoryTheme =>
  CATEGORY_THEMES[cat] ?? 'terracotta';

const THEME_COLORS: Record<CategoryTheme, { bg: string; text: string }> = {
  olive: { bg: 'var(--olive-50)', text: 'var(--olive-600)' },
  terracotta: { bg: 'var(--terracotta-50)', text: 'var(--terracotta-600)' },
  sable: { bg: 'var(--sable-50)', text: 'var(--sable-600)' },
  bordeaux: { bg: 'var(--bordeaux-50)', text: 'var(--bordeaux-600)' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatQuantity = (item: ShoppingListItem): string => {
  if (item.unit === 'unit')
    return `${item.quantity} pièce${item.quantity > 1 ? 's' : ''}`;
  return `${item.quantity} ${unitLabels[item.unit]}`;
};

const formatExportLabel = (item: ShoppingListItem): string => {
  if (item.unit === 'unit') return `${item.quantity} ${item.name}`;
  return `${item.quantity} ${unitLabels[item.unit]} de ${item.name}`;
};

const computeRecipeSources = (
  plannedMeals: PlannedMeal[],
  recipes: Recipe[],
): Record<string, string> => {
  const sources: Record<string, Set<string>> = {};
  for (const meal of plannedMeals) {
    const recipe = recipes.find((r) => r.id === meal.recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      if (!sources[ing.name]) sources[ing.name] = new Set();
      sources[ing.name].add(recipe.title);
    }
  }
  return Object.fromEntries(
    Object.entries(sources).map(([name, titles]) => [
      name,
      [...titles].join(', '),
    ]),
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  initialItems: ShoppingListItem[];
  initialPlannedMeals: PlannedMeal[];
  recipes: Recipe[];
};

type AddForm = {
  name: string;
  quantity: string;
  unit: IngredientUnit;
  category: IngredientCategory;
};

const DEFAULT_ADD_FORM: AddForm = {
  name: '',
  quantity: '1',
  unit: 'unit',
  category: 'other',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ShoppingListPageView = ({
  initialItems,
  initialPlannedMeals,
  recipes,
}: Props) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [items, setItems] = useState<ShoppingListItem[]>(initialItems);
  const [plannedMeals, setPlannedMeals] =
    useState<PlannedMeal[]>(initialPlannedMeals);
  const [isPending, startTransition] = useTransition();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCourseMode, setIsCourseMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddForm>(DEFAULT_ADD_FORM);
  const shareRef = useRef<HTMLDivElement>(null);

  const weekStart = getWeekStart(weekOffset);
  const weekLabel = getWeekLabel(weekStart);
  const recipeSources = computeRecipeSources(plannedMeals, recipes);
  const uniqueRecipeCount = new Set(plannedMeals.map((m) => m.recipeId)).size;

  const checkedCount = items.filter((i) => i.isChecked).length;
  const totalCount = items.length;
  const allChecked = totalCount > 0 && checkedCount === totalCount;
  const progressPct =
    totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Close share popover on outside click
  useEffect(() => {
    if (!isShareOpen) return;
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isShareOpen]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatShareText = (): string => {
    const categories = Object.keys(
      ingredientCategoryLabels,
    ) as IngredientCategory[];
    return [
      `Liste de courses — ${weekLabel}`,
      '',
      ...categories
        .filter((cat) => cat !== 'fish')
        .flatMap((cat) => {
          const cats: IngredientCategory[] =
            cat === 'meat' ? ['meat', 'fish'] : [cat];
          const label =
            cat === 'meat'
              ? 'Viandes & Poissons'
              : ingredientCategoryLabels[cat];
          const groupItems = items.filter((i) => cats.includes(i.category));
          if (groupItems.length === 0) return [];
          return [
            label,
            ...groupItems.map(
              (i) => `${i.isChecked ? '✓' : '-'} ${formatExportLabel(i)}`,
            ),
            '',
          ];
        }),
    ].join('\n');
  };

  // ── Actions ───────────────────────────────────────────────────────────────

  const changeWeek = (delta: number) => {
    const newOffset = weekOffset + delta;
    startTransition(async () => {
      const newWeekStart = getWeekStart(newOffset);
      const newMeals = await getPlannedMeals(newWeekStart);
      const computed = buildShoppingList(newMeals, recipes);
      const synced = await syncShoppingList(newWeekStart, computed);
      setPlannedMeals(newMeals);
      setItems(synced);
      setWeekOffset(newOffset);
    });
  };

  const toggle = (name: string) => {
    const current = items.find((i) => i.name === name);
    if (!current) return;
    const newChecked = !current.isChecked;
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, isChecked: newChecked } : i)),
    );
    startTransition(async () => {
      try {
        await toggleCheckedItem(weekStart, name, newChecked);
      } catch {
        toast.error('Hors ligne · sauvegardé localement');
      }
    });
  };

  const handleToggleAll = () => {
    if (allChecked) {
      setItems((prev) => prev.map((i) => ({ ...i, isChecked: false })));
      startTransition(async () => {
        try {
          await resetCheckedItems(weekStart);
        } catch {
          toast.error('Impossible de réinitialiser. Réessaie.');
        }
      });
    } else {
      setItems((prev) => prev.map((i) => ({ ...i, isChecked: true })));
      startTransition(async () => {
        try {
          await checkAllItems(weekStart);
        } catch {
          toast.error('Impossible de tout cocher. Réessaie.');
        }
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatShareText());
      toast.success('Liste copiée !');
    } catch {
      toast.error('Impossible de copier la liste.');
    }
  };

  const handleShare = async () => {
    const text = formatShareText();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Ma liste de courses', text });
      } catch {
        // user cancelled
      }
    } else {
      setIsShareOpen((v) => !v);
    }
  };

  const handleAddItem = () => {
    const name = addForm.name.trim().toLowerCase();
    if (!name) return;
    const qty = parseFloat(addForm.quantity) || 1;
    startTransition(async () => {
      try {
        const newItem = await addManualItem(
          weekStart,
          name,
          qty,
          addForm.unit,
          addForm.category,
        );
        setItems((prev) => [...prev, newItem]);
        setIsAddModalOpen(false);
        setAddForm(DEFAULT_ADD_FORM);
        toast.success('Article ajouté !');
      } catch {
        toast.error(
          "Impossible d'ajouter l'article. Un article avec ce nom existe peut-être déjà.",
        );
      }
    });
  };

  const handleDeleteItem = (name: string) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
    startTransition(async () => {
      try {
        await deleteManualItem(weekStart, name);
      } catch {
        toast.error("Impossible de supprimer l'article.");
      }
    });
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const categoryGroups = (
    Object.keys(ingredientCategoryLabels) as IngredientCategory[]
  )
    .filter((cat) => cat !== 'fish')
    .map((cat) => {
      const cats: IngredientCategory[] =
        cat === 'meat' ? ['meat', 'fish'] : [cat];
      const label =
        cat === 'meat' ? 'Viandes & Poissons' : ingredientCategoryLabels[cat];
      const emoji = ingredientCategoryEmojis[cat];
      const groupItems = items.filter((i) => cats.includes(i.category));
      const theme = getCategoryTheme(cat);
      const colors = THEME_COLORS[theme];
      const doneCount = groupItems.filter((i) => i.isChecked).length;
      return { cat, label, emoji, groupItems, colors, doneCount };
    })
    .filter(({ groupItems }) => groupItems.length > 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Mode courses overlay ── */}
      {isCourseMode && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backgroundColor: 'var(--bordeaux-900)' }}
        >
          {/* Sticky header */}
          <div
            className="sticky top-0 z-10 px-5 pt-8 pb-4"
            style={{ backgroundColor: 'var(--bordeaux-900)' }}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={() => setIsCourseMode(false)}
                className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Quitter
              </button>
              <span className="text-sm text-white/60">
                {checkedCount} / {totalCount} cochés · {progressPct} %
              </span>
            </div>
            <h1 className="font-heading mb-3 text-3xl leading-tight font-semibold text-white">
              Mode{' '}
              <em
                className="not-italic"
                style={{ color: 'var(--terracotta-400)' }}
              >
                courses.
              </em>
            </h1>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: 'var(--terracotta-400)',
                }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="px-5 pt-4 pb-12">
            {categoryGroups.map(({ cat, label, emoji, groupItems }) => (
              <div key={cat} className="mb-6">
                <div className="mb-1 text-xs font-semibold tracking-widest text-white/40 uppercase">
                  {emoji} {label}
                </div>
                {groupItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => toggle(item.name)}
                    className={clsx(
                      'flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition-opacity last:border-0',
                      item.isChecked && 'opacity-40',
                    )}
                  >
                    <span
                      className={clsx(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        item.isChecked
                          ? 'border-transparent'
                          : 'border-white/40',
                      )}
                      style={
                        item.isChecked
                          ? {
                              backgroundColor: 'var(--terracotta-400)',
                              borderColor: 'var(--terracotta-400)',
                            }
                          : {}
                      }
                    >
                      {item.isChecked && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </span>
                    <span
                      className={clsx(
                        'flex-1 text-lg font-medium capitalize',
                        item.isChecked
                          ? 'text-white/50 line-through'
                          : 'text-white',
                      )}
                    >
                      {item.name}
                    </span>
                    <span className="shrink-0 text-right text-base text-white/60 tabular-nums">
                      {formatQuantity(item)}
                    </span>
                    {item.isManual && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.name);
                        }}
                        className="shrink-0 cursor-pointer text-white/30 transition-colors hover:text-white/70"
                        role="button"
                        title="Supprimer"
                      >
                        <X className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add article modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-foreground font-semibold">
                Ajouter un article
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setAddForm(DEFAULT_ADD_FORM);
                }}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="text-foreground mb-1.5 block text-sm font-medium">
                  Nom
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  placeholder="ex : sel de guérande"
                  className="border-input focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={addForm.quantity}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, quantity: e.target.value }))
                    }
                    className="border-input focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-foreground mb-1.5 block text-sm font-medium">
                    Unité
                  </label>
                  <select
                    value={addForm.unit}
                    onChange={(e) =>
                      setAddForm((f) => ({
                        ...f,
                        unit: e.target.value as IngredientUnit,
                      }))
                    }
                    className="border-input focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  >
                    {(
                      Object.entries(unitLabels) as [IngredientUnit, string][]
                    ).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-foreground mb-1.5 block text-sm font-medium">
                  Rayon
                </label>
                <select
                  value={addForm.category}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      category: e.target.value as IngredientCategory,
                    }))
                  }
                  className="border-input focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {(
                    Object.entries(ingredientCategoryLabels) as [
                      IngredientCategory,
                      string,
                    ][]
                  ).map(([key, label]) => (
                    <option key={key} value={key}>
                      {ingredientCategoryEmojis[key]} {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setAddForm(DEFAULT_ADD_FORM);
                }}
                className="text-muted-foreground hover:text-foreground rounded-lg px-4 py-2 text-sm transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddItem}
                disabled={!addForm.name.trim() || isPending}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--terracotta-500)' }}
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main page ── */}
      <div className="px-6 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">
              {weekLabel}
            </p>
            <h1 className="font-heading text-foreground mb-1.5 text-3xl leading-tight font-semibold">
              Ma liste de{' '}
              <em className="text-terracotta-500 not-italic">courses</em>.
            </h1>
            <p className="text-muted-foreground text-sm">
              Générée depuis votre planning. Cochez au fur et à mesure.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Share button with popover */}
            <div className="relative" ref={shareRef}>
              <button
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </button>
              {isShareOpen && (
                <div className="absolute top-full right-0 z-20 mt-1.5 min-w-47.5 overflow-hidden rounded-xl border bg-white shadow-lg">
                  <button
                    onClick={() => {
                      handleCopy();
                      setIsShareOpen(false);
                    }}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm transition-colors"
                  >
                    <ClipboardCopy className="text-muted-foreground h-4 w-4" />
                    Copier la liste
                  </button>
                  <button
                    onClick={() => {
                      window.open(
                        `mailto:?subject=${encodeURIComponent('Ma liste de courses')}&body=${encodeURIComponent(formatShareText())}`,
                      );
                      setIsShareOpen(false);
                    }}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2.5 border-t px-4 py-3 text-left text-sm transition-colors"
                  >
                    <span className="text-base leading-none">✉️</span>
                    Envoyer par email
                  </button>
                  <button
                    onClick={() => {
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(formatShareText())}`,
                      );
                      setIsShareOpen(false);
                    }}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2.5 border-t px-4 py-3 text-left text-sm transition-colors"
                  >
                    <span className="text-base leading-none">💬</span>
                    WhatsApp
                  </button>
                </div>
              )}
            </div>

            {totalCount > 0 && (
              <button
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-colors"
              >
                <ClipboardCopy className="h-4 w-4" />
                Copier
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </button>

            <button
              onClick={() => setIsCourseMode(true)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: 'var(--terracotta-500)' }}
            >
              <ShoppingCart className="h-4 w-4" />
              Mode courses
            </button>
          </div>
        </div>

        {/* Week navigation */}
        <div className="mb-6 flex items-center gap-1">
          <button
            onClick={() => changeWeek(-1)}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-muted-foreground text-sm">
            {weekLabel}
            {uniqueRecipeCount > 0 && (
              <>
                {' · '}
                {uniqueRecipeCount} recette{uniqueRecipeCount > 1 ? 's' : ''}{' '}
                planifi{uniqueRecipeCount > 1 ? 'ées' : 'ée'}
              </>
            )}
          </span>
          <button
            onClick={() => changeWeek(1)}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Main content */}
        {totalCount === 0 ? (
          <div className="text-muted-foreground py-16 text-center text-sm">
            Aucun repas planifié cette semaine.
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_280px] items-start gap-6">
            {/* Categories */}
            <div
              className={clsx(
                'space-y-4',
                isPending && 'opacity-60 transition-opacity',
              )}
            >
              {categoryGroups.map(
                ({ cat, label, emoji, groupItems, colors, doneCount }) => (
                  <div
                    key={cat}
                    className="overflow-hidden rounded-xl border bg-white shadow-sm"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                          style={{
                            background: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {emoji}
                        </span>
                        <span className="text-foreground text-sm font-semibold">
                          {label}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {doneCount} / {groupItems.length} cochés
                      </span>
                    </div>

                    {/* Items */}
                    <ul className="divide-border divide-y border-t">
                      {groupItems.map((item) => {
                        const source = recipeSources[item.name];
                        return (
                          <li
                            key={item.name}
                            className={clsx(
                              'transition-colors',
                              item.isChecked && 'bg-black/2',
                            )}
                          >
                            <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                              <input
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={() => toggle(item.name)}
                                className="text-primary h-4 w-4 shrink-0 cursor-pointer rounded"
                              />
                              <div className="min-w-0 flex-1">
                                <p
                                  className={clsx(
                                    'text-sm capitalize',
                                    item.isChecked
                                      ? 'text-muted-foreground line-through'
                                      : 'text-foreground',
                                  )}
                                >
                                  {item.name}
                                </p>
                                {source && !item.isManual && (
                                  <p className="text-muted-foreground/70 mt-0.5 text-xs">
                                    depuis {source}
                                  </p>
                                )}
                                {item.isManual && (
                                  <p className="text-muted-foreground/70 mt-0.5 text-xs">
                                    Ajouté manuellement
                                  </p>
                                )}
                              </div>
                              <span
                                className={clsx(
                                  'shrink-0 text-right text-sm tabular-nums',
                                  item.isChecked
                                    ? 'text-muted-foreground/60'
                                    : 'text-muted-foreground',
                                )}
                              >
                                {formatQuantity(item)}
                              </span>
                              {item.isManual && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteItem(item.name);
                                  }}
                                  className="text-muted-foreground shrink-0 transition-colors hover:text-red-500"
                                  title="Supprimer cet article"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ),
              )}
            </div>

            {/* Summary aside */}
            <aside className="sticky top-4 rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="text-foreground mb-4 text-sm font-semibold">
                Récap
              </h3>

              <div className="space-y-2.5">
                {[
                  { label: 'Total articles', value: totalCount },
                  { label: 'Déjà cochés', value: checkedCount },
                  { label: 'Restants', value: totalCount - checkedCount },
                  { label: 'Recettes couvertes', value: uniqueRecipeCount },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="text-foreground font-semibold">
                    {progressPct}%
                  </span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="bg-neutre-50 mt-5 rounded-xl p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <Info className="text-muted-foreground h-4 w-4" />
                  <span className="text-foreground text-xs font-semibold">
                    Astuce
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Activez le « Mode courses » pour un affichage optimisé sur
                  téléphone.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {totalCount > 0 && (
                  <button
                    onClick={handleToggleAll}
                    className={clsx(
                      'flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      allChecked
                        ? 'text-muted-foreground hover:text-foreground border'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                  >
                    {allChecked ? (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Tout décocher
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Tout cocher
                      </>
                    )}
                  </button>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
};

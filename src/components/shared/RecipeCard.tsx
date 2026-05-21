'use client';

import {
  BookMarked,
  Clock,
  MoreHorizontal,
  Plus,
  User,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';
import { categoryLabels } from '@/labels/recipes';
import { cn } from '@/lib/utils';
import type { Recipe, RecipeCategory } from '@/types/recipes';

const categoryTokens: Record<RecipeCategory, string> = {
  breakfast: 'bg-sky-100 text-sky-700',
  lunch: 'bg-olive-100 text-olive-700',
  dinner: 'bg-terracotta-100 text-terracotta-700',
  dessert: 'bg-sable-200 text-sable-700',
};

type RecipeBadge = {
  label: string;
  variant: 'library' | 'user';
};

type RecipeCardVariant = 'card' | 'compact' | 'mini';

interface RecipeCardProps {
  recipe: Pick<
    Recipe,
    | 'id'
    | 'title'
    | 'description'
    | 'category'
    | 'servings'
    | 'prepTimeMinutes'
    | 'cookTimeMinutes'
    | 'imageUrl'
  >;
  variant?: RecipeCardVariant;
  onDelete?: (id: string) => void;
  badge?: RecipeBadge;
  onSave?: () => void;
  isSaved?: boolean;
  className?: string;
}

export const RecipeCard = ({
  recipe,
  variant = 'card',
  onDelete,
  badge,
  onSave,
  isSaved,
  className,
}: RecipeCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  const handleSave = () => {
    startTransition(() => {
      onSave?.();
    });
  };

  // ── Mini : thumbnail gauche + titre droite (listes, RecipePickerModal) ──
  if (variant === 'mini') {
    return (
      <Link
        href={`/dashboard/recipes/${recipe.id}`}
        className="border-neutre-100 hover:bg-sable-50 flex items-center gap-3 rounded-lg border bg-white p-2 transition-colors"
      >
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <RecipePlaceholder className="h-full w-full" iconSize={16} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-neutre-800 truncate text-sm font-medium">
            {recipe.title}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-xs font-medium',
                categoryTokens[recipe.category as RecipeCategory],
              )}
            >
              {categoryLabels[recipe.category as RecipeCategory]}
            </span>
            {totalTime > 0 && (
              <span className="text-neutre-400 flex items-center gap-1 text-xs">
                <Clock size={10} />
                {totalTime} min
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // ── Compact : image + titre + temps, sans actions (suggestions) ──
  if (variant === 'compact') {
    return (
      <Link
        href={`/dashboard/recipes/${recipe.id}`}
        className={cn(
          'group border-neutre-100 block overflow-hidden rounded-xl border bg-white shadow-xs transition-shadow hover:shadow-sm',
          className,
        )}
      >
        <div className="relative h-32 w-full overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <RecipePlaceholder className="h-full w-full" iconSize={24} />
          )}
        </div>
        <div className="p-3">
          <p className="text-neutre-800 line-clamp-2 text-sm leading-snug font-semibold">
            {recipe.title}
          </p>
          {totalTime > 0 && (
            <p className="text-neutre-400 mt-1 flex items-center gap-1 text-xs">
              <Clock size={10} />
              {totalTime} min
            </p>
          )}
        </div>
      </Link>
    );
  }

  // ── Card : format complet (bibliothèque, mes recettes) ──
  return (
    <article
      className={cn(
        'group border-neutre-100 relative overflow-hidden rounded-xl border bg-white shadow-xs transition-shadow hover:shadow-sm',
        className,
      )}
    >
      {/* Action button — top-right overlay */}
      <div className="absolute top-2 right-2 z-10">
        {onSave ? (
          <button
            onClick={handleSave}
            disabled={isPending}
            title={
              isSaved ? 'Retirer de mes recettes' : 'Ajouter à mes recettes'
            }
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors',
              isSaved
                ? 'bg-terracotta-600 hover:bg-bordeaux-600 text-white'
                : 'text-neutre-600 bg-white/80 hover:bg-white',
            )}
          >
            {isSaved ? <BookMarked size={14} /> : <Plus size={16} />}
          </button>
        ) : (
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white">
                  <MoreHorizontal size={16} className="text-neutre-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/dashboard/recipes/${recipe.id}`)}
                >
                  Voir la recette
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/dashboard/recipes/${recipe.id}?edit=true`)
                  }
                >
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete?.(recipe.id)}
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <Link href={`/dashboard/recipes/${recipe.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <RecipePlaceholder className="h-full w-full" />
          )}

          {badge && (
            <Badge
              variant={
                badge.variant === 'library' ? 'source-library' : 'source-user'
              }
              className="absolute right-0 bottom-0 h-auto rounded-none rounded-tl-lg px-2.5 py-1"
            >
              {badge.variant === 'library' ? (
                <UtensilsCrossed size={10} />
              ) : (
                <User size={10} />
              )}
              {badge.label}
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-neutre-800 leading-snug font-semibold">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="text-neutre-500 mt-1 line-clamp-2 text-sm">
              {recipe.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                categoryTokens[recipe.category as RecipeCategory],
              )}
            >
              {categoryLabels[recipe.category as RecipeCategory]}
            </span>
            {totalTime > 0 && (
              <span className="text-neutre-400 flex items-center gap-1 text-xs">
                <Clock size={11} />
                {totalTime} min
              </span>
            )}
            <span className="text-neutre-400 flex items-center gap-1 text-xs">
              <Users size={11} />
              {recipe.servings} pers
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

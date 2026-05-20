'use client';

import {
  BookMarked,
  Clock,
  MoreHorizontal,
  Plus,
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
import { categoryLabels } from '@/labels/recipes';
import type { Recipe, RecipeCategory } from '@/types/recipes';

type RecipeBadge = {
  label: string;
  variant: 'library' | 'user';
};

type Props = {
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
  variant?: 'card' | 'mini';
  onDelete?: (id: string) => void;
  // Props bibliothèque
  badge?: RecipeBadge;
  onSave?: () => void;
  isSaved?: boolean;
};

export const RecipeCard = ({
  recipe,
  variant = 'card',
  onDelete,
  badge,
  onSave,
  isSaved,
}: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  const handleSave = () => {
    startTransition(() => {
      onSave?.();
    });
  };

  if (variant === 'mini') {
    return (
      <Link
        href={`/dashboard/recipes/${recipe.id}`}
        className="hover:bg-accent/10 flex items-center gap-3 rounded-lg border p-2 transition-colors"
      >
        <div className="bg-accent/20 h-12 w-12 shrink-0 overflow-hidden rounded-md">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed size={20} className="text-primary/25" />
            </div>
          )}
        </div>
        <span className="text-sm font-medium">{recipe.title}</span>
      </Link>
    );
  }

  return (
    <article className="group bg-card relative overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      {/* Bouton action en haut à droite */}
      <div className="absolute top-2 right-2 z-10">
        {onSave ? (
          // Mode bibliothèque : bouton rond +
          <button
            onClick={handleSave}
            disabled={isPending}
            title={
              isSaved ? 'Retirer de mes recettes' : 'Ajouter à mes recettes'
            }
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors ${
              isSaved
                ? 'bg-primary text-primary-foreground hover:bg-destructive hover:text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            {isSaved ? <BookMarked size={14} /> : <Plus size={16} />}
          </button>
        ) : (
          // Mode mes recettes : menu 3 points
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white">
                  <MoreHorizontal size={16} />
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
        <div className="from-card to-accent/20 relative h-48 w-full bg-linear-to-br">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UtensilsCrossed size={48} className="text-primary/25" />
            </div>
          )}

          {/* Bannière source en bas à droite de l'image */}
          {badge && (
            <Badge
              variant={badge.variant === 'library' ? 'source-library' : 'source-user'}
              className="absolute right-0 bottom-0 rounded-none rounded-tl-lg h-auto py-1 px-2.5"
            >
              {badge.variant === 'library' && <BookMarked size={10} />}
              {badge.label}
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-foreground font-semibold">{recipe.title}</h3>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
            {recipe.description}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Badge variant={recipe.category as RecipeCategory}>
              {categoryLabels[recipe.category as RecipeCategory]}
            </Badge>
            {totalTime > 0 && (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Clock size={12} />
                {totalTime} min
              </span>
            )}
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Users size={12} />
              {recipe.servings} pers
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

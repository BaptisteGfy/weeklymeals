'use client';

import { Clock, MoreHorizontal, Users, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  categoryBadgeStyles,
  categoryLabels,
} from '@/features/recipes/constants';
import type { Recipe } from '@/features/recipes/types';

type Props = {
  recipe: Recipe;
  onDelete: (id: string) => void;
};

export const RecipeCard = ({ recipe, onDelete }: Props) => {
  const router = useRouter();
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  return (
    <article className="group bg-card relative overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
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
              onClick={() => onDelete(recipe.id)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        </div>

        <div className="p-4">
          <h3 className="text-foreground font-semibold">{recipe.title}</h3>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
            {recipe.description}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadgeStyles[recipe.category]}`}
            >
              {categoryLabels[recipe.category]}
            </span>
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

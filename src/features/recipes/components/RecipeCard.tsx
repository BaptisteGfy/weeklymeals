import clsx from 'clsx';
import Link from 'next/link';

import { categoryLabels } from '../constants';
import type { Recipe } from '../types';

type Props = {
  recipe: Recipe;
  onDelete: (id: string) => void;
};

const cardButtonStyles =
  'inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition';

export const RecipeCard = ({ recipe, onDelete }: Props) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="h-48 w-full bg-gray-100">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-gray-300">
            🍽️
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {recipe.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
            <span>{categoryLabels[recipe.category]}</span>
            <span>·</span>
            <span>{recipe.servings} portions</span>
            <span>·</span>
            <span>{recipe.prepTimeMinutes} min</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/dashboard/recipes/${recipe.id}`}
            className={clsx(
              cardButtonStyles,
              'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
            )}
          >
            Voir
          </Link>
          <Link
            href={`/dashboard/recipes/${recipe.id}?edit=true`}
            className={clsx(
              cardButtonStyles,
              'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50',
            )}
          >
            Éditer
          </Link>
          <button
            onClick={() => onDelete(recipe.id)}
            className={clsx(
              cardButtonStyles,
              'border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50',
            )}
          >
            Supprimer
          </button>
        </div>
      </div>
    </article>
  );
};

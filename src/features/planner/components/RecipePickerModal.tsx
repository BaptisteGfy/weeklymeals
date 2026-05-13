'use client';

import { useState } from 'react';

import type { Recipe } from '@/features/recipes/types';

type Props = {
  recipes: Recipe[];
  subtitle?: string;
  onSelectRecipe: (recipeId: string) => void;
  onClose: () => void;
};

export const RecipePickerModal = ({
  recipes,
  subtitle,
  onSelectRecipe,
  onClose,
}: Props) => {
  const [search, setSearch] = useState('');

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Choisir une recette</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Fermer
          </button>
        </div>

        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          autoFocus
        />

        <div className="mt-3 max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune recette trouvée.</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((recipe) => (
                <li key={recipe.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRecipe(recipe.id)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm transition hover:bg-slate-50"
                  >
                    {recipe.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

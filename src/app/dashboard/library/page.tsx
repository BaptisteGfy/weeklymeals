import { Library } from 'lucide-react';

import {
  getLibraryRecipes,
  saveRecipe,
  unsaveRecipe,
} from '@/actions/library-actions';
import { LibraryView } from '@/features/library/components/LibraryView';

export default async function LibraryPage() {
  const { recipes, savedRecipeIds } = await getLibraryRecipes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-foreground text-2xl font-semibold">
          Bibliothèque
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {recipes.length} recette{recipes.length > 1 ? 's' : ''} disponible
          {recipes.length > 1 ? 's' : ''}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Library className="text-muted-foreground/40 mb-4 h-12 w-12" />
          <p className="text-muted-foreground text-sm">
            Aucune recette dans la bibliothèque pour l&apos;instant.
          </p>
        </div>
      ) : (
        <LibraryView
          recipes={recipes}
          savedRecipeIds={savedRecipeIds}
          onSave={saveRecipe}
          onUnsave={unsaveRecipe}
        />
      )}
    </div>
  );
}

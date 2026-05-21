import { Plus } from 'lucide-react';
import Link from 'next/link';

import {
  getLibraryRecipes,
  saveRecipe,
  unsaveRecipe,
} from '@/actions/library-actions';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { LibraryView } from '@/features/library/components/LibraryView';

export default async function LibraryPage() {
  const { recipes, savedRecipeIds } = await getLibraryRecipes();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <PageHeader
        eyebrow={`Bibliothèque · ${recipes.length} recette${recipes.length > 1 ? 's' : ''}`}
        title={
          <>
            Une <em>idée</em> pour chaque envie.
          </>
        }
        description="Filtrez, explorez, sauvegardez ce qui vous fait envie."
        actions={
          <Button asChild>
            <Link href="/dashboard/recipes/new">
              <Plus size={16} />
              Créer une recette
            </Link>
          </Button>
        }
      />

      <LibraryView
        recipes={recipes}
        savedRecipeIds={savedRecipeIds}
        onSave={saveRecipe}
        onUnsave={unsaveRecipe}
      />
    </div>
  );
}

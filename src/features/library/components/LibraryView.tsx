'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { LibraryRecipe } from '@/actions/library-actions';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';

type Props = {
  recipes: LibraryRecipe[];
  savedRecipeIds: string[];
  onSave: (recipeId: string) => Promise<void>;
  onUnsave: (recipeId: string) => Promise<void>;
};

export const LibraryView = ({
  recipes,
  savedRecipeIds,
  onSave,
  onUnsave,
}: Props) => {
  const router = useRouter();

  const handleToggle = async (recipeId: string, isSaved: boolean) => {
    if (isSaved) {
      await onUnsave(recipeId);
      toast.success('Recette retirée de votre collection');
    } else {
      await onSave(recipeId);
      toast.success('Recette ajoutée à vos recettes !');
    }
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => {
        const isSaved = savedRecipeIds.includes(recipe.id);
        return (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSaved={isSaved}
            onSave={() => handleToggle(recipe.id, isSaved)}
            badge={
              recipe.isLibrary
                ? { label: 'WeeklyMeals', variant: 'library' }
                : { label: recipe.authorName ?? 'Utilisateur', variant: 'user' }
            }
          />
        );
      })}
    </div>
  );
};

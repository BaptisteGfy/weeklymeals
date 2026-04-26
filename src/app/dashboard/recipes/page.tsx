'use client';

import { useDashboard } from '@/context/DashboardContext';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { RecipeForm } from '@/features/recipes/components/RecipeForm';

const RecipesPage = () => {
  const {
    recipeList,
    editingRecipe,
    editingFormValues,
    handleDeleteRecipe,
    handleEditRecipe,
    handleCancelEdit,
    handleSubmitRecipe,
  } = useDashboard();

  return (
    <div className="mx-auto max-w-4xl p-6">
      <RecipeForm
        key={editingRecipe?.id ?? 'create'}
        onSubmit={handleSubmitRecipe}
        onCancel={handleCancelEdit}
        initialValues={editingFormValues}
        isEditing={Boolean(editingRecipe)}
      />

      <h1 className="mb-6 text-center text-3xl font-bold">Mes recettes</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipeList.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={handleDeleteRecipe}
            onEdit={handleEditRecipe}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;

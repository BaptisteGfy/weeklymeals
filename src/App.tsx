import { useState } from 'react';
import { RecipeCard } from './features/recipes/components/RecipeCard';
import {
  RecipeForm,
  type RecipeFormValues,
} from './features/recipes/components/RecipeForm';
import { recipes } from './features/recipes/data';
import type { Recipe } from './features/recipes/types';

function App() {
  const [recipeList, setRecipeList] = useState<Recipe[]>(recipes);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipeList((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
  };

  const handleSubmitRecipe = (values: RecipeFormValues) => {
    if (editingRecipe) {
      setRecipeList((prev) =>
        prev.map((recipe) =>
          recipe.id === editingRecipe.id
            ? {
                ...recipe,
                ...values,
              }
            : recipe,
        ),
      );

      setEditingRecipe(null);
      return;
    }

    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      ...values,
      instructions: [],
    };

    setRecipeList((prev) => [...prev, newRecipe]);
  };

  const editingFormValues: RecipeFormValues | undefined = editingRecipe
    ? {
        title: editingRecipe.title,
        description: editingRecipe.description,
        servings: editingRecipe.servings,
        prepTimeMinutes: editingRecipe.prepTimeMinutes,
        category: editingRecipe.category,
        ingredients: editingRecipe.ingredients,
      }
    : undefined;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">WeeklyMeals</h1>

      <RecipeForm
        key={editingRecipe?.id ?? 'create'}
        onSubmit={handleSubmitRecipe}
        onCancel={handleCancelEdit}
        initialValues={editingFormValues}
        isEditing={Boolean(editingRecipe)}
      />

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Recettes</h2>

        <div className="grid gap-4">
          {recipeList.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDeleteRecipe}
              onEdit={handleEditRecipe}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
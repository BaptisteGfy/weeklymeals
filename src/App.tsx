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

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipeList((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  };

  const handleCreateRecipe = (values: RecipeFormValues) => {
    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      ...values,
      ingredients: [],
      instructions: [],
    };
    setRecipeList((prev) => [...prev, newRecipe]);
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">WeeklyMeals</h1>

      <RecipeForm onSubmit={handleCreateRecipe} />

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Recettes</h2>

        <div className="grid gap-4">
          {recipeList.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;

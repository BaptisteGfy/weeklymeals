import { useState } from 'react';
import { RecipeCard } from './features/recipes/components/RecipeCard';
import { recipes } from './features/recipes/data';
import type { Recipe, RecipeCategory } from './features/recipes/types';

type RecipeFormValues = {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  category: RecipeCategory;
};

const initialFormValues: RecipeFormValues = {
  title: '',
  description: '',
  servings: 1,
  prepTimeMinutes: 10,
  category: 'dinner',
};

function App() {
  const [recipeList, setRecipeList] = useState<Recipe[]>(recipes);
  const [formValues, setFormValues] =
    useState<RecipeFormValues>(initialFormValues);

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipeList((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === 'servings' || name === 'prepTimeMinutes'
          ? Number(value)
          : value,
    }));
  };

  const handleCreateRecipe = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      ...formValues,
      ingredients: [],
      instructions: [],
    };

    setRecipeList((prev) => [...prev, newRecipe]);
    setFormValues(initialFormValues);
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">WeeklyMeals</h1>

      <section className="mb-8 rounded-xl border p-4 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Ajouter une recette</h2>

        <form className="grid gap-4" onSubmit={handleCreateRecipe}>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="title">
              Titre
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleInputChange}
              className="rounded-md border px-3 py-2 text-sm"
              placeholder="Ex : Gratin de pâtes"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              className="min-h-24 rounded-md border px-3 py-2 text-sm"
              placeholder="Décris rapidement la recette"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="servings">
                Portions
              </label>
              <input
                id="servings"
                name="servings"
                type="number"
                min="1"
                value={formValues.servings}
                onChange={handleInputChange}
                className="rounded-md border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="prepTimeMinutes">
                Préparation (min)
              </label>
              <input
                id="prepTimeMinutes"
                name="prepTimeMinutes"
                type="number"
                min="1"
                value={formValues.prepTimeMinutes}
                onChange={handleInputChange}
                className="rounded-md border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="category">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleInputChange}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="breakfast">Petit-déjeuner</option>
                <option value="lunch">Déjeuner</option>
                <option value="dinner">Dîner</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Ajouter la recette
            </button>
          </div>
        </form>
      </section>

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

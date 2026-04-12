import { recipes } from './features/recipes/data';
import type { IngredientUnit, RecipeCategory } from './features/recipes/types';

const categoryLabels: Record<RecipeCategory, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  dessert: 'Dessert',
};

const unitLabels: Record<IngredientUnit, string> = {
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  cac: 'cuillère à café',
  cas: 'cuillère à soupe',
  unit: 'pièce',
};

function App() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">WeeklyMeals</h1>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Recettes</h2>

        <div className="grid gap-4">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="rounded-xl border p-4 shadow-sm"
            >
              <h3 className="text-xl font-semibold">{recipe.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{recipe.description}</p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span>Catégorie : {categoryLabels[recipe.category]}</span>
                <span>Portions : {recipe.servings}</span>
                <span>Préparation : {recipe.prepTimeMinutes} min</span>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Ingrédients</h4>
                <ul className="mt-2 list-inside list-disc text-sm">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      {ingredient.name} — {ingredient.quantity}{' '}
                      {unitLabels[ingredient.unit]}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;

import {RecipeCard} from './features/recipes/components/RecipeCard';
import { recipes } from './features/recipes/data';

function App() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">WeeklyMeals</h1>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Recettes</h2>

        <div className="grid gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;

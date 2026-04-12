import type { IngredientUnit, Recipe, RecipeCategory } from '../types';

type Props = {
  recipe: Recipe;
};

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

export const RecipeCard = ({ recipe }: Props) => {
  return (
    <article className="rounded-xl border p-4 shadow-sm">
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
  );
};

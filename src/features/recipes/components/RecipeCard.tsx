import { categoryLabels, type Recipe, unitLabels } from '../types';

type Props = {
  recipe: Recipe;
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
};

export const RecipeCard = ({ recipe, onDelete, onEdit }: Props) => {
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

        <div className="mt-4">
          <h4 className="font-medium">Instructions</h4>

          {recipe.instructions.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">
              Aucune instruction renseignée.
            </p>
          ) : (
            <ol className="mt-2 list-inside list-decimal text-sm">
              {recipe.instructions.map((step) => (
                <li key={step.id}>{step.text}</li>
              ))}
            </ol>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(recipe)}
            className="inline-flex items-center gap-2 rounded-md border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
          >
            ✏️ Éditer
          </button>

          <button
            onClick={() => onDelete(recipe.id)}
            className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </article>
  );
};

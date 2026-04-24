import { type Ingredient, type IngredientUnit, unitLabels } from '../types';

type IngredientDraft = {
  name: string;
  quantity: number;
  unit: IngredientUnit;
};

type Props = {
  ingredients: Ingredient[];
  ingredientValues: IngredientDraft;
  onIngredientInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onAddIngredient: () => void;
  onDeleteIngredient: (ingredientId: string) => void;
};

export function IngredientSection({
  ingredients,
  ingredientValues,
  onIngredientInputChange,
  onAddIngredient,
  onDeleteIngredient,
}: Props) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold">Ingrédients</h3>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="ingredient-name">
            Nom
          </label>
          <input
            id="ingredient-name"
            name="name"
            type="text"
            value={ingredientValues.name}
            onChange={onIngredientInputChange}
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Ex : Farine"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="ingredient-quantity">
            Quantité
          </label>
          <input
            id="ingredient-quantity"
            name="quantity"
            type="number"
            min="1"
            value={ingredientValues.quantity}
            onChange={onIngredientInputChange}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="ingredient-unit">
            Unité
          </label>
          <select
            id="ingredient-unit"
            name="unit"
            value={ingredientValues.unit}
            onChange={onIngredientInputChange}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="cac">Cuillère à café</option>
            <option value="cas">Cuillère à soupe</option>
            <option value="unit">Pièce</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onAddIngredient}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="mt-4">
        {ingredients.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucun ingrédient ajouté pour le moment.
          </p>
        ) : (
          <ul className="grid gap-2">
            {ingredients.map((ingredient) => (
              <li
                key={ingredient.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span>
                  {ingredient.name} — {ingredient.quantity}{' '}
                  {unitLabels[ingredient.unit]}
                </span>

                <button
                  type="button"
                  onClick={() => onDeleteIngredient(ingredient.id)}
                  className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

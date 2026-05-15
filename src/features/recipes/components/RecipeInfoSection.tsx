import clsx from 'clsx';

import { categoryLabels } from '@/labels/recipes';
import { Recipe, RecipeFormValues } from '@/types/recipes';

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 10;

type Props = {
  recipe: Recipe;
  formValues: RecipeFormValues;
  isEditing: boolean;
  handleFieldChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  targetServings: number;
  onTargetServingsChange: (n: number) => void;
  error?: {
    title?: string;
    description?: string;
    servings?: string;
  };
};

export const RecipeInfoSection = ({
  recipe,
  formValues,
  isEditing,
  handleFieldChange,
  targetServings,
  onTargetServingsChange,
  error,
}: Props) => {
  return (
    <>
      <div className="mt-6">
        {isEditing ? (
          <div>
            <input
              name="title"
              value={formValues.title}
              onChange={handleFieldChange}
              aria-label="Titre de la recette"
              aria-invalid={!!error?.title}
              aria-describedby={error?.title ? 'title-error' : undefined}
              className={clsx(
                'w-full rounded-md border px-3 py-2 text-3xl font-bold focus:ring-2 focus:outline-none',
                error?.title
                  ? 'border-red-400 focus:ring-red-200'
                  : 'focus:ring-blue-200',
              )}
            />
            {error?.title && (
              <p
                id="title-error"
                role="alert"
                className="mt-1 text-sm text-red-500"
              >
                {error.title}
              </p>
            )}
          </div>
        ) : (
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
        )}

        <div className="mt-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {isEditing ? (
              <>
                <select
                  name="category"
                  value={formValues.category}
                  onChange={handleFieldChange}
                  className="rounded-md border px-2 py-1 text-sm"
                >
                  <option value="breakfast">Petit-déjeuner</option>
                  <option value="lunch">Déjeuner</option>
                  <option value="dinner">Dîner</option>
                  <option value="dessert">Dessert</option>
                </select>
                <span>·</span>
                <input
                  name="servings"
                  type="number"
                  min="1"
                  value={formValues.servings}
                  onChange={handleFieldChange}
                  aria-label="Nombre de portions"
                  aria-invalid={!!error?.servings}
                  aria-describedby={
                    error?.servings ? 'servings-error' : undefined
                  }
                  className={clsx(
                    'w-16 rounded-md border px-2 py-1 text-sm',
                    error?.servings && 'border-red-400',
                  )}
                />
                <span>portions ·</span>
                <input
                  name="prepTimeMinutes"
                  type="number"
                  min="1"
                  value={formValues.prepTimeMinutes}
                  onChange={handleFieldChange}
                  aria-label="Temps de préparation en minutes"
                  className="w-16 rounded-md border px-2 py-1 text-sm"
                />
                <span>min</span>
              </>
            ) : (
              <>
                <span>{categoryLabels[recipe.category]}</span>
                <span>·</span>
                <span>{recipe.prepTimeMinutes} min</span>
              </>
            )}
          </div>
          {isEditing && error?.servings && (
            <p
              id="servings-error"
              role="alert"
              className="mt-1 text-sm text-red-500"
            >
              {error.servings}
            </p>
          )}

          {!isEditing && (
            <div className="mt-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Portions :</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onTargetServingsChange(
                        Math.max(MIN_SERVINGS, targetServings - 1),
                      )
                    }
                    disabled={targetServings <= MIN_SERVINGS}
                    className="flex h-7 w-7 items-center justify-center rounded-md border text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {targetServings}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onTargetServingsChange(
                        Math.min(MAX_SERVINGS, targetServings + 1),
                      )
                    }
                    disabled={targetServings >= MAX_SERVINGS}
                    className="flex h-7 w-7 items-center justify-center rounded-md border text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
              {targetServings !== recipe.servings && (
                <p className="mt-2 text-xs text-amber-600">
                  Recette originale prévue pour {recipe.servings} portion
                  {recipe.servings > 1 ? 's' : ''}. Les épices, le sel et les
                  levures peuvent nécessiter un ajustement.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isEditing ? (
          <div>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleFieldChange}
              rows={3}
              aria-label="Description de la recette"
              aria-invalid={!!error?.description}
              aria-describedby={
                error?.description ? 'description-error' : undefined
              }
              className={clsx(
                'w-full rounded-md border px-3 py-2 text-sm leading-relaxed text-gray-600 focus:ring-2 focus:outline-none',
                error?.description
                  ? 'border-red-400 focus:ring-red-200'
                  : 'focus:ring-blue-200',
              )}
            />
            {error?.description && (
              <p
                id="description-error"
                role="alert"
                className="mt-1 text-sm text-red-500"
              >
                {error.description}
              </p>
            )}
          </div>
        ) : (
          recipe.description && (
            <p className="leading-relaxed text-gray-600">
              {recipe.description}
            </p>
          )
        )}
      </div>
    </>
  );
};

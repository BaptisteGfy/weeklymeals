'use client';

import {
  Calendar,
  Clock,
  Flame,
  Leaf,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { categoryLabels } from '@/labels/recipes';
import { cn } from '@/lib/utils';
import type { Recipe, RecipeCategory, RecipeFormValues } from '@/types/recipes';

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
  onPublicToggle?: (value: boolean) => void;
  targetServings: number;
  onTargetServingsChange: (n: number) => void;
  onStartEditing?: () => void;
  onDelete?: () => void;
  onOpenPlanningModal?: () => void;
  error?: { title?: string; description?: string; servings?: string };
};

export const RecipeInfoSection = ({
  recipe,
  formValues,
  isEditing,
  handleFieldChange,
  onPublicToggle,
  targetServings,
  onTargetServingsChange,
  onStartEditing,
  onDelete,
  onOpenPlanningModal,
  error,
}: Props) => {
  const totalTime =
    (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  const metaStats = [
    {
      icon: <Clock size={12} />,
      label: 'Temps',
      value: totalTime > 0 ? `${totalTime} min` : '—',
    },
    { icon: <Flame size={12} />, label: 'Difficulté', value: '—' },
    {
      icon: <Users size={12} />,
      label: 'Portions',
      value: String(recipe.servings),
    },
    { icon: <Leaf size={12} />, label: 'Calories', value: '—' },
  ];

  return (
    <div className="pt-3">
      {/* Eyebrow — category */}
      {isEditing ? (
        <select
          name="category"
          value={formValues.category}
          onChange={handleFieldChange}
          className="border-neutre-200 text-terracotta-600 mb-3 w-fit rounded-md border px-2 py-1 text-[11px] font-semibold tracking-wider uppercase"
        >
          <option value="breakfast">Petit-déjeuner</option>
          <option value="lunch">Déjeuner</option>
          <option value="dinner">Dîner</option>
          <option value="dessert">Dessert</option>
        </select>
      ) : (
        <p className="text-terracotta-600 mb-3 text-[11px] font-semibold tracking-wider uppercase">
          {categoryLabels[recipe.category as RecipeCategory]}
        </p>
      )}

      {/* Title — 56px, font-normal */}
      {isEditing ? (
        <div className="mb-5">
          <input
            name="title"
            value={formValues.title}
            onChange={handleFieldChange}
            aria-label="Titre de la recette"
            aria-invalid={!!error?.title}
            placeholder="Nom de la recette"
            className={cn(
              'text-neutre-800 w-full border-0 border-b-2 border-dashed bg-transparent font-serif text-[56px] leading-none font-normal tracking-[-0.025em] focus:outline-none',
              error?.title
                ? 'border-bordeaux-400'
                : 'border-terracotta-300 focus:border-terracotta-500',
            )}
          />
          {error?.title && (
            <p role="alert" className="text-bordeaux-500 mt-1 text-xs">
              {error.title}
            </p>
          )}
        </div>
      ) : (
        <h1 className="text-neutre-800 mb-5 font-serif text-[56px] leading-none font-normal tracking-[-0.025em]">
          {recipe.title}
        </h1>
      )}

      {/* Lede — serif italic, text-md (18px) */}
      {isEditing ? (
        <div className="mb-6">
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleFieldChange}
            rows={2}
            aria-label="Description"
            aria-invalid={!!error?.description}
            placeholder="Une courte description…"
            className={cn(
              'text-neutre-500 w-full resize-none border-0 border-b border-dashed bg-transparent font-serif text-lg leading-relaxed italic focus:outline-none',
              error?.description
                ? 'border-bordeaux-400'
                : 'border-terracotta-200 focus:border-terracotta-400',
            )}
          />
          {error?.description && (
            <p role="alert" className="text-bordeaux-500 mt-1 text-xs">
              {error.description}
            </p>
          )}
        </div>
      ) : (
        recipe.description && (
          <p className="text-neutre-500 mb-6 font-serif text-lg leading-relaxed italic">
            « {recipe.description} »
          </p>
        )
      )}

      {/* Tags row — scaffold, only render div when editing */}
      {isEditing && (
        <div className="mb-7 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="border-terracotta-300 text-terracotta-600 hover:bg-terracotta-50 flex items-center gap-1 rounded-full border border-dashed px-2.5 py-0.75 text-xs font-medium transition-colors"
          >
            <Plus size={10} />
            Ajouter un tag
          </button>
        </div>
      )}

      {/* Meta grid — 4 cells, gap-4 */}
      <div className="border-neutre-100 mb-6 grid grid-cols-4 gap-4 rounded-xl border bg-white p-5">
        {metaStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-neutre-400 mb-2 flex items-center justify-center gap-1 text-[11px] font-semibold tracking-wider uppercase">
              {stat.icon}
              {stat.label}
            </div>
            <div className="text-neutre-800 font-serif text-3xl leading-none">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Servings — view mode */}
      {!isEditing && (
        <div className="border-neutre-100 mb-6 flex items-center justify-between rounded-xl border bg-white px-5 py-4">
          <span className="text-neutre-500 text-sm">
            Ajuster les quantités pour
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onTargetServingsChange(
                  Math.max(MIN_SERVINGS, targetServings - 1),
                )
              }
              disabled={targetServings <= MIN_SERVINGS}
              className="border-neutre-200 text-neutre-600 hover:bg-sable-50 flex h-8 w-8 items-center justify-center rounded-full border text-lg transition-colors disabled:opacity-40"
            >
              −
            </button>
            <span className="text-neutre-800 min-w-10 text-center font-serif text-2xl">
              {targetServings} pers.
            </span>
            <button
              type="button"
              onClick={() =>
                onTargetServingsChange(
                  Math.min(MAX_SERVINGS, targetServings + 1),
                )
              }
              disabled={targetServings >= MAX_SERVINGS}
              className="border-neutre-200 text-neutre-600 hover:bg-sable-50 flex h-8 w-8 items-center justify-center rounded-full border text-lg transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Edit mode — servings + times */}
      {isEditing && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-neutre-500 w-20 text-sm">Portions</label>
            <input
              name="servings"
              type="number"
              min="1"
              value={formValues.servings}
              onChange={handleFieldChange}
              aria-invalid={!!error?.servings}
              className={cn(
                'border-neutre-200 w-20 rounded-lg border px-2 py-1.5 text-sm focus:outline-none',
                error?.servings && 'border-bordeaux-400',
              )}
            />
            {error?.servings && (
              <p role="alert" className="text-bordeaux-500 text-xs">
                {error.servings}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              {
                name: 'prepTimeMinutes',
                label: 'Prép.',
                value: formValues.prepTimeMinutes,
              },
              {
                name: 'cookTimeMinutes',
                label: 'Cuisson',
                value: formValues.cookTimeMinutes,
              },
              {
                name: 'restTimeMinutes',
                label: 'Repos',
                value: formValues.restTimeMinutes,
              },
            ].map((f) => (
              <div key={f.name} className="flex items-center gap-2">
                <label className="text-neutre-500 text-xs">{f.label}</label>
                <input
                  name={f.name}
                  type="number"
                  min="0"
                  value={f.value ?? ''}
                  onChange={handleFieldChange}
                  placeholder="—"
                  className="border-neutre-200 w-16 rounded-lg border px-2 py-1 text-sm focus:outline-none"
                />
                <span className="text-neutre-400 text-xs">min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Servings scaling disclaimer */}
      {!isEditing && targetServings !== recipe.servings && (
        <p className="text-neutre-400 -mt-3 mb-5 text-xs">
          Recette originale pour {recipe.servings} pers. — ajustez les épices au
          goût.
        </p>
      )}

      {/* CTAs */}
      {!isEditing ? (
        <div className="flex gap-3">
          {onOpenPlanningModal && (
            <button
              type="button"
              onClick={onOpenPlanningModal}
              className="bg-terracotta-500 hover:bg-terracotta-600 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors"
            >
              <Calendar size={16} />
              Ajouter au planning
            </button>
          )}
          <button
            type="button"
            className="border-neutre-200 text-neutre-600 hover:bg-sable-50 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
          >
            🛒 Liste de courses
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* isPublic toggle */}
          <div className="border-neutre-100 bg-sable-50 flex items-center justify-between rounded-xl border px-4 py-3">
            <div>
              <p className="text-neutre-700 text-sm font-medium">
                Partager dans la bibliothèque
              </p>
              <p className="text-neutre-400 text-xs">
                Visible par tous les utilisateurs
              </p>
            </div>
            <Switch
              checked={formValues.isPublic}
              onCheckedChange={onPublicToggle}
            />
          </div>
          {/* Delete */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="border-bordeaux-200 text-bordeaux-600 hover:bg-bordeaux-50 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors"
            >
              <Trash2 size={15} />
              Supprimer la recette
            </button>
          )}
        </div>
      )}

      {/* Edit entry point — view mode */}
      {!isEditing && !recipe.isSaved && onStartEditing && (
        <button
          type="button"
          onClick={onStartEditing}
          className="text-neutre-400 hover:text-neutre-600 mt-4 self-start text-xs underline underline-offset-2 transition-colors"
        >
          ✏ Modifier la recette
        </button>
      )}
    </div>
  );
};

'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { unitLabels, unitShortLabels } from '@/labels/recipes';
import { cn } from '@/lib/utils';
import { Ingredient, IngredientDraft, IngredientUnit } from '@/types/recipes';

const formatQuantity = (value: number): string => {
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
};

const INITIAL_DRAFT: IngredientDraft = { name: '', quantity: 1, unit: 'unit' };

type Props = {
  isEditing: boolean;
  ingredients: Ingredient[];
  ingredientGroups: string[];
  scalingMultiplier?: number;
  targetServings?: number;
  handleIngredientChange: (
    id: string,
    field: keyof Omit<Ingredient, 'id'>,
    value: string | number | IngredientUnit,
  ) => void;
  handleAddIngredient: (draft: IngredientDraft, group?: string) => void;
  handleDeleteIngredient: (id: string) => void;
  handleAddGroup: (name: string) => void;
  handleRenameGroup: (oldName: string, newName: string) => void;
  handleDeleteGroup: (name: string) => void;
  error?: string;
};

// ── Ingredient row ──────────────────────────────────────────────────────────

type IngredientRowProps = {
  ingredient: Ingredient;
  isEditing: boolean;
  scalingMultiplier: number;
  onFieldChange: (
    id: string,
    field: keyof Omit<Ingredient, 'id'>,
    value: string | number | IngredientUnit,
  ) => void;
  onDelete: (id: string) => void;
};

const IngredientRow = ({
  ingredient,
  isEditing,
  scalingMultiplier,
  onFieldChange,
  onDelete,
}: IngredientRowProps) => {
  if (!isEditing) {
    return (
      <li className="flex items-baseline justify-between py-2">
        <span className="text-neutre-700 text-sm">{ingredient.name}</span>
        <span className="text-neutre-400 ml-4 shrink-0 font-mono text-xs">
          {formatQuantity(ingredient.quantity * scalingMultiplier)}{' '}
          {unitLabels[ingredient.unit]}
        </span>
      </li>
    );
  }

  return (
    <li className="group py-2">
      {/* Line 1 — name full width */}
      <input
        value={ingredient.name}
        onChange={(e) => onFieldChange(ingredient.id, 'name', e.target.value)}
        className="border-neutre-200 text-neutre-700 w-full rounded-full border px-3 py-1 text-sm focus:outline-none"
      />

      {/* Line 2 — qty + unit left, delete right */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <input
          type="number"
          min="0"
          value={ingredient.quantity}
          onChange={(e) =>
            onFieldChange(ingredient.id, 'quantity', Number(e.target.value))
          }
          className="border-neutre-200 w-16 rounded-lg border px-2 py-1 text-right text-sm focus:outline-none"
        />
        <select
          value={ingredient.unit}
          onChange={(e) =>
            onFieldChange(
              ingredient.id,
              'unit',
              e.target.value as IngredientUnit,
            )
          }
          className="border-neutre-200 w-20 rounded-lg border px-1 py-1 text-sm focus:outline-none"
        >
          {(Object.keys(unitLabels) as IngredientUnit[]).map((u) => (
            <option key={u} value={u}>
              {unitShortLabels[u]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onDelete(ingredient.id)}
          className="text-neutre-300 hover:text-bordeaux-500 ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </li>
  );
};

// ── Draft row (add ingredient) ───────────────────────────────────────────────

type DraftRowProps = {
  group?: string;
  onAdd: (draft: IngredientDraft, group?: string) => void;
};

const DraftRow = ({ group, onAdd }: DraftRowProps) => {
  const [draft, setDraft] = useState<IngredientDraft>(INITIAL_DRAFT);

  const submit = () => {
    if (!draft.name.trim()) return;
    onAdd(draft, group);
    setDraft(INITIAL_DRAFT);
  };

  return (
    <div className="mt-3 space-y-1.5">
      {/* Line 1 — name full width */}
      <input
        value={draft.name}
        onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submit())}
        placeholder="Nouvel ingrédient…"
        className="border-neutre-200 text-neutre-700 placeholder:text-neutre-300 w-full rounded-full border px-3 py-1.5 text-sm focus:outline-none"
      />
      {/* Line 2 — qty + unit */}
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min="0"
          value={draft.quantity}
          onChange={(e) =>
            setDraft((p) => ({ ...p, quantity: Number(e.target.value) }))
          }
          className="border-neutre-200 w-16 rounded-lg border px-2 py-1 text-right text-sm focus:outline-none"
        />
        <select
          value={draft.unit}
          onChange={(e) =>
            setDraft((p) => ({ ...p, unit: e.target.value as IngredientUnit }))
          }
          className="border-neutre-200 w-20 rounded-lg border px-1 py-1 text-sm focus:outline-none"
        >
          {(Object.keys(unitLabels) as IngredientUnit[]).map((u) => (
            <option key={u} value={u}>
              {unitShortLabels[u]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={submit}
        className="border-terracotta-300 text-terracotta-600 hover:bg-terracotta-50 inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-sm font-medium transition-colors"
      >
        <Plus size={13} />
        Ajouter un ingrédient
      </button>
    </div>
  );
};

// ── Group section ────────────────────────────────────────────────────────────

type GroupSectionProps = {
  name: string;
  ingredients: Ingredient[];
  isEditing: boolean;
  scalingMultiplier: number;
  onFieldChange: IngredientRowProps['onFieldChange'];
  onDelete: (id: string) => void;
  onAddIngredient: (draft: IngredientDraft, group?: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onDeleteGroup: (name: string) => void;
};

const GroupSection = ({
  name,
  ingredients,
  isEditing,
  scalingMultiplier,
  onFieldChange,
  onDelete,
  onAddIngredient,
  onRename,
  onDeleteGroup,
}: GroupSectionProps) => {
  const [localName, setLocalName] = useState(name);

  const commitRename = () => {
    if (localName.trim() && localName.trim() !== name) {
      onRename(name, localName.trim());
    } else {
      setLocalName(name);
    }
  };

  return (
    <div className="mb-5">
      {/* Group header */}
      {isEditing ? (
        <div className="border-neutre-200 group/header mb-2 flex items-center gap-2 rounded-lg border border-dashed px-3 py-1.5">
          <input
            value={localName}
            onChange={(e) => setLocalName(e.target.value.toUpperCase())}
            onBlur={commitRename}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), commitRename())
            }
            className="text-neutre-400 min-w-0 flex-1 bg-transparent text-[11px] font-semibold tracking-wider uppercase focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onDeleteGroup(name)}
            className="text-neutre-300 hover:text-bordeaux-500 opacity-0 transition-all group-hover/header:opacity-100"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className="border-neutre-100 mb-3 border-b pb-1">
          <span className="text-neutre-400 text-[11px] font-semibold tracking-wider uppercase">
            {name}
          </span>
        </div>
      )}

      {/* Ingredients */}
      <ul className={cn('divide-neutre-100 divide-y', isEditing && 'pl-2')}>
        {ingredients.map((ing) => (
          <IngredientRow
            key={ing.id}
            ingredient={ing}
            isEditing={isEditing}
            scalingMultiplier={scalingMultiplier}
            onFieldChange={onFieldChange}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {isEditing && (
        <div className="pl-2">
          <DraftRow group={name} onAdd={onAddIngredient} />
        </div>
      )}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────

export const IngredientsSection = ({
  isEditing,
  ingredients,
  ingredientGroups,
  scalingMultiplier = 1,
  targetServings,
  handleIngredientChange,
  handleAddIngredient,
  handleDeleteIngredient,
  handleAddGroup,
  handleRenameGroup,
  handleDeleteGroup,
  error,
}: Props) => {
  const [newGroupDraft, setNewGroupDraft] = useState('');
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const ungrouped = ingredients.filter((i) => !i.group);
  const hasGroups = ingredientGroups.length > 0;

  const submitNewGroup = () => {
    if (newGroupDraft.trim()) {
      handleAddGroup(newGroupDraft.trim().toUpperCase());
    }
    setNewGroupDraft('');
    setIsAddingGroup(false);
  };

  return (
    <div className="border-neutre-100 flex h-full flex-col rounded-xl border bg-white p-5">
      <h2 className="text-terracotta-600 mb-2 font-serif text-3xl font-normal italic">
        Ingrédients
      </h2>

      {!isEditing && targetServings && (
        <p className="text-neutre-400 mb-4 text-sm">
          Pour {targetServings} personne{targetServings > 1 ? 's' : ''}
        </p>
      )}

      {/* Ungrouped ingredients */}
      {ungrouped.length > 0 && (
        <ul className="divide-neutre-100 divide-y">
          {ungrouped.map((ing) => (
            <IngredientRow
              key={ing.id}
              ingredient={ing}
              isEditing={isEditing}
              scalingMultiplier={scalingMultiplier}
              onFieldChange={handleIngredientChange}
              onDelete={handleDeleteIngredient}
            />
          ))}
        </ul>
      )}

      {/* Add ingredient — ungrouped, only when no groups exist */}
      {isEditing && !hasGroups && <DraftRow onAdd={handleAddIngredient} />}

      {/* Named groups */}
      {hasGroups && (
        <div className={cn(ungrouped.length > 0 && 'mt-5')}>
          {ingredientGroups.map((groupName) => (
            <GroupSection
              key={groupName}
              name={groupName}
              ingredients={ingredients.filter((i) => i.group === groupName)}
              isEditing={isEditing}
              scalingMultiplier={scalingMultiplier}
              onFieldChange={handleIngredientChange}
              onDelete={handleDeleteIngredient}
              onAddIngredient={handleAddIngredient}
              onRename={handleRenameGroup}
              onDeleteGroup={handleDeleteGroup}
            />
          ))}
        </div>
      )}

      {/* Add group */}
      {isEditing && (
        <div className="mt-3">
          {isAddingGroup ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={newGroupDraft}
                onChange={(e) => setNewGroupDraft(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    submitNewGroup();
                  }
                  if (e.key === 'Escape') {
                    setNewGroupDraft('');
                    setIsAddingGroup(false);
                  }
                }}
                onBlur={submitNewGroup}
                placeholder="ex. MARINADE"
                className="border-neutre-200 text-neutre-500 placeholder:text-neutre-300 min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase focus:outline-none"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingGroup(true)}
              className="border-terracotta-300 text-terracotta-600 hover:bg-terracotta-50 w-full rounded-lg border border-dashed px-3 py-2 text-sm font-medium transition-colors"
            >
              + Nouveau groupe (ex. « marinade »)
            </button>
          )}
        </div>
      )}

      {isEditing && error && (
        <p role="alert" className="text-bordeaux-500 mt-3 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};

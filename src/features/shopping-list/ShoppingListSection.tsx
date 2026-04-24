import type { PlannedMeal } from '../planner/types';
import type { Recipe } from '../recipes/types';
import { buildShoppingList } from './utils';

type Props = {
  plannedMeals: PlannedMeal[];
  recipes: Recipe[];
};

export const ShoppingListSection = ({ recipes, plannedMeals }: Props) => {
  const shoppinglist = buildShoppingList(plannedMeals, recipes);
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-semibold">Liste de courses</h2>
      {shoppinglist.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun ingrédient</p>
      ) : (
        <ul className="mt-2 list-inside list-disc text-sm">
          {shoppinglist.map((item) => (
            <li key={item.id}>
              {item.quantity} {item.unit} de {item.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

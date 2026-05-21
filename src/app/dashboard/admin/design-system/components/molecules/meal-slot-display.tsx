import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { MealSlot } from '@/components/shared/MealSlot';

export const MealSlotDisplay = () => (
  <Block title="MealSlot">
    <div className="flex max-w-xs flex-col gap-2">
      <MealSlot
        type="main"
        course="Plat principal"
        recipeName="Risotto champignons & thym"
        href="/dashboard/recipes/1"
        portions={4}
      />
      <MealSlot
        type="veggie"
        course="Entrée"
        recipeName="Salade lentilles, feta"
        href="/dashboard/recipes/2"
      />
      <MealSlot
        type="meat"
        course="Plat principal"
        recipeName="Poulet rôti aux herbes"
        href="/dashboard/recipes/3"
        portions={2}
      />
      <MealSlot
        type="breakfast"
        recipeName="Granola maison"
        href="/dashboard/recipes/4"
      />
    </div>
  </Block>
);

import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { ShoppingCategoryHeader } from '@/components/shared/ShoppingCategoryHeader';

export const ShoppingCategoryHeaderDisplay = () => (
  <Block title="ShoppingCategoryHeader">
    <div className="border-neutre-100 max-w-sm rounded-xl border bg-white p-4">
      <div className="divide-neutre-100 flex flex-col divide-y">
        <ShoppingCategoryHeader
          emoji="🥦"
          label="Légumes & fruits"
          checked={3}
          total={6}
        />
        <ShoppingCategoryHeader
          emoji="🥩"
          label="Viandes & poissons"
          checked={0}
          total={3}
        />
        <ShoppingCategoryHeader
          emoji="🧀"
          label="Produits laitiers"
          checked={2}
          total={2}
        />
        <ShoppingCategoryHeader
          emoji="🧴"
          label="Épicerie"
          checked={5}
          total={8}
        />
      </div>
    </div>
  </Block>
);

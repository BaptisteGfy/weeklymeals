import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const SectionHeaderDisplay = () => (
  <Block title="SectionHeader">
    <div className="border-neutre-100 flex max-w-lg flex-col gap-4 rounded-xl border bg-white p-6">
      <SectionHeader title="Votre semaine" href="/dashboard/planner" />
      <SectionHeader title="Suggestions pour vous" href="/dashboard/library" />
      <SectionHeader
        title="Liste de courses"
        href="/dashboard/shopping"
        linkLabel="Voir tout"
      />
      <SectionHeader title="Sans lien" />
    </div>
  </Block>
);

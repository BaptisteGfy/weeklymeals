import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { Logo } from '@/components/ui/logo';
import { RecipePlaceholder } from '@/components/ui/recipe-placeholder';

export const IdentityDisplay = () => (
  <div className="space-y-8">
    <Block title="Logo — mark + wordmark">
      <div className="flex flex-wrap items-center gap-8">
        <div className="space-y-2">
          <p className="text-neutre-400 text-xs">Mark seul</p>
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="mark" />
            <Logo size="md" variant="mark" />
            <Logo size="lg" variant="mark" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-neutre-400 text-xs">Full — sm / md / lg</p>
          <div className="flex flex-col gap-3">
            <Logo size="sm" variant="full" />
            <Logo size="md" variant="full" />
            <Logo size="lg" variant="full" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-neutre-400 text-xs">Sur fond sombre</p>
          <div className="bg-neutre-800 flex items-center gap-4 rounded-xl px-6 py-4">
            <Logo size="md" variant="full" className="[&_span]:text-white" />
          </div>
        </div>
      </div>
    </Block>

    <Block title="RecipePlaceholder — image par défaut des recettes">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <p className="text-neutre-400 text-xs">Petite (card)</p>
          <RecipePlaceholder className="h-24 w-36 rounded-xl" iconSize={20} />
        </div>
        <div className="space-y-1">
          <p className="text-neutre-400 text-xs">Moyenne (liste)</p>
          <RecipePlaceholder className="h-32 w-48 rounded-xl" iconSize={28} />
        </div>
        <div className="space-y-1">
          <p className="text-neutre-400 text-xs">Grande (détail)</p>
          <RecipePlaceholder className="h-48 w-72 rounded-xl" iconSize={40} />
        </div>
      </div>
    </Block>
  </div>
);

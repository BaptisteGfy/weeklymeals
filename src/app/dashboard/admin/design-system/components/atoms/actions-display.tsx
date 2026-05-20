import { Bell, Plus, Trash2 } from 'lucide-react';

import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { Button } from '@/components/ui/button';

export const ActionsDisplay = () => (
  <div className="space-y-8">
    <Block title="Button — variants">
      <div className="flex flex-wrap gap-3">
        <Button variant="default">Ajouter au planning</Button>
        <Button variant="secondary">Voir la semaine</Button>
        <Button variant="outline">Filtres avancés</Button>
        <Button variant="ghost">Annuler</Button>
        <Button variant="destructive">Supprimer</Button>
      </div>
    </Block>

    <Block title="Button — tailles">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Petit</Button>
        <Button size="default">Défaut</Button>
        <Button size="lg">Grand</Button>
      </div>
    </Block>

    <Block title="Button — états">
      <div className="flex flex-wrap gap-3">
        <Button disabled>Désactivé</Button>
        <Button variant="outline" disabled>
          Outline désactivé
        </Button>
      </div>
    </Block>

    <Block title="IconButton — Button size=icon">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="icon" variant="default">
          <Plus size={16} />
        </Button>
        <Button size="icon" variant="outline">
          <Bell size={16} />
        </Button>
        <Button size="icon" variant="ghost">
          <Trash2 size={16} />
        </Button>
        <Button size="icon" variant="destructive">
          <Trash2 size={16} />
        </Button>
      </div>
    </Block>

    <Block title="Link — texte terracotta">
      <div className="flex flex-wrap gap-6">
        <a
          href="#"
          className="text-terracotta-600 text-sm underline-offset-4 hover:underline"
        >
          Retour à mes recettes
        </a>
        <a
          href="#"
          className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium"
        >
          Voir le planning complet →
        </a>
        <a
          href="#"
          className="text-neutre-500 hover:text-neutre-700 text-sm underline-offset-4 hover:underline"
        >
          Lien neutre
        </a>
      </div>
    </Block>
  </div>
);

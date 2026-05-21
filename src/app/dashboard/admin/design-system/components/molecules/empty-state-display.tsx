import {
  BookOpen,
  Calendar,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react';

import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';

export const EmptyStateDisplay = () => (
  <Block title="EmptyState">
    <div className="grid grid-cols-2 gap-6">
      <div className="border-neutre-100 rounded-xl border bg-white">
        <EmptyState
          icon={UtensilsCrossed}
          title={
            <>
              Constituez votre{' '}
              <em className="text-terracotta-600">répertoire</em> de famille.
            </>
          }
          description="Ajoutez les recettes que vous refaites souvent, celles transmises par votre famille, ou sauvegardez celles de la bibliothèque."
          actions={
            <>
              <Button size="sm">+ Créer ma première recette</Button>
              <Button size="sm" variant="outline">
                Parcourir la bibliothèque
              </Button>
            </>
          }
        />
      </div>

      <div className="border-neutre-100 rounded-xl border bg-white">
        <EmptyState
          icon={BookOpen}
          title={
            <>
              Aucune recette ne <em className="text-terracotta-600">colle</em> à
              vos filtres.
            </>
          }
          description="Essayez d'autres filtres ou explorez toute la bibliothèque."
          actions={
            <Button size="sm" variant="outline">
              Réinitialiser les filtres
            </Button>
          }
        />
      </div>

      <div className="border-neutre-100 rounded-xl border bg-white">
        <EmptyState
          icon={Calendar}
          title={
            <>
              Votre semaine est <em className="text-terracotta-600">vierge.</em>
            </>
          }
          description="Commencez à planifier vos repas pour générer votre liste de courses."
          actions={<Button size="sm">Ajouter un repas</Button>}
        />
      </div>

      <div className="border-neutre-100 rounded-xl border bg-white">
        <EmptyState
          icon={ShoppingCart}
          title={
            <>
              Pas encore de <em className="text-terracotta-600">liste.</em>
            </>
          }
          description="Planifiez des repas pour générer automatiquement votre liste de courses."
        />
      </div>
    </div>
  </Block>
);

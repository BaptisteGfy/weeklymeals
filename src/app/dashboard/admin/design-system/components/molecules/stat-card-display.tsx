import { BookOpen, Calendar, ShoppingCart, Users } from 'lucide-react';

import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { StatCard } from '@/components/shared/StatCard';

export const StatCardDisplay = () => (
  <div className="space-y-8">
    <Block title="Default">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Repas planifiés"
          value={11}
          delta="cette semaine"
          icon={Calendar}
        />
        <StatCard
          label="Articles à acheter"
          value={23}
          delta="dans la liste"
          icon={ShoppingCart}
        />
        <StatCard label="Mes recettes" value={7} icon={BookOpen} />
        <StatCard label="Membres du foyer" value={4} icon={Users} />
      </div>
    </Block>

    <Block title="Colorées">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Repas cuisinés"
          value={142}
          delta="+12 ce mois"
          variant="terracotta"
          icon={Calendar}
        />
        <StatCard
          label="Temps économisé"
          value="-31h"
          delta="vs mois dernier"
          variant="olive"
        />
        <StatCard label="Recettes testées" value={63} variant="terracotta" />
        <StatCard
          label="Dépenses estimées"
          value="€48"
          delta="-€8 vs semaine dernière"
          variant="olive"
          icon={ShoppingCart}
        />
      </div>
    </Block>

    <Block title="Sans icône">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Juste valeur" value={63} />
        <StatCard
          label="Valeur texte"
          value="3h 20min"
          delta="temps moyen / recette"
        />
        <StatCard label="Grand nombre" value="1 204" delta="+32 ce mois" />
        <StatCard label="Montant" value="€48" />
      </div>
    </Block>
  </div>
);

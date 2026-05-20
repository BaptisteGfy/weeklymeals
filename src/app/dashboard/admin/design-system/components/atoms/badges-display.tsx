'use client';

import { useState } from 'react';

import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { Badge } from '@/components/ui/badge';
import { CountBadge } from '@/components/ui/count-badge';
import { DayChip } from '@/components/ui/day-chip';
import { FilterChip } from '@/components/ui/filter-chip';
import { MealTypeBadge } from '@/components/ui/meal-type-badge';

const FILTERS = [
  'Tout',
  'De saison',
  'Végétarien',
  'Sans gluten',
  'Rapide',
  'Réconfort',
];
const DAYS = [
  { label: 'LUN', date: 19 },
  { label: 'MAR', date: 20 },
  { label: 'MER', date: 21 },
  { label: 'JEU', date: 22 },
  { label: 'VEN', date: 23 },
  { label: 'SAM', date: 24 },
  { label: 'DIM', date: 25 },
];

export const BadgesDisplay = () => {
  const [activeFilter, setActiveFilter] = useState('Tout');
  const [activeDay, setActiveDay] = useState('JEU');

  return (
    <div className="space-y-8">
      <Block title="Badge — variants shadcn">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </div>
      </Block>

      <Block title="Badge — catégories repas">
        <div className="flex flex-wrap gap-2">
          <Badge variant="dinner">Dîner</Badge>
          <Badge variant="lunch">Déjeuner</Badge>
          <Badge variant="dessert">Dessert</Badge>
          <Badge variant="breakfast">Petit-déj.</Badge>
        </div>
      </Block>

      <Block title="Badge — source bibliothèque">
        <div className="flex flex-wrap gap-2">
          <Badge variant="source-library">WeeklyMeals</Badge>
          <Badge variant="source-user">Baptiste</Badge>
        </div>
      </Block>

      <Block title="FilterChip — pills togglables (bibliothèque)">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <FilterChip
              key={f}
              label={f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            />
          ))}
        </div>
      </Block>

      <Block title="DayChip — sélecteur de jour (modale planning)">
        <div className="flex gap-2">
          {DAYS.map((d) => (
            <DayChip
              key={d.label}
              label={d.label}
              date={d.date}
              active={activeDay === d.label}
              onClick={() => setActiveDay(d.label)}
            />
          ))}
        </div>
      </Block>

      <Block title="MealTypeBadge — indicateur type repas (planning)">
        <div className="flex flex-wrap gap-3">
          <MealTypeBadge
            type="veggie"
            course="PLAT"
            name="Curry de pois chiches"
          />
          <MealTypeBadge type="main" course="PLAT" name="Risotto champignons" />
          <MealTypeBadge type="meat" course="ENTRÉE" name="Carottes râpées" />
          <MealTypeBadge
            type="breakfast"
            course="P-DÉJ."
            name="Porridge avoine"
          />
        </div>
      </Block>

      <Block title="CountBadge — compteur sur nav / cloche">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-neutre-600 text-sm">Liste de courses</span>
            <CountBadge count={14} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutre-600 text-sm">Notifications</span>
            <CountBadge count={3} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutre-600 text-sm">Dépassement</span>
            <CountBadge count={150} max={99} />
          </div>
        </div>
      </Block>

      <Block title="Tags recette — pills olive">
        <div className="flex flex-wrap gap-2">
          {[
            'Végétarien',
            'De saison',
            'Sans gluten',
            'Rapide',
            'Réconfort',
            'Épicé',
            'Sans lactose',
          ].map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-olive-50 px-2.5 py-0.5 text-xs font-medium text-olive-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </Block>
    </div>
  );
};

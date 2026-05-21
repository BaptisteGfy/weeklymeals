import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const AVATARS = [
  { initials: 'MD', bg: 'bg-terracotta-500' },
  { initials: 'JD', bg: 'bg-olive-500' },
  { initials: 'LM', bg: 'bg-sable-500' },
  { initials: 'TG', bg: 'bg-bordeaux-500' },
];

export const FeedbackDisplay = () => (
  <div className="space-y-8">
    <Block title="Avatar — initiales colorées">
      <div className="flex flex-wrap items-center gap-3">
        {AVATARS.map(({ initials, bg }) => (
          <Avatar key={initials}>
            <AvatarFallback className={`${bg} text-sm font-medium text-white`}>
              {initials}
            </AvatarFallback>
          </Avatar>
        ))}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-neutre-200 text-neutre-600 text-xs">
            +2
          </AvatarFallback>
        </Avatar>
      </div>
    </Block>

    <Block title="Progress — barre de progression">
      <div className="max-w-sm space-y-4">
        <div className="space-y-1.5">
          <div className="text-neutre-500 flex justify-between text-xs">
            <span>Liste de courses</span>
            <span>8 / 23 articles</span>
          </div>
          <Progress value={35} className="h-2" />
        </div>
        <div className="space-y-1.5">
          <div className="text-neutre-500 flex justify-between text-xs">
            <span>Repas planifiés</span>
            <span>11 / 14</span>
          </div>
          <Progress value={78} className="h-2" />
        </div>
        <div className="space-y-1.5">
          <p className="text-neutre-500 text-xs">Onboarding étape 2/4</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= 2 ? 'bg-terracotta-500' : 'bg-neutre-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Block>

    <Block title="Skeleton — états de chargement">
      <div className="max-w-sm space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </Block>

    <Block title="Separator — séparateur horizontal">
      <div className="max-w-xs space-y-4">
        <Separator />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-neutre-400 text-xs">Ou</span>
          <Separator className="flex-1" />
        </div>
      </div>
    </Block>

    <Block title="Eyebrow — label uppercase tracké">
      <div className="space-y-2">
        <Eyebrow color="terracotta">Bibliothèque — 1 248 recettes</Eyebrow>
        <Eyebrow color="olive">De saison · mai 2026</Eyebrow>
        <Eyebrow color="neutre">Admin — privé</Eyebrow>
      </div>
    </Block>
  </div>
);

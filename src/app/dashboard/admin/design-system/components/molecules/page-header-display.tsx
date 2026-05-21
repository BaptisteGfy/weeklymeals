import { Plus } from 'lucide-react';

import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export const PageHeaderDisplay = () => (
  <div className="space-y-8">
    <Block title="Avec eyebrow + actions">
      <div className="border-neutre-100 rounded-xl border bg-white p-6">
        <PageHeader
          eyebrow="0 recette pour l'instant"
          title={
            <>
              Mes <em className="text-terracotta-600">recettes.</em>
            </>
          }
          description="Vos créations, vos traditions, vos recettes de famille — tout sur vous, tout vous appartient."
          actions={
            <>
              <Button variant="outline" size="sm">
                Importer
              </Button>
              <Button size="sm">
                <Plus size={14} />
                Nouvelle recette
              </Button>
            </>
          }
        />
      </div>
    </Block>

    <Block title="Titre seul">
      <div className="border-neutre-100 rounded-xl border bg-white p-6">
        <PageHeader
          title={
            <>
              Une <em className="text-terracotta-600">idée</em> pour chaque
              envie.
            </>
          }
        />
      </div>
    </Block>

    <Block title="Avec eyebrow, sans actions">
      <div className="border-neutre-100 rounded-xl border bg-white p-6">
        <PageHeader
          eyebrow="Semaine du 19 au 25 mai"
          title={
            <>
              Mon <em className="text-terracotta-600">planning.</em>
            </>
          }
          description="Planifiez vos repas et générez votre liste de courses en un clic."
        />
      </div>
    </Block>
  </div>
);

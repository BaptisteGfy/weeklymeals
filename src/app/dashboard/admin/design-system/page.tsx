'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ActionsDisplay } from './components/atoms/actions-display';
import { BadgesDisplay } from './components/atoms/badges-display';
import { FeedbackDisplay } from './components/atoms/feedback-display';
import { FormsDisplay } from './components/atoms/forms-display';
import { IdentityDisplay } from './components/atoms/identity-display';
import { Collapsible } from './components/ds-helpers';
import { PaletteSection } from './components/foundations/palette-section';
import { RadiusSection } from './components/foundations/radius-section';
import { ShadowsSection } from './components/foundations/shadows-section';
import { TokensSection } from './components/foundations/tokens-section';
import { TypographySection } from './components/foundations/typography-section';
import { EmptyStateDisplay } from './components/molecules/empty-state-display';
import { PageHeaderDisplay } from './components/molecules/page-header-display';
import { RecipeCardDisplay } from './components/molecules/recipe-card-display';
import { StatCardDisplay } from './components/molecules/stat-card-display';

const DesignSystemPage = () => (
  <div className="mx-auto max-w-5xl space-y-4 px-6 py-12">
    {/* Header */}
    <div className="border-neutre-200 mb-8 border-b pb-6">
      <p className="text-terracotta-500 mb-1 text-xs font-medium tracking-widest uppercase">
        Admin — privé
      </p>
      <h1 className="text-neutre-800 font-serif text-4xl font-semibold">
        Design System
      </h1>
      <p className="text-neutre-500 mt-2 text-base">
        Référence visuelle des tokens, composants et patterns UI. Itérer ici
        avant d&apos;intégrer dans l&apos;app.
      </p>
    </div>

    {/* ── Fondations ── */}
    <Collapsible title="Palette" defaultOpen>
      <PaletteSection />
    </Collapsible>

    <Collapsible title="Tokens sémantiques">
      <TokensSection />
    </Collapsible>

    <Collapsible title="Typographie">
      <TypographySection />
    </Collapsible>

    <Collapsible title="Radius">
      <RadiusSection />
    </Collapsible>

    <Collapsible title="Ombres">
      <ShadowsSection />
    </Collapsible>

    {/* ── Composants ── */}
    <div className="pt-4">
      <h2 className="text-neutre-800 mb-4 font-serif text-2xl font-semibold">
        Composants
      </h2>
      <div className="border-neutre-200 rounded-xl border bg-white p-6">
        <Tabs defaultValue="atoms">
          {/* Niveau 1 — catégorie atomique */}
          <TabsList className="mb-6">
            <TabsTrigger value="atoms">Atomes</TabsTrigger>
            <TabsTrigger value="molecules">Molécules</TabsTrigger>
            <TabsTrigger value="organisms">Organismes</TabsTrigger>
          </TabsList>

          {/* Atomes */}
          <TabsContent value="atoms">
            <Tabs defaultValue="actions">
              <TabsList className="mb-8">
                <TabsTrigger value="actions">Boutons & liens</TabsTrigger>
                <TabsTrigger value="badges">Badges & chips</TabsTrigger>
                <TabsTrigger value="forms">Formulaires</TabsTrigger>
                <TabsTrigger value="feedback">Affichage</TabsTrigger>
                <TabsTrigger value="identity">Identité</TabsTrigger>
              </TabsList>
              <TabsContent value="actions">
                <ActionsDisplay />
              </TabsContent>
              <TabsContent value="badges">
                <BadgesDisplay />
              </TabsContent>
              <TabsContent value="forms">
                <FormsDisplay />
              </TabsContent>
              <TabsContent value="feedback">
                <FeedbackDisplay />
              </TabsContent>
              <TabsContent value="identity">
                <IdentityDisplay />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="molecules">
            <Tabs defaultValue="empty-state">
              <TabsList className="mb-8">
                <TabsTrigger value="empty-state">EmptyState</TabsTrigger>
                <TabsTrigger value="stat-card">StatCard</TabsTrigger>
                <TabsTrigger value="page-header">PageHeader</TabsTrigger>
                <TabsTrigger value="recipe-card">RecipeCard</TabsTrigger>
                <TabsTrigger value="form-field">FormField</TabsTrigger>
              </TabsList>
              <TabsContent value="empty-state">
                <EmptyStateDisplay />
              </TabsContent>
              <TabsContent value="stat-card">
                <StatCardDisplay />
              </TabsContent>
              <TabsContent value="page-header">
                <PageHeaderDisplay />
              </TabsContent>
              <TabsContent value="recipe-card">
                <RecipeCardDisplay />
              </TabsContent>
              <TabsContent value="form-field">
                <div className="border-neutre-200 flex h-32 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-neutre-400 text-sm">À venir</p>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Organismes — à venir */}
          <TabsContent value="organisms">
            <div className="border-neutre-200 flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
              <p className="text-neutre-500 text-sm font-medium">
                Organismes — à venir
              </p>
              <p className="text-neutre-400 text-xs">
                PageHeader, Sidebar, Modales, Navigation…
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
);

export default DesignSystemPage;

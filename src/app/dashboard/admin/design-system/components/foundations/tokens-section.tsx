import { SectionLabel } from '@//app/dashboard/admin/design-system/components/ds-helpers';

const SEMANTIC_GROUPS = [
  {
    group: 'Actions',
    tokens: [
      {
        name: '--color-action-primary',
        role: 'Bouton primaire',
        cssVar: 'terracotta-500',
      },
      {
        name: '--color-action-primary-hover',
        role: 'Hover bouton primaire',
        cssVar: 'terracotta-600',
      },
      {
        name: '--color-action-primary-subtle',
        role: 'Fond chips / subtle',
        cssVar: 'terracotta-50',
      },
      {
        name: '--color-action-secondary',
        role: 'Bouton secondaire',
        cssVar: 'sable-200',
      },
    ],
  },
  {
    group: 'Surfaces',
    tokens: [
      {
        name: '--color-surface-page',
        role: 'Fond global',
        cssVar: 'neutre-50',
      },
      { name: '--color-surface-card', role: 'Cards, modales', cssVar: 'white' },
      {
        name: '--color-surface-muted',
        role: 'Sections secondaires',
        cssVar: 'neutre-100',
      },
      {
        name: '--color-surface-inverse',
        role: 'Fond sombre',
        cssVar: 'neutre-800',
      },
    ],
  },
  {
    group: 'Textes',
    tokens: [
      {
        name: '--color-text-primary',
        role: 'Texte principal',
        cssVar: 'neutre-800',
      },
      {
        name: '--color-text-secondary',
        role: 'Texte secondaire',
        cssVar: 'neutre-500',
      },
      {
        name: '--color-text-tertiary',
        role: 'Texte désactivé',
        cssVar: 'neutre-400',
      },
      { name: '--color-text-link', role: 'Liens', cssVar: 'terracotta-600' },
    ],
  },
  {
    group: 'Feedback',
    tokens: [
      { name: '--color-success', role: 'Succès', cssVar: 'olive-500' },
      { name: '--color-success-subtle', role: 'Fond OK', cssVar: 'olive-50' },
      { name: '--color-danger', role: 'Erreur', cssVar: 'bordeaux-500' },
      { name: '--color-danger-subtle', role: 'Fond KO', cssVar: 'bordeaux-50' },
      { name: '--color-warning', role: 'Warning', cssVar: 'sable-500' },
      { name: '--color-warning-subtle', role: 'Fond warn', cssVar: 'sable-50' },
    ],
  },
];

export const TokensSection = () => (
  <div className="grid grid-cols-2 gap-6">
    {SEMANTIC_GROUPS.map(({ group, tokens }) => (
      <div key={group}>
        <SectionLabel>{group}</SectionLabel>
        <div className="space-y-3">
          {tokens.map(({ name, role, cssVar }) => (
            <div key={name} className="flex items-center gap-3">
              <div
                className="border-neutre-100 h-7 w-7 shrink-0 rounded-md border"
                style={{
                  background: cssVar === 'white' ? '#fff' : `var(--${cssVar})`,
                }}
              />
              <div className="min-w-0">
                <p className="text-neutre-700 truncate font-mono text-[11px]">
                  {name}
                </p>
                <p className="text-neutre-400 text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

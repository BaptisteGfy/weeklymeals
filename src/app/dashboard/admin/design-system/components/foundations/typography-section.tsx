import { SectionLabel } from '@//app/dashboard/admin/design-system/components/ds-helpers';

const TYPE_SCALE = [
  {
    level: 'Display',
    size: 'text-5xl',
    font: 'font-serif',
    weight: 'font-medium',
    sample: 'Cuisinez la semaine.',
  },
  {
    level: 'H1',
    size: 'text-4xl',
    font: 'font-serif',
    weight: 'font-medium',
    sample: 'Mes recettes.',
  },
  {
    level: 'H2',
    size: 'text-3xl',
    font: 'font-serif',
    weight: 'font-medium',
    sample: 'Votre semaine',
  },
  {
    level: 'H3',
    size: 'text-2xl',
    font: 'font-serif',
    weight: 'font-medium',
    sample: 'Liste de courses',
  },
  {
    level: 'H4',
    size: 'text-lg',
    font: 'font-sans',
    weight: 'font-medium',
    sample: 'Ingrédients',
  },
  {
    level: 'Body L',
    size: 'text-lg',
    font: 'font-sans',
    weight: 'font-normal',
    sample: 'Planifiez vos repas de la semaine facilement.',
  },
  {
    level: 'Body M',
    size: 'text-base',
    font: 'font-sans',
    weight: 'font-normal',
    sample: 'Texte par défaut — corps de paragraphe standard.',
  },
  {
    level: 'Body S',
    size: 'text-sm',
    font: 'font-sans',
    weight: 'font-normal',
    sample: 'Texte secondaire, méta-informations.',
  },
  {
    level: 'Caption',
    size: 'text-xs',
    font: 'font-sans',
    weight: 'font-normal',
    sample: 'Légende, timestamp, label de champ.',
  },
];

export const TypographySection = () => (
  <div className="space-y-6">
    <div className="text-neutre-500 flex gap-8 text-sm">
      <span>
        <span className="text-neutre-700 font-serif font-medium">Lora</span> —
        Display → H3
      </span>
      <span>
        <span className="text-neutre-700 font-sans">Inter</span> — H4 → Caption
      </span>
    </div>
    <div className="divide-neutre-100 divide-y">
      {TYPE_SCALE.map(({ level, size, font, weight, sample }) => (
        <div key={level} className="flex items-baseline gap-6 py-3">
          <span className="text-neutre-400 w-16 shrink-0 text-[11px]">
            {level}
          </span>
          <p
            className={`${size} ${font} ${weight} text-neutre-800 leading-tight`}
          >
            {sample}
          </p>
        </div>
      ))}
    </div>
    <div className="border-neutre-100 space-y-2 border-t pt-5">
      <SectionLabel>
        Pattern italique terracotta — signature de marque
      </SectionLabel>
      <p className="text-neutre-800 font-serif text-3xl font-medium">
        Cuisinez la <em className="text-terracotta-600 not-italic">semaine.</em>
      </p>
      <p className="text-neutre-800 font-serif text-3xl font-medium">
        Bonjour <em className="text-terracotta-600 italic">Marine</em>,
      </p>
    </div>
  </div>
);

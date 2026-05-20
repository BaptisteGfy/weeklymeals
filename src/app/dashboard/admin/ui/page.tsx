import { Badge } from '@/components/ui/badge';

const Section = ({
  title,
  children,
  flush = false,
}: {
  title: string;
  children: React.ReactNode;
  flush?: boolean;
}) => (
  <section className="space-y-3">
    <h2 className="font-serif text-xl font-semibold text-gray-800">{title}</h2>
    <div
      className={`rounded-xl border bg-white ${flush ? 'px-2 py-4' : 'p-6'}`}
    >
      {children}
    </div>
  </section>
);

type Swatch = { label: string; color: string; light?: boolean };

const PaletteRow = ({
  name,
  swatches,
}: {
  name: string;
  swatches: Swatch[];
}) => (
  <div className="flex items-center gap-2">
    <span className="w-40 shrink-0 text-xs text-gray-400">{name}</span>
    <div className="flex gap-1.5">
      {swatches.map(({ label, color, light }) => (
        <div
          key={label}
          className={`flex h-10 w-20 flex-col justify-end rounded-md px-1.5 pb-1 ${light ? 'border border-gray-200' : ''}`}
          style={{ background: color }}
        >
          <span
            className={`text-[9px] leading-tight font-medium ${light ? 'text-gray-600' : 'text-white'}`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const pri = 'oklch(0.55 0.12 38)'; // terracotta fixe
const sec = 'oklch(0.84 0.07 72)'; // miel fixe
const bg = 'oklch(0.98 0.008 75)'; // crème fixe
const dest = 'oklch(0.52 0.18 27)'; // rouge adouci fixe

// 10 variations Terre & Miel — seul l'accent change
const palettes = [
  { name: '1 — Sage actuel', accent: 'oklch(0.82 0.06 140)', light: true },
  { name: '2 — Sage vif', accent: 'oklch(0.75 0.11 140)', light: true },
  { name: '3 — Menthe fraîche', accent: 'oklch(0.83 0.08 158)', light: true },
  { name: '4 — Thym sombre', accent: 'oklch(0.68 0.09 135)', light: false },
  { name: '5 — Pistache', accent: 'oklch(0.86 0.08 125)', light: true },
  { name: '6 — Moutarde douce', accent: 'oklch(0.80 0.09 85)', light: true },
  { name: '7 — Safran clair', accent: 'oklch(0.86 0.08 68)', light: true },
  { name: '8 — Rouille douce', accent: 'oklch(0.80 0.08 50)', light: true },
  { name: '9 — Bleu canard', accent: 'oklch(0.68 0.07 210)', light: false },
  { name: '10 — Neutre stone', accent: 'oklch(0.90 0.02 75)', light: true },
].map(({ name, accent, light }) => ({
  name,
  swatches: [
    { label: 'Primary', color: pri },
    { label: 'Secondary', color: sec, light: true },
    { label: 'Accent', color: accent, light },
    { label: 'Background', color: bg, light: true },
    { label: 'Destructive', color: dest },
  ],
}));

const UIGalleryPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-(--color-primary)">
          Component Gallery
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Page privée — développement et validation des composants UI avant
          intégration.
        </p>
      </div>

      {/* ── Design System ── */}
      <Section title="Design System" flush>
        <div className="space-y-6 px-2">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Propositions de palette
            </p>
            <div className="space-y-2">
              {palettes.map((p) => (
                <PaletteRow key={p.name} name={p.name} swatches={p.swatches} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Typographie
            </p>
            <div className="space-y-0.5">
              <p className="text-foreground font-serif text-2xl font-bold">
                Lora — titres
              </p>
              <p className="text-foreground font-sans text-base">
                Inter — corps de texte
              </p>
              <p className="text-muted-foreground font-sans text-sm">
                Inter muted — texte secondaire
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Badge ── */}
      <Section title="Badge">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Shadcn defaults
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="ghost">Ghost</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Catégories — tons chauds · variantes Déjeuner
            </p>
            {[
              {
                label: 'A — Sage design system',
                dej: 'bg-accent text-accent-foreground',
              },
              { label: 'B — Lime chaud', dej: 'bg-lime-100 text-lime-700' },
              { label: 'C — Jaune doré', dej: 'bg-yellow-100 text-yellow-700' },
            ].map(({ label, dej }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-44 text-xs text-gray-400">{label}</span>
                <div className="flex gap-2">
                  <span className="bg-primary text-primary-foreground inline-flex items-center rounded-3xl px-2 py-0.5 text-xs font-medium">
                    Dîner
                  </span>
                  <span
                    className={`inline-flex items-center rounded-3xl px-2 py-0.5 text-xs font-medium ${dej}`}
                  >
                    Déjeuner
                  </span>
                  <span className="inline-flex items-center rounded-3xl bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Dessert
                  </span>
                  <span className="inline-flex items-center rounded-3xl bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    Petit-déj.
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
              Source bibliothèque — tag coin coupé
            </p>
            <div className="flex gap-4">
              {['WeeklyMeals', 'Baptiste'].map((label) => (
                <div key={label} className="space-y-1">
                  <p className="text-xs text-gray-400">{label}</p>
                  <div className="relative h-24 w-40 overflow-hidden rounded-xl bg-gray-200">
                    <span className="bg-primary text-primary-foreground absolute right-0 bottom-0 px-3 py-1 text-xs font-medium [clip-path:polygon(10px_0%,100%_0%,100%_100%,0%_100%)]">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default UIGalleryPage;

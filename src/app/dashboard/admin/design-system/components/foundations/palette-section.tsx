const PALETTE = [
  {
    name: 'Terracotta',
    role: 'Primary — boutons, liens, branding',
    var: 'terracotta',
  },
  {
    name: 'Olive',
    role: 'Accent — tags, jour actif, états validés',
    var: 'olive',
  },
  {
    name: 'Sable',
    role: 'Secondary — fonds images, zones muted',
    var: 'sable',
  },
  {
    name: 'Bordeaux',
    role: 'Destructive — suppression, alertes',
    var: 'bordeaux',
  },
  { name: 'Neutre', role: 'Surfaces, textes, bordures', var: 'neutre' },
] as const;

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export const PaletteSection = () => (
  <div className="space-y-6">
    {PALETTE.map((color) => (
      <div key={color.name}>
        <div className="mb-2 flex items-baseline gap-3">
          <span className="text-neutre-800 font-serif text-base font-medium">
            {color.name}
          </span>
          <span className="text-neutre-400 text-xs">{color.role}</span>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {SHADES.map((shade) => (
            <div key={shade} className="space-y-1">
              <div
                className="border-neutre-100 h-12 rounded-lg border"
                style={{ background: `var(--${color.var}-${shade})` }}
              />
              <p className="text-neutre-400 text-center text-[9px]">{shade}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

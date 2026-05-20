const RADII = [
  { name: 'xs', value: '4px', label: 'boutons petits' },
  { name: 'sm', value: '6px', label: 'inputs' },
  { name: 'md', value: '8px', label: 'défaut' },
  { name: 'lg', value: '12px', label: 'cards' },
  { name: 'xl', value: '16px', label: 'modales' },
  { name: '2xl', value: '24px', label: 'hero cards' },
  { name: 'pill', value: '9999px', label: 'chips / tags' },
];

export const RadiusSection = () => (
  <div className="flex flex-wrap items-end gap-8">
    {RADII.map(({ name, value, label }) => (
      <div key={name} className="flex flex-col items-center gap-2">
        <div
          className="border-terracotta-300 bg-terracotta-50 h-14 w-14 border-2"
          style={{ borderRadius: value }}
        />
        <p className="text-neutre-700 text-xs font-medium">{value}</p>
        <p className="text-neutre-400 text-[10px]">
          {name} — {label}
        </p>
      </div>
    ))}
  </div>
);

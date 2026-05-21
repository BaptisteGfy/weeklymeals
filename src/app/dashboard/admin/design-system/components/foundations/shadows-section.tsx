const SHADOWS = [
  { name: 'shadow-xs', label: 'survol subtil' },
  { name: 'shadow-sm', label: 'cards au repos' },
  { name: 'shadow-md', label: 'cards au survol' },
  { name: 'shadow-lg', label: 'dropdowns / modales' },
  { name: 'shadow-xl', label: 'hero cards' },
];

export const ShadowsSection = () => (
  <div className="bg-neutre-50 -m-6 flex flex-wrap items-end gap-10 rounded-xl p-10">
    {SHADOWS.map(({ name, label }) => (
      <div key={name} className="flex flex-col items-center gap-3">
        <div
          className="h-16 w-32 rounded-xl bg-white"
          style={{ boxShadow: `var(--${name})` }}
        />
        <p className="text-neutre-700 text-xs font-medium">{name}</p>
        <p className="text-neutre-400 text-[10px]">{label}</p>
      </div>
    ))}
  </div>
);

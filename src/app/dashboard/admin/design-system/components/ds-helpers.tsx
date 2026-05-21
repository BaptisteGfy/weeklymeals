import { ChevronDown } from 'lucide-react';

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-neutre-400 mb-3 text-xs font-medium tracking-widest uppercase">
    {children}
  </p>
);

export const Block = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    {title && <SectionLabel>{title}</SectionLabel>}
    {children}
  </div>
);

export const Collapsible = ({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => (
  <details className="group" open={defaultOpen}>
    <summary className="border-neutre-200 hover:bg-neutre-50 flex cursor-pointer list-none items-center justify-between rounded-xl border bg-white px-5 py-4 transition-colors select-none">
      <h2 className="text-neutre-800 font-serif text-xl font-semibold">
        {title}
      </h2>
      <ChevronDown
        size={18}
        className="text-neutre-400 transition-transform duration-200 group-open:rotate-180"
      />
    </summary>
    <div className="border-neutre-200 mt-3 rounded-xl border bg-white p-6">
      {children}
    </div>
  </details>
);

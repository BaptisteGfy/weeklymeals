import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({
  label,
  htmlFor,
  required,
  description,
  error,
  children,
  className,
}: FormFieldProps) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label
      htmlFor={htmlFor}
      className="text-neutre-700 text-sm leading-none font-medium"
    >
      {label}
      {required && <span className="text-terracotta-600 ml-1">*</span>}
    </label>

    {children}

    {error ? (
      <p className="text-bordeaux-600 text-xs">{error}</p>
    ) : description ? (
      <p className="text-neutre-400 text-xs">{description}</p>
    ) : null}
  </div>
);

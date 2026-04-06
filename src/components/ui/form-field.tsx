import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function FormField({
  label,
  error,
  hint,
  className,
  children,
}: FormFieldProps) {
  return (
    <label className={cn("block space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--color-ink)]">
          {label}
        </span>
        {hint ? (
          <span className="text-xs text-[var(--color-muted-ink)]">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-[#8f3d2e]">{error}</p>
      ) : null}
    </label>
  );
}

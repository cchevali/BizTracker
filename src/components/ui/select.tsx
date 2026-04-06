import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export function Select({ className, invalid = false, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition-shadow",
        invalid
          ? "border-[#b55d53] shadow-[0_0_0_3px_rgba(181,93,83,0.12)]"
          : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(35,109,98,0.12)]",
        className,
      )}
      {...props}
    />
  );
}

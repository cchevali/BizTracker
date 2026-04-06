import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid = false, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition-shadow placeholder:text-[var(--color-muted-ink)]",
        invalid
          ? "border-[#b55d53] shadow-[0_0_0_3px_rgba(181,93,83,0.12)]"
          : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(35,109,98,0.12)]",
        className,
      )}
      {...props}
    />
  );
}

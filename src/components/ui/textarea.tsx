import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({
  className,
  invalid = false,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-3xl border bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition-shadow placeholder:text-[var(--color-muted-ink)]",
        invalid
          ? "border-[#b55d53] shadow-[0_0_0_3px_rgba(181,93,83,0.12)]"
          : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(35,109,98,0.12)]",
        className,
      )}
      {...props}
    />
  );
}

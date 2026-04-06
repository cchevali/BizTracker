import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
  fullWidth = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-medium no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60",
    size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-5 text-sm",
    variant === "primary" &&
      "border border-transparent bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-soft)]",
    variant === "secondary" &&
      "border border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-panel-muted)]",
    variant === "ghost" &&
      "text-[var(--color-muted-ink)] hover:bg-[var(--color-panel-muted)] hover:text-[var(--color-ink)]",
    variant === "danger" &&
      "border border-transparent bg-[#8f3d2e] text-white hover:bg-[#7b3527]",
    fullWidth && "w-full",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ className, variant, size, fullWidth })}
      {...props}
    />
  );
}

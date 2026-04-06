import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "neutral" && "bg-[var(--color-panel-muted)] text-[var(--color-muted-ink)]",
        tone === "accent" && "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
        tone === "success" && "bg-[#e5f6ef] text-[#1b6d53]",
        tone === "warning" && "bg-[#fbefd6] text-[#8c5d18]",
        tone === "danger" && "bg-[#f8e6e4] text-[#8f3d2e]",
        className,
      )}
    >
      {children}
    </span>
  );
}

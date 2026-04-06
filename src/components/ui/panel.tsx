import { cn } from "@/lib/utils";

type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[0_20px_60px_rgba(52,69,66,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

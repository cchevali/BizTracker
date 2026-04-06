import { Panel } from "@/components/ui/panel";
import { formatCurrency, formatScore } from "@/lib/format";

import type { DashboardSummary } from "../domain/business.types";

type SummaryCardsProps = {
  summary: DashboardSummary;
};

const summaryItems = [
  {
    key: "total",
    label: "Visible businesses",
    helper: "Current result set",
  },
  {
    key: "active",
    label: "Active pipeline",
    helper: "Not passed or closed",
  },
  {
    key: "averageScore",
    label: "Average score",
    helper: "Across scored deals",
  },
  {
    key: "highestSde",
    label: "Highest SDE",
    helper: "Top operator cash flow",
  },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {summaryItems.map((item) => {
        const value =
          item.key === "averageScore"
            ? formatScore(summary.averageScore)
            : item.key === "highestSde"
              ? formatCurrency(summary.highestSde)
              : String(summary[item.key]);

        return (
          <Panel key={item.key} className="p-4 sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted-ink)] sm:text-xs sm:tracking-[0.18em]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
              {value}
            </p>
            <p className="mt-2 text-xs text-[var(--color-muted-ink)] sm:text-sm">
              {item.helper}
            </p>
          </Panel>
        );
      })}
    </div>
  );
}

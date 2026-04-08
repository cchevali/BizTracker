import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import {
  formatCurrency,
  formatDateTime,
  formatRating,
  formatScore,
} from "@/lib/format";

import {
  getBooleanLabel,
  getPrimaryUseCaseLabel,
  type BusinessListItem,
} from "../domain/business.types";
import { StatusBadge } from "./status-badge";

type BusinessCardGridProps = {
  businesses: BusinessListItem[];
};

export function BusinessCardGrid({ businesses }: BusinessCardGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {businesses.map((business) => (
        <Panel key={business.id} className="flex h-full flex-col gap-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Link
                href={`/businesses/${business.id}`}
                className="text-lg font-semibold text-[var(--color-ink)] underline-offset-4 hover:underline"
              >
                {business.businessName}
              </Link>
              <p className="text-sm text-[var(--color-muted-ink)]">
                {business.category}
                {business.subcategory ? ` • ${business.subcategory}` : ""}
              </p>
            </div>
            <StatusBadge status={business.dealStatus} />
          </div>

          <p className="flex-1 text-sm leading-6 text-[var(--color-muted-ink)]">
            {business.summary}
          </p>

          <div className="grid grid-cols-2 gap-3 rounded-[24px] bg-[var(--color-panel-muted)] p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
                Use Case
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {getPrimaryUseCaseLabel(business.primaryUseCase)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
                Keep / Quit
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {formatRating(business.keepDayJobFit)} / {formatRating(business.quitDayJobFit)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
                Conservative Cash
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {formatCurrency(business.conservativeCashAfterBrother)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
                Cash High
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {formatCurrency(business.cashToCloseHigh)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{`Finance ${formatRating(business.financeabilityRating)}`}</Badge>
              <Badge>{`AI ${formatRating(business.aiResistanceScore)}`}</Badge>
              <Badge>{`Seller ${getBooleanLabel(business.sellerFinancingAvailable)}`}</Badge>
              <Badge>{`Benchmark ${getBooleanLabel(business.beatsCurrentBenchmark)}`}</Badge>
              {business.tags.slice(0, 3).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <span className="text-xs text-[var(--color-muted-ink)]">
              Score {formatScore(business.overallScore)} · Updated {formatDateTime(business.updatedAt)}
            </span>
          </div>
        </Panel>
      ))}
    </div>
  );
}

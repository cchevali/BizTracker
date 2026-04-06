import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { formatCurrency, formatDateTime, formatScore } from "@/lib/format";

import type { BusinessListItem } from "../domain/business.types";
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
                Ask
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {formatCurrency(business.askingPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
                SDE
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {formatCurrency(business.sde)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
                Score
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {formatScore(business.overallScore)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
                Location
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {business.location}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {business.tags.slice(0, 3).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <span className="text-xs text-[var(--color-muted-ink)]">
              Updated {formatDateTime(business.updatedAt)}
            </span>
          </div>
        </Panel>
      ))}
    </div>
  );
}

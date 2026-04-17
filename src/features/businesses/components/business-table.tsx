import Link from "next/link";

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
import { PipelineBadge } from "./pipeline-badge";
import { StatusBadge } from "./status-badge";

type BusinessTableProps = {
  businesses: BusinessListItem[];
};

export function BusinessTable({ businesses }: BusinessTableProps) {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-border)] text-left">
          <thead className="bg-[var(--color-panel-muted)]">
            <tr className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted-ink)]">
              <th className="px-5 py-4 font-medium">Business</th>
              <th className="px-5 py-4 font-medium">Use Case</th>
              <th className="px-5 py-4 font-medium">Ask</th>
              <th className="px-5 py-4 font-medium">SDE</th>
              <th className="px-5 py-4 font-medium">Keep / Quit</th>
              <th className="px-5 py-4 font-medium">Financeability</th>
              <th className="px-5 py-4 font-medium">Cash High</th>
              <th className="px-5 py-4 font-medium">Conservative Cash</th>
              <th className="px-5 py-4 font-medium">Benchmark</th>
              <th className="px-5 py-4 font-medium">Bucket</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] bg-white">
            {businesses.map((business) => (
              <tr key={business.id} className="align-top">
                <td className="px-5 py-4">
                  <div className="space-y-2">
                    <Link
                      href={`/businesses/${business.id}`}
                      className="text-sm font-semibold text-[var(--color-ink)] underline-offset-4 hover:underline"
                    >
                      {business.businessName}
                    </Link>
                    <p className="max-w-sm text-sm leading-6 text-[var(--color-muted-ink)]">
                      {business.summary}
                    </p>
                    {business.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {business.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[var(--color-panel-muted)] px-3 py-1 text-xs text-[var(--color-muted-ink)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[var(--color-muted-ink)]">
                  <div className="space-y-1">
                    <p className="font-medium text-[var(--color-ink)]">
                      {getPrimaryUseCaseLabel(business.primaryUseCase)}
                    </p>
                    <p>{business.location}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--color-ink)]">
                  {formatCurrency(business.askingPrice)}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--color-ink)]">
                  {formatCurrency(business.sde)}
                </td>
                <td className="px-5 py-4 text-sm text-[var(--color-muted-ink)]">
                  <div className="space-y-1">
                    <p>Keep {formatRating(business.keepDayJobFit)}</p>
                    <p>Quit {formatRating(business.quitDayJobFit)}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[var(--color-muted-ink)]">
                  <div className="space-y-1">
                    <p>{formatRating(business.financeabilityRating)}</p>
                    <p>AI {formatRating(business.aiResistanceScore)}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--color-ink)]">
                  {formatCurrency(business.cashToCloseHigh)}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--color-ink)]">
                  {formatCurrency(business.conservativeCashAfterBrother)}
                </td>
                <td className="px-5 py-4 text-sm text-[var(--color-muted-ink)]">
                  <div className="space-y-1">
                    <p>{getBooleanLabel(business.beatsCurrentBenchmark)}</p>
                    <p>Score {formatScore(business.overallScore)}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm">
                  <PipelineBadge bucket={business.pipelineBucket} />
                </td>
                <td className="px-5 py-4 text-sm">
                  <StatusBadge status={business.dealStatus} />
                </td>
                <td className="px-5 py-4 text-sm text-[var(--color-muted-ink)]">
                  {formatDateTime(business.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

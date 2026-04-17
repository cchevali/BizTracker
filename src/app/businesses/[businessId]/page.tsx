import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  formatBoolean,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatInteger,
  formatPercent,
  formatRating,
  formatScore,
} from "@/lib/format";
import { addBusinessNoteAction } from "@/features/businesses/actions/business-actions";
import { HistoryTimeline } from "@/features/businesses/components/history-timeline";
import { NoteForm } from "@/features/businesses/components/note-form";
import { StatusBadge } from "@/features/businesses/components/status-badge";
import { StatusForm } from "@/features/businesses/components/status-form";
import { PipelineBadge } from "@/features/businesses/components/pipeline-badge";
import { getBusinessById } from "@/features/businesses/data/business-repository";
import { getPrimaryUseCaseLabel } from "@/features/businesses/domain/business.types";

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-[24px] bg-[var(--color-panel-muted)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: MetricCardProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <strong className="text-right text-[var(--color-ink)]">{value}</strong>
    </div>
  );
}

type DetailPageProps = {
  params: Promise<{
    businessId: string;
  }>;
};

export default async function BusinessDetailPage({ params }: DetailPageProps) {
  const { businessId } = await params;
  const business = await getBusinessById(businessId);

  if (!business) {
    notFound();
  }

  const noteAction = addBusinessNoteAction.bind(null, business.id);

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <PipelineBadge bucket={business.pipelineBucket} />
            <StatusBadge status={business.dealStatus} />
            <Badge tone="neutral">{business.location}</Badge>
            {business.listingSource ? (
              <Badge tone="neutral">{business.listingSource}</Badge>
            ) : null}
            {business.primaryUseCase ? (
              <Badge tone="neutral">
                {getPrimaryUseCaseLabel(business.primaryUseCase)}
              </Badge>
            ) : null}
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
              {business.businessName}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted-ink)]">
              {business.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className={buttonStyles({ variant: "ghost" })}>
            Dashboard
          </Link>
          <Link
            href={`/businesses/${business.id}/edit`}
            className={buttonStyles({ variant: "primary" })}
          >
            Edit business
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          <Panel className="p-6">
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                  Financial snapshot
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                  Quick operating view for first-pass diligence.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <MetricCard label="Asking price" value={formatCurrency(business.askingPrice)} />
                <MetricCard label="Revenue" value={formatCurrency(business.revenue)} />
                <MetricCard label="SDE" value={formatCurrency(business.sde)} />
                <MetricCard label="EBITDA" value={formatCurrency(business.ebitda)} />
                <MetricCard label="Employees" value={formatInteger(business.employees)} />
                <MetricCard label="Overall score" value={formatScore(business.overallScore)} />
              </div>
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel className="p-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                  Why it may fit
                </h2>
                <p className="text-sm leading-7 text-[var(--color-muted-ink)]">
                  {business.whyItMayFit}
                </p>
              </div>
            </Panel>

            <Panel className="p-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                  Risks / why it may fail
                </h2>
                <p className="text-sm leading-7 text-[var(--color-muted-ink)]">
                  {business.risks}
                </p>
              </div>
            </Panel>
          </div>

          <Panel className="p-6">
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                  Notes
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                  General notes plus session-by-session diligence updates.
                </p>
              </div>

              {business.notes ? (
                <div className="rounded-[24px] bg-[var(--color-panel-muted)] p-4 text-sm leading-7 text-[var(--color-muted-ink)]">
                  {business.notes}
                </div>
              ) : null}

              <NoteForm action={noteAction} />

              <div className="space-y-3">
                {business.noteEntries.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-ink)]">
                    No note entries yet.
                  </p>
                ) : (
                  business.noteEntries.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-[24px] border border-[var(--color-border)] bg-white p-4"
                    >
                      <p className="text-sm leading-7 text-[var(--color-ink)]">
                        {note.body}
                      </p>
                      <p className="mt-3 text-xs text-[var(--color-muted-ink)]">
                        {formatDateTime(note.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Panel>

          <HistoryTimeline historyEvents={business.historyEvents} />
        </div>

        <div className="space-y-6">
          <Panel className="p-6">
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                  Quick actions
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                  Update the current status without opening the full edit form.
                </p>
              </div>
              <StatusForm businessId={business.id} currentStatus={business.dealStatus} />
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Scenario
              </h2>
              <p className="text-sm text-[var(--color-muted-ink)]">
                Conservative default scenario using the shared close-cash, debt, and brother-comp assumptions.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  label="Cash to close range"
                  value={`${formatCurrency(business.cashToCloseLow)} to ${formatCurrency(
                    business.cashToCloseHigh,
                  )}`}
                />
                <MetricCard
                  label="Annual debt service assumed"
                  value={formatCurrency(business.annualDebtServiceAssumed)}
                />
                <MetricCard
                  label="Paper cash after paying brother"
                  value={formatCurrency(business.paperCashAfterBrother)}
                />
                <MetricCard
                  label="Conservative cash after paying brother"
                  value={formatCurrency(business.conservativeCashAfterBrother)}
                />
                <MetricCard
                  label="Keep / quit fit"
                  value={`${formatRating(business.keepDayJobFit)} / ${formatRating(
                    business.quitDayJobFit,
                  )}`}
                />
                <MetricCard
                  label="Primary use case"
                  value={getPrimaryUseCaseLabel(business.primaryUseCase)}
                />
              </div>
              {business.cashToCloseNotes ? (
                <div className="rounded-[24px] bg-[var(--color-panel-muted)] p-4 text-sm leading-7 text-[var(--color-muted-ink)]">
                  {business.cashToCloseNotes}
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Investment thesis
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-muted-ink)]">
                <InfoRow
                  label="AI resistance"
                  value={formatRating(business.aiResistanceScore)}
                />
                <InfoRow
                  label="Keep-day-job fit"
                  value={formatRating(business.keepDayJobFit)}
                />
                <InfoRow
                  label="Quit-day-job fit"
                  value={formatRating(business.quitDayJobFit)}
                />
                <InfoRow
                  label="Primary use case"
                  value={getPrimaryUseCaseLabel(business.primaryUseCase)}
                />
                <InfoRow
                  label="Beats current benchmark"
                  value={formatBoolean(business.beatsCurrentBenchmark)}
                />
                <InfoRow
                  label="Financeability"
                  value={formatRating(business.financeabilityRating)}
                />
              </div>
              {business.benchmarkNotes ? (
                <div className="rounded-[24px] bg-[var(--color-panel-muted)] p-4 text-sm leading-7 text-[var(--color-muted-ink)]">
                  {business.benchmarkNotes}
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Operational reality
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-muted-ink)]">
                <InfoRow
                  label="Operator skill dependency"
                  value={formatRating(business.operatorSkillDependency)}
                />
                <InfoRow
                  label="License dependency"
                  value={formatRating(business.licenseDependency)}
                />
                <InfoRow
                  label="After-hours burden"
                  value={formatRating(business.afterHoursBurden)}
                />
                <InfoRow
                  label="Capex risk"
                  value={formatRating(business.capexRisk)}
                />
                <InfoRow
                  label="Home-based"
                  value={formatBoolean(business.homeBasedFlag)}
                />
                <InfoRow
                  label="Recurring revenue %"
                  value={formatPercent(business.recurringRevenuePercent)}
                />
                <InfoRow
                  label="Owner hours claimed"
                  value={formatInteger(business.ownerHoursClaimed)}
                />
                <InfoRow
                  label="Ops manager exists"
                  value={formatBoolean(business.opsManagerExists)}
                />
                <InfoRow
                  label="Key-person risk"
                  value={formatRating(business.keyPersonRisk)}
                />
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Confidence and downside
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-muted-ink)]">
                <InfoRow
                  label="Regret-if-wrong score"
                  value={formatRating(business.regretIfWrongScore)}
                />
                <InfoRow
                  label="Data confidence score"
                  value={formatRating(business.dataConfidenceScore)}
                />
                <InfoRow
                  label="Stale listing risk"
                  value={formatRating(business.staleListingRisk)}
                />
                <InfoRow
                  label="Freshness verified"
                  value={formatDate(business.freshnessVerifiedAt)}
                />
                <InfoRow
                  label="Seller financing available"
                  value={formatBoolean(business.sellerFinancingAvailable)}
                />
              </div>
              {business.sellerFinancingNotes ? (
                <div className="rounded-[24px] bg-[var(--color-panel-muted)] p-4 text-sm leading-7 text-[var(--color-muted-ink)]">
                  {business.sellerFinancingNotes}
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Legacy ratings
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-muted-ink)]">
                <InfoRow
                  label="Owner dependence"
                  value={formatRating(business.ownerDependenceRating)}
                />
                <InfoRow
                  label="Recurring revenue"
                  value={formatRating(business.recurringRevenueRating)}
                />
                <InfoRow
                  label="Transferability"
                  value={formatRating(business.transferabilityRating)}
                />
                <InfoRow
                  label="Schedule-control fit"
                  value={formatRating(business.scheduleControlFitRating)}
                />
                <InfoRow
                  label="Brother-operator fit"
                  value={formatRating(business.brotherOperatorFitRating)}
                />
                <InfoRow
                  label="Overall score"
                  value={formatScore(business.overallScore)}
                />
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Source and ownership context
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-muted-ink)]">
                <div className="flex items-start justify-between gap-4">
                  <span>Source URL</span>
                  {business.sourceUrl ? (
                    <a
                      href={business.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="max-w-[14rem] text-right text-[var(--color-accent)] underline-offset-4 hover:underline"
                    >
                      Open source
                    </a>
                  ) : (
                    <strong className="text-[var(--color-ink)]">—</strong>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Public source verified</span>
                  <strong className="text-right text-[var(--color-ink)]">
                    {formatBoolean(business.publicSourceVerified)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Broker</span>
                  <strong className="text-right text-[var(--color-ink)]">
                    {business.brokerName ?? "—"}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Broker firm</span>
                  <strong className="text-right text-[var(--color-ink)]">
                    {business.brokerFirm ?? "—"}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Created</span>
                  <strong className="text-right text-[var(--color-ink)]">
                    {formatDateTime(business.createdAt)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Updated</span>
                  <strong className="text-right text-[var(--color-ink)]">
                    {formatDateTime(business.updatedAt)}
                  </strong>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {business.tags.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted-ink)]">
                    No tags assigned.
                  </p>
                ) : (
                  business.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))
                )}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  formatCurrency,
  formatDateTime,
  formatInteger,
  formatRating,
  formatScore,
} from "@/lib/format";
import { addBusinessNoteAction } from "@/features/businesses/actions/business-actions";
import { HistoryTimeline } from "@/features/businesses/components/history-timeline";
import { NoteForm } from "@/features/businesses/components/note-form";
import { StatusBadge } from "@/features/businesses/components/status-badge";
import { StatusForm } from "@/features/businesses/components/status-form";
import { getBusinessById } from "@/features/businesses/data/business-repository";

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
            <StatusBadge status={business.dealStatus} />
            <Badge tone="neutral">{business.location}</Badge>
            {business.listingSource ? (
              <Badge tone="neutral">{business.listingSource}</Badge>
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
                Acquisition fit ratings
              </h2>
              <div className="space-y-3 text-sm text-[var(--color-muted-ink)]">
                <div className="flex items-center justify-between gap-4">
                  <span>Owner dependence</span>
                  <strong className="text-[var(--color-ink)]">
                    {formatRating(business.ownerDependenceRating)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Recurring revenue</span>
                  <strong className="text-[var(--color-ink)]">
                    {formatRating(business.recurringRevenueRating)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Transferability</span>
                  <strong className="text-[var(--color-ink)]">
                    {formatRating(business.transferabilityRating)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Schedule-control fit</span>
                  <strong className="text-[var(--color-ink)]">
                    {formatRating(business.scheduleControlFitRating)}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Brother-operator fit</span>
                  <strong className="text-[var(--color-ink)]">
                    {formatRating(business.brotherOperatorFitRating)}
                  </strong>
                </div>
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

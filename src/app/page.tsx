import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { buttonStyles } from "@/components/ui/button";
import { BusinessCardGrid } from "@/features/businesses/components/business-card-grid";
import { BusinessTable } from "@/features/businesses/components/business-table";
import { DashboardToolbar } from "@/features/businesses/components/dashboard-toolbar";
import { FilterPanel } from "@/features/businesses/components/filter-panel";
import { PresetPanel } from "@/features/businesses/components/preset-panel";
import { SummaryCards } from "@/features/businesses/components/summary-cards";
import { getBusinessesDashboard } from "@/features/businesses/data/business-repository";
import {
  parseBusinessFilters,
  serializeBusinessFilters,
} from "@/features/businesses/domain/business.filters";
import type { SearchParamsInput } from "@/features/businesses/domain/business.types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const filters = parseBusinessFilters(await searchParams);
  const dashboard = await getBusinessesDashboard(filters);
  const serializedFilters = serializeBusinessFilters(filters);

  return (
    <main className="space-y-8">
      <section className="rounded-[30px] border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(35,109,98,0.12),rgba(255,255,255,0.88)_44%,rgba(161,123,63,0.1))] px-5 py-6 shadow-[0_24px_80px_rgba(52,69,66,0.08)] sm:rounded-[36px] sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Local-first acquisition workflow
            </p>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
                Track businesses worth buying without losing context between sessions.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--color-muted-ink)]">
                Save manual opportunities, paste Codex chat links directly as sources,
                filter the pipeline, and keep long-lived diligence notes in one maintainable repo.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/businesses/new"
              className={buttonStyles({
                variant: "primary",
                className: "w-full sm:w-auto",
              })}
            >
              Add business
            </Link>
            <a
              href="#tracker"
              className={buttonStyles({
                variant: "secondary",
                className: "w-full sm:w-auto",
              })}
            >
              Open tracker
            </a>
          </div>
        </div>
      </section>

      <SummaryCards summary={dashboard.summary} />

      <section
        id="tracker"
        className="grid gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]"
      >
        <div className="hidden space-y-6 lg:block">
          <FilterPanel
            filters={dashboard.filters}
            filterOptions={dashboard.filterOptions}
            mode="desktop"
          />
          <PresetPanel
            presets={dashboard.presets}
            queryJson={JSON.stringify(serializedFilters)}
          />
        </div>

        <div className="space-y-6">
          <div className="lg:hidden">
            <FilterPanel
              filters={dashboard.filters}
              filterOptions={dashboard.filterOptions}
              mode="mobile"
            />
          </div>

          <DashboardToolbar
            filters={dashboard.filters}
            query={serializedFilters}
            totalCount={dashboard.summary.total}
          />

          {dashboard.businesses.length === 0 ? (
            <EmptyState
              title="No businesses match the current view"
              description="Clear a few filters or add a new business to start building your acquisition pipeline."
              actionHref="/businesses/new"
              actionLabel="Create business"
            />
          ) : dashboard.filters.view === "cards" ? (
            <BusinessCardGrid businesses={dashboard.businesses} />
          ) : dashboard.filters.view === "table" ? (
            <>
              <div className="lg:hidden">
                <BusinessCardGrid businesses={dashboard.businesses} />
              </div>
              <div className="hidden lg:block">
                <BusinessTable businesses={dashboard.businesses} />
              </div>
            </>
          ) : (
            <BusinessCardGrid businesses={dashboard.businesses} />
          )}

          <div className="lg:hidden">
            <PresetPanel
              presets={dashboard.presets}
              queryJson={JSON.stringify(serializedFilters)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

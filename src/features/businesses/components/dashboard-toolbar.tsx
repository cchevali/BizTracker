import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

import {
  buildBusinessExportHref,
  buildBusinessListHref,
  patchBusinessListQuery,
} from "../domain/business.filters";
import {
  sortOptions,
  viewModeOptions,
  type BusinessFilters,
  type FilterQueryRecord,
} from "../domain/business.types";

type DashboardToolbarProps = {
  filters: BusinessFilters;
  query: FilterQueryRecord;
  totalCount: number;
};

export function DashboardToolbar({
  filters,
  query,
  totalCount,
}: DashboardToolbarProps) {
  return (
    <Panel className="p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm text-[var(--color-muted-ink)]">
              Showing {totalCount} businesses
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--color-ink)]">
              Acquisition pipeline
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildBusinessExportHref(query)}
              prefetch={false}
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              Generate ChatGPT workbook
            </Link>

            {viewModeOptions.map((option) => (
              <Link
                key={option.value}
                href={buildBusinessListHref(
                  patchBusinessListQuery(query, {
                    view: option.value,
                  }),
                )}
                className={buttonStyles({
                  variant: filters.view === option.value ? "primary" : "secondary",
                  size: "sm",
                })}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              href={buildBusinessListHref(
                patchBusinessListQuery(query, {
                  sort: option.value,
                }),
              )}
              className={buttonStyles({
                variant: filters.sort === option.value ? "primary" : "ghost",
                size: "sm",
              })}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </Panel>
  );
}

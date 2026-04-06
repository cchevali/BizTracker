import Form from "next/form";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Select } from "@/components/ui/select";

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

function QueryHiddenInputs({
  query,
  omitKeys = [],
}: {
  query: FilterQueryRecord;
  omitKeys?: string[];
}) {
  return (
    <>
      {Object.entries(query).map(([key, value]) => {
        if (!value || omitKeys.includes(key)) {
          return null;
        }

        return <input key={key} type="hidden" name={key} value={value} />;
      })}
    </>
  );
}

export function DashboardToolbar({
  filters,
  query,
  totalCount,
}: DashboardToolbarProps) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm text-[var(--color-muted-ink)]">
              Showing {totalCount} businesses
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--color-ink)]">
              Acquisition pipeline
            </h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={buildBusinessExportHref(query)}
              prefetch={false}
              className={buttonStyles({
                variant: "secondary",
                size: "sm",
                className: "w-full sm:w-auto",
              })}
            >
              Generate ChatGPT workbook
            </Link>

            <div className="hidden lg:flex flex-wrap items-center gap-2">
              {viewModeOptions.map((option) => (
                <Link
                  key={option.value}
                  href={buildBusinessListHref(
                    patchBusinessListQuery(query, {
                      view: option.value,
                    }),
                  )}
                  className={buttonStyles({
                    variant:
                      filters.view === option.value ? "primary" : "secondary",
                    size: "sm",
                  })}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Form action="" replace className="grid gap-2 lg:hidden">
          <QueryHiddenInputs query={query} omitKeys={["sort"]} />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              Sort results
            </span>
            <div className="flex gap-2">
              <Select
                name="sort"
                defaultValue={filters.sort}
                className="min-w-0 flex-1"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <button
                type="submit"
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                Apply
              </button>
            </div>
          </label>
        </Form>

        <div className="hidden flex-wrap gap-2 lg:flex">
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

import Link from "next/link";
import Form from "next/form";

import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Select } from "@/components/ui/select";

import { formatTagsForInput } from "../domain/business.filters";
import {
  dealStatusOptions,
  type BusinessFilters,
  type FilterOptionSet,
} from "../domain/business.types";

type FilterPanelProps = {
  filters: BusinessFilters;
  filterOptions: FilterOptionSet;
};

export function FilterPanel({ filters, filterOptions }: FilterPanelProps) {
  return (
    <Panel className="p-5">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            Search and filters
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
            The dashboard runs directly from URL state so saved links and future sessions stay in sync.
          </p>
        </div>

        <Form action="" replace className="space-y-4">
          <input type="hidden" name="view" value={filters.view} />
          <input type="hidden" name="sort" value={filters.sort} />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              Global search
            </span>
            <Input
              name="q"
              defaultValue={filters.q}
              placeholder="Search name, summary, location, source..."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                State
              </span>
              <Select name="state" defaultValue={filters.state}>
                <option value="">All states</option>
                {filterOptions.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Category
              </span>
              <Select name="category" defaultValue={filters.category}>
                <option value="">All categories</option>
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              Deal status
            </span>
            <Select name="status" defaultValue={filters.status ?? ""}>
              <option value="">All statuses</option>
              {dealStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Min ask
              </span>
              <Input
                name="minAsk"
                inputMode="decimal"
                defaultValue={filters.minAsk ?? ""}
                placeholder="0"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Max ask
              </span>
              <Input
                name="maxAsk"
                inputMode="decimal"
                defaultValue={filters.maxAsk ?? ""}
                placeholder="5000000"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Min SDE
              </span>
              <Input
                name="minSde"
                inputMode="decimal"
                defaultValue={filters.minSde ?? ""}
                placeholder="0"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Max SDE
              </span>
              <Input
                name="maxSde"
                inputMode="decimal"
                defaultValue={filters.maxSde ?? ""}
                placeholder="1000000"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Min score
              </span>
              <Input
                name="minScore"
                inputMode="numeric"
                defaultValue={filters.minScore ?? ""}
                placeholder="0"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Max score
              </span>
              <Input
                name="maxScore"
                inputMode="numeric"
                defaultValue={filters.maxScore ?? ""}
                placeholder="100"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              Tags
            </span>
            <Input
              name="tags"
              defaultValue={formatTagsForInput(filters.tags)}
              placeholder="recurring, home-services, b2b"
            />
            <span className="text-xs text-[var(--color-muted-ink)]">
              Matches any listed tag.
            </span>
          </label>

          {filterOptions.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filterOptions.tags.slice(0, 12).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--color-panel-muted)] px-3 py-1 text-xs text-[var(--color-muted-ink)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className={buttonStyles({ variant: "primary" })}>
              Apply filters
            </button>
            <Link href="/" className={buttonStyles({ variant: "ghost" })}>
              Reset
            </Link>
          </div>
        </Form>
      </div>
    </Panel>
  );
}

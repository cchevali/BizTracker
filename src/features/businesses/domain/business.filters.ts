import type { DealStatus } from "@/generated/prisma/enums";

import { uniqueStrings } from "@/lib/utils";

import {
  DEFAULT_SORT_OPTION,
  DEFAULT_VIEW_MODE,
  filterQueryKeys,
  sortOptionValues,
  viewModes,
  type BusinessFilters,
  type FilterQueryKey,
  type FilterQueryRecord,
  type SearchParamsInput,
  type SortOption,
  type ViewMode,
} from "./business.types";

function takeFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function normalizeNumberish(value: string) {
  return value.replace(/[$,\s]/g, "").trim();
}

function parseNonNegativeNumber(value: string) {
  const normalized = normalizeNumberish(value);

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseScore(value: string) {
  const parsed = parseNonNegativeNumber(value);

  if (parsed === undefined) {
    return undefined;
  }

  return parsed <= 100 ? parsed : undefined;
}

function isViewMode(value: string): value is ViewMode {
  return (viewModes as readonly string[]).includes(value);
}

function isSortOption(value: string): value is SortOption {
  return (sortOptionValues as readonly string[]).includes(value);
}

function isDealStatus(value: string): value is DealStatus {
  return [
    "NEW",
    "WATCHLIST",
    "RESEARCHING",
    "CONTACTED_BROKER",
    "UNDER_REVIEW",
    "LETTER_OF_INTENT",
    "PASSED",
    "CLOSED",
  ].includes(value);
}

export function splitTags(input: string) {
  return uniqueStrings(
    input
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function formatTagsForInput(tags: string[]) {
  return tags.join(", ");
}

export function parseBusinessFilters(
  input: SearchParamsInput | FilterQueryRecord,
): BusinessFilters {
  const q = takeFirst(input.q).trim();
  const rawView = takeFirst(input.view);
  const rawSort = takeFirst(input.sort);
  const rawState = takeFirst(input.state).trim().toUpperCase();
  const rawCategory = takeFirst(input.category).trim();
  const rawStatus = takeFirst(input.status).trim();

  return {
    q,
    view: isViewMode(rawView) ? rawView : DEFAULT_VIEW_MODE,
    sort: isSortOption(rawSort) ? rawSort : DEFAULT_SORT_OPTION,
    state: rawState,
    category: rawCategory,
    minAsk: parseNonNegativeNumber(takeFirst(input.minAsk)),
    maxAsk: parseNonNegativeNumber(takeFirst(input.maxAsk)),
    minSde: parseNonNegativeNumber(takeFirst(input.minSde)),
    maxSde: parseNonNegativeNumber(takeFirst(input.maxSde)),
    minScore: parseScore(takeFirst(input.minScore)),
    maxScore: parseScore(takeFirst(input.maxScore)),
    status: isDealStatus(rawStatus) ? rawStatus : undefined,
    tags: splitTags(takeFirst(input.tags)),
  };
}

export function serializeBusinessFilters(
  filters: BusinessFilters,
): FilterQueryRecord {
  const serialized: FilterQueryRecord = {};

  if (filters.q) {
    serialized.q = filters.q;
  }

  if (filters.view !== DEFAULT_VIEW_MODE) {
    serialized.view = filters.view;
  }

  if (filters.sort !== DEFAULT_SORT_OPTION) {
    serialized.sort = filters.sort;
  }

  if (filters.state) {
    serialized.state = filters.state;
  }

  if (filters.category) {
    serialized.category = filters.category;
  }

  if (filters.minAsk !== undefined) {
    serialized.minAsk = String(filters.minAsk);
  }

  if (filters.maxAsk !== undefined) {
    serialized.maxAsk = String(filters.maxAsk);
  }

  if (filters.minSde !== undefined) {
    serialized.minSde = String(filters.minSde);
  }

  if (filters.maxSde !== undefined) {
    serialized.maxSde = String(filters.maxSde);
  }

  if (filters.minScore !== undefined) {
    serialized.minScore = String(filters.minScore);
  }

  if (filters.maxScore !== undefined) {
    serialized.maxScore = String(filters.maxScore);
  }

  if (filters.status) {
    serialized.status = filters.status;
  }

  if (filters.tags.length > 0) {
    serialized.tags = filters.tags.join(",");
  }

  return serialized;
}

export function buildBusinessListHref(query: FilterQueryRecord = {}) {
  const params = new URLSearchParams();

  for (const key of filterQueryKeys) {
    const value = query[key];

    if (value) {
      params.set(key, value);
    }
  }

  const search = params.toString();
  return search ? `/?${search}` : "/";
}

export function patchBusinessListQuery(
  base: FilterQueryRecord,
  overrides: Partial<Record<FilterQueryKey, string | undefined>>,
) {
  const nextQuery: FilterQueryRecord = { ...base };

  for (const [key, value] of Object.entries(overrides) as Array<
    [FilterQueryKey, string | undefined]
  >) {
    if (!value) {
      delete nextQuery[key];
      continue;
    }

    nextQuery[key] = value;
  }

  return nextQuery;
}

export function countActiveFilters(filters: BusinessFilters) {
  const values = [
    filters.q,
    filters.state,
    filters.category,
    filters.minAsk,
    filters.maxAsk,
    filters.minSde,
    filters.maxSde,
    filters.minScore,
    filters.maxScore,
    filters.status,
    filters.tags.length > 0 ? filters.tags.join(",") : "",
  ];

  return values.filter((value) => {
    if (typeof value === "number") {
      return true;
    }

    return Boolean(value);
  }).length;
}

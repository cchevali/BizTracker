import type { DealStatus, PrimaryUseCase } from "@/generated/prisma/enums";

import { uniqueStrings } from "@/lib/utils";

import {
  DEFAULT_SORT_OPTION,
  DEFAULT_VIEW_MODE,
  filterQueryKeys,
  primaryUseCaseOptions,
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

function parseNumber(value: string) {
  const normalized = normalizeNumberish(value);

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseNonNegativeNumber(value: string) {
  const parsed = parseNumber(value);
  return parsed !== undefined && parsed >= 0 ? parsed : undefined;
}

function parseScore(value: string) {
  const parsed = parseNonNegativeNumber(value);

  if (parsed === undefined) {
    return undefined;
  }

  return parsed <= 100 ? parsed : undefined;
}

function parseRating(value: string) {
  const parsed = parseNonNegativeNumber(value);

  if (parsed === undefined) {
    return undefined;
  }

  return parsed >= 1 && parsed <= 5 ? parsed : undefined;
}

function parseBoolean(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return undefined;
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

function isPrimaryUseCase(value: string): value is PrimaryUseCase {
  return primaryUseCaseOptions.some((option) => option.value === value);
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
  const rawPrimaryUseCase = takeFirst(input.primaryUseCase).trim();

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
    primaryUseCase: isPrimaryUseCase(rawPrimaryUseCase)
      ? rawPrimaryUseCase
      : undefined,
    minKeepDayJobFit: parseRating(takeFirst(input.minKeepDayJobFit)),
    minQuitDayJobFit: parseRating(takeFirst(input.minQuitDayJobFit)),
    minAiResistanceScore: parseRating(takeFirst(input.minAiResistanceScore)),
    minFinanceabilityRating: parseRating(
      takeFirst(input.minFinanceabilityRating),
    ),
    maxCashToCloseHigh: parseNonNegativeNumber(takeFirst(input.maxCashToCloseHigh)),
    minConservativeCashAfterBrother: parseNumber(
      takeFirst(input.minConservativeCashAfterBrother),
    ),
    sellerFinancingAvailable: parseBoolean(
      takeFirst(input.sellerFinancingAvailable),
    ),
    homeBasedFlag: parseBoolean(takeFirst(input.homeBasedFlag)),
    opsManagerExists: parseBoolean(takeFirst(input.opsManagerExists)),
    maxStaleListingRisk: parseRating(takeFirst(input.maxStaleListingRisk)),
    minDataConfidenceScore: parseRating(
      takeFirst(input.minDataConfidenceScore),
    ),
    beatsCurrentBenchmark: parseBoolean(
      takeFirst(input.beatsCurrentBenchmark),
    ),
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

  if (filters.primaryUseCase) {
    serialized.primaryUseCase = filters.primaryUseCase;
  }

  if (filters.minKeepDayJobFit !== undefined) {
    serialized.minKeepDayJobFit = String(filters.minKeepDayJobFit);
  }

  if (filters.minQuitDayJobFit !== undefined) {
    serialized.minQuitDayJobFit = String(filters.minQuitDayJobFit);
  }

  if (filters.minAiResistanceScore !== undefined) {
    serialized.minAiResistanceScore = String(filters.minAiResistanceScore);
  }

  if (filters.minFinanceabilityRating !== undefined) {
    serialized.minFinanceabilityRating = String(
      filters.minFinanceabilityRating,
    );
  }

  if (filters.maxCashToCloseHigh !== undefined) {
    serialized.maxCashToCloseHigh = String(filters.maxCashToCloseHigh);
  }

  if (filters.minConservativeCashAfterBrother !== undefined) {
    serialized.minConservativeCashAfterBrother = String(
      filters.minConservativeCashAfterBrother,
    );
  }

  if (filters.sellerFinancingAvailable !== undefined) {
    serialized.sellerFinancingAvailable = String(
      filters.sellerFinancingAvailable,
    );
  }

  if (filters.homeBasedFlag !== undefined) {
    serialized.homeBasedFlag = String(filters.homeBasedFlag);
  }

  if (filters.opsManagerExists !== undefined) {
    serialized.opsManagerExists = String(filters.opsManagerExists);
  }

  if (filters.maxStaleListingRisk !== undefined) {
    serialized.maxStaleListingRisk = String(filters.maxStaleListingRisk);
  }

  if (filters.minDataConfidenceScore !== undefined) {
    serialized.minDataConfidenceScore = String(filters.minDataConfidenceScore);
  }

  if (filters.beatsCurrentBenchmark !== undefined) {
    serialized.beatsCurrentBenchmark = String(filters.beatsCurrentBenchmark);
  }

  return serialized;
}

export function buildBusinessListHref(query: FilterQueryRecord = {}) {
  const search = buildSearchParams(query).toString();
  return search ? `/?${search}` : "/";
}

export function buildBusinessExportHref(query: FilterQueryRecord = {}) {
  const search = buildSearchParams(query).toString();
  return search ? `/exports/businesses?${search}` : "/exports/businesses";
}

function buildSearchParams(query: FilterQueryRecord) {
  const params = new URLSearchParams();

  for (const key of filterQueryKeys) {
    const value = query[key];

    if (value) {
      params.set(key, value);
    }
  }

  return params;
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
    filters.primaryUseCase,
    filters.minKeepDayJobFit,
    filters.minQuitDayJobFit,
    filters.minAiResistanceScore,
    filters.minFinanceabilityRating,
    filters.maxCashToCloseHigh,
    filters.minConservativeCashAfterBrother,
    filters.sellerFinancingAvailable,
    filters.homeBasedFlag,
    filters.opsManagerExists,
    filters.maxStaleListingRisk,
    filters.minDataConfidenceScore,
    filters.beatsCurrentBenchmark,
  ];

  return values.filter((value) => {
    if (typeof value === "number") {
      return true;
    }

    if (typeof value === "boolean") {
      return true;
    }

    return Boolean(value);
  }).length;
}

import { BUSINESS_SCENARIO_ASSUMPTIONS } from "./business-scenario";
import { countActiveFilters } from "./business.filters";
import {
  getDealStatusLabel,
  getHistoryEventLabel,
  pipelineViewOptions,
  sortOptions,
  type BusinessDetail,
  type BusinessFilters,
  type FilterQueryRecord,
} from "./business.types";

type ExportValue = string | number | null;

export type BusinessExportBusinessRow = {
  id: string;
  business_name: string;
  source_url: string;
  category: string;
  subcategory: string;
  location: string;
  state_code: string;
  asking_price: number | null;
  revenue: number | null;
  sde: number | null;
  ebitda: number | null;
  employees: number | null;
  summary: string;
  why_it_may_fit: string;
  risks: string;
  broker_name: string;
  broker_firm: string;
  listing_source: string;
  deal_status: string;
  deal_status_label: string;
  pipeline_bucket: string;
  public_source_verified: string;
  owner_dependence_rating: number | null;
  recurring_revenue_rating: number | null;
  transferability_rating: number | null;
  schedule_control_fit_rating: number | null;
  brother_operator_fit_rating: number | null;
  overall_score: number | null;
  notes: string;
  tags: string;
  note_count: number;
  history_event_count: number;
  created_at: string;
  updated_at: string;
  ai_resistance_score: number | null;
  financeability_rating: number | null;
  seller_financing_available: string;
  seller_financing_notes: string;
  operator_skill_dependency: number | null;
  license_dependency: number | null;
  after_hours_burden: number | null;
  capex_risk: number | null;
  regret_if_wrong_score: number | null;
  data_confidence_score: number | null;
  keep_day_job_fit: number | null;
  quit_day_job_fit: number | null;
  primary_use_case: string;
  beats_current_benchmark: string;
  benchmark_notes: string;
  freshness_verified_at: string;
  stale_listing_risk: number | null;
  home_based_flag: string;
  recurring_revenue_percent: number | null;
  owner_hours_claimed: number | null;
  ops_manager_exists: string;
  key_person_risk: number | null;
  cash_to_close_low: number | null;
  cash_to_close_high: number | null;
  cash_to_close_notes: string;
  annual_debt_service_assumed: number | null;
  brother_cash_comp_assumed: number;
  conservative_sde_used: number | null;
  paper_cash_after_brother: number | null;
  conservative_cash_after_brother: number | null;
};

export type BusinessExportNoteRow = {
  business_id: string;
  business_name: string;
  note_id: string;
  created_at: string;
  updated_at: string;
  body: string;
};

export type BusinessExportHistoryRow = {
  business_id: string;
  business_name: string;
  event_id: string;
  event_type: string;
  event_label: string;
  created_at: string;
  description: string;
  metadata_json: string;
};

export type BusinessExportMetadataRow = {
  field: string;
  value: string | number;
};

export type BusinessExportDataset = {
  generatedAt: Date;
  businesses: BusinessExportBusinessRow[];
  notes: BusinessExportNoteRow[];
  history: BusinessExportHistoryRow[];
  metadata: BusinessExportMetadataRow[];
};

export const businessExportColumns = {
  businesses: [
    "id",
    "business_name",
    "source_url",
    "category",
    "subcategory",
    "location",
    "state_code",
    "asking_price",
    "revenue",
    "sde",
    "ebitda",
    "employees",
    "summary",
    "why_it_may_fit",
    "risks",
    "broker_name",
    "broker_firm",
    "listing_source",
    "deal_status",
    "deal_status_label",
    "owner_dependence_rating",
    "recurring_revenue_rating",
    "transferability_rating",
    "schedule_control_fit_rating",
    "brother_operator_fit_rating",
    "overall_score",
    "notes",
    "tags",
    "note_count",
    "history_event_count",
    "created_at",
    "updated_at",
    "ai_resistance_score",
    "financeability_rating",
    "seller_financing_available",
    "seller_financing_notes",
    "operator_skill_dependency",
    "license_dependency",
    "after_hours_burden",
    "capex_risk",
    "regret_if_wrong_score",
    "data_confidence_score",
    "keep_day_job_fit",
    "quit_day_job_fit",
    "primary_use_case",
    "beats_current_benchmark",
    "benchmark_notes",
    "freshness_verified_at",
    "stale_listing_risk",
    "home_based_flag",
    "recurring_revenue_percent",
    "owner_hours_claimed",
    "ops_manager_exists",
    "key_person_risk",
    "cash_to_close_low",
    "cash_to_close_high",
    "cash_to_close_notes",
    "annual_debt_service_assumed",
    "brother_cash_comp_assumed",
    "conservative_sde_used",
    "paper_cash_after_brother",
    "conservative_cash_after_brother",
    "pipeline_bucket",
    "public_source_verified",
  ] as const satisfies ReadonlyArray<keyof BusinessExportBusinessRow>,
  notes: [
    "business_id",
    "business_name",
    "note_id",
    "created_at",
    "updated_at",
    "body",
  ] as const satisfies ReadonlyArray<keyof BusinessExportNoteRow>,
  history: [
    "business_id",
    "business_name",
    "event_id",
    "event_type",
    "event_label",
    "created_at",
    "description",
    "metadata_json",
  ] as const satisfies ReadonlyArray<keyof BusinessExportHistoryRow>,
  metadata: [
    "field",
    "value",
  ] as const satisfies ReadonlyArray<keyof BusinessExportMetadataRow>,
};

const sortLabelByValue = new Map(
  sortOptions.map((option) => [option.value, option.label]),
);

function formatString(value: string | null | undefined) {
  return value ?? "";
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === null || value === undefined) {
    return "Unknown";
  }

  return value ? "Yes" : "No";
}

function formatNullableBooleanFilter(
  value: BusinessFilters["sellerFinancingAvailable"],
) {
  if (value === undefined) {
    return "";
  }

  if (value === "unknown") {
    return "Unknown";
  }

  return value === "true" ? "Yes" : "No";
}

function formatTags(tags: string[]) {
  return tags.join(", ");
}

function stringifyMetadata(value: Record<string, unknown> | null | undefined) {
  return value ? JSON.stringify(value) : "";
}

function createMetadataRows(
  businesses: BusinessDetail[],
  filters: BusinessFilters,
  query: FilterQueryRecord,
  generatedAt: Date,
): BusinessExportMetadataRow[] {
  const notesCount = businesses.reduce(
    (sum, business) => sum + business.noteEntries.length,
    0,
  );
  const historyCount = businesses.reduce(
    (sum, business) => sum + business.historyEvents.length,
    0,
  );
  const activeFilterCount = countActiveFilters(filters);

  return [
    {
      field: "generated_at",
      value: generatedAt.toISOString(),
    },
    {
      field: "schema_version",
      value: 2,
    },
    {
      field: "export_scope",
      value: activeFilterCount > 0 ? "current filtered view" : "all businesses",
    },
    {
      field: "business_count",
      value: businesses.length,
    },
    {
      field: "note_row_count",
      value: notesCount,
    },
    {
      field: "history_row_count",
      value: historyCount,
    },
    {
      field: "active_filter_count",
      value: activeFilterCount,
    },
    {
      field: "sort",
      value: filters.sort,
    },
    {
      field: "pipeline_view",
      value: filters.pipelineView,
    },
    {
      field: "pipeline_view_label",
      value:
        pipelineViewOptions.find((option) => option.value === filters.pipelineView)
          ?.label ?? filters.pipelineView,
    },
    {
      field: "sort_label",
      value: sortLabelByValue.get(filters.sort) ?? filters.sort,
    },
    {
      field: "view",
      value: filters.view,
    },
    {
      field: "search_query",
      value: filters.q,
    },
    {
      field: "state",
      value: filters.state,
    },
    {
      field: "category",
      value: filters.category,
    },
    {
      field: "status",
      value: filters.status ?? "",
    },
    {
      field: "status_label",
      value: filters.status ? getDealStatusLabel(filters.status) : "Active pipeline default",
    },
    {
      field: "tags",
      value: formatTags(filters.tags),
    },
    {
      field: "min_ask",
      value: filters.minAsk ?? "",
    },
    {
      field: "max_ask",
      value: filters.maxAsk ?? "",
    },
    {
      field: "min_sde",
      value: filters.minSde ?? "",
    },
    {
      field: "max_sde",
      value: filters.maxSde ?? "",
    },
    {
      field: "min_score",
      value: filters.minScore ?? "",
    },
    {
      field: "max_score",
      value: filters.maxScore ?? "",
    },
    {
      field: "primary_use_case",
      value: filters.primaryUseCase ?? "",
    },
    {
      field: "min_keep_day_job_fit",
      value: filters.minKeepDayJobFit ?? "",
    },
    {
      field: "min_quit_day_job_fit",
      value: filters.minQuitDayJobFit ?? "",
    },
    {
      field: "min_ai_resistance_score",
      value: filters.minAiResistanceScore ?? "",
    },
    {
      field: "min_financeability_rating",
      value: filters.minFinanceabilityRating ?? "",
    },
    {
      field: "max_cash_to_close_high",
      value: filters.maxCashToCloseHigh ?? "",
    },
    {
      field: "min_conservative_cash_after_brother",
      value: filters.minConservativeCashAfterBrother ?? "",
    },
    {
      field: "seller_financing_available",
      value: formatNullableBooleanFilter(filters.sellerFinancingAvailable),
    },
    {
      field: "home_based_flag",
      value: formatNullableBooleanFilter(filters.homeBasedFlag),
    },
    {
      field: "ops_manager_exists",
      value: formatNullableBooleanFilter(filters.opsManagerExists),
    },
    {
      field: "max_stale_listing_risk",
      value: filters.maxStaleListingRisk ?? "",
    },
    {
      field: "min_data_confidence_score",
      value: filters.minDataConfidenceScore ?? "",
    },
    {
      field: "beats_current_benchmark",
      value: formatBoolean(filters.beatsCurrentBenchmark),
    },
    {
      field: "assumption_brother_cash_comp",
      value: BUSINESS_SCENARIO_ASSUMPTIONS.BROTHER_CASH_COMP,
    },
    {
      field: "assumption_sba_ltv",
      value: BUSINESS_SCENARIO_ASSUMPTIONS.SBA_LTV,
    },
    {
      field: "assumption_sba_interest_rate",
      value: BUSINESS_SCENARIO_ASSUMPTIONS.SBA_INTEREST_RATE,
    },
    {
      field: "assumption_sba_term_years",
      value: BUSINESS_SCENARIO_ASSUMPTIONS.SBA_TERM_YEARS,
    },
    {
      field: "assumption_cash_to_close_low_pct",
      value: BUSINESS_SCENARIO_ASSUMPTIONS.CASH_TO_CLOSE_LOW_PCT,
    },
    {
      field: "assumption_cash_to_close_high_pct",
      value: BUSINESS_SCENARIO_ASSUMPTIONS.CASH_TO_CLOSE_HIGH_PCT,
    },
    {
      field: "assumption_conservative_sde_haircut",
      value: BUSINESS_SCENARIO_ASSUMPTIONS.CONSERVATIVE_SDE_HAIRCUT,
    },
    {
      field: "query_json",
      value: JSON.stringify(query),
    },
  ];
}

function mapBusinessRow(business: BusinessDetail): BusinessExportBusinessRow {
  return {
    id: business.id,
    business_name: business.businessName,
    source_url: formatString(business.sourceUrl),
    category: business.category,
    subcategory: formatString(business.subcategory),
    location: business.location,
    state_code: formatString(business.stateCode),
    asking_price: business.askingPrice,
    revenue: business.revenue,
    sde: business.sde,
    ebitda: business.ebitda,
    employees: business.employees,
    summary: business.summary,
    why_it_may_fit: business.whyItMayFit,
    risks: business.risks,
    broker_name: formatString(business.brokerName),
    broker_firm: formatString(business.brokerFirm),
    listing_source: formatString(business.listingSource),
    deal_status: business.dealStatus,
    deal_status_label: getDealStatusLabel(business.dealStatus),
    pipeline_bucket: business.pipelineBucket,
    public_source_verified: formatBoolean(business.publicSourceVerified),
    owner_dependence_rating: business.ownerDependenceRating,
    recurring_revenue_rating: business.recurringRevenueRating,
    transferability_rating: business.transferabilityRating,
    schedule_control_fit_rating: business.scheduleControlFitRating,
    brother_operator_fit_rating: business.brotherOperatorFitRating,
    overall_score: business.overallScore,
    notes: formatString(business.notes),
    tags: formatTags(business.tags),
    note_count: business.noteEntries.length,
    history_event_count: business.historyEvents.length,
    created_at: business.createdAt,
    updated_at: business.updatedAt,
    ai_resistance_score: business.aiResistanceScore,
    financeability_rating: business.financeabilityRating,
    seller_financing_available: formatBoolean(business.sellerFinancingAvailable),
    seller_financing_notes: formatString(business.sellerFinancingNotes),
    operator_skill_dependency: business.operatorSkillDependency,
    license_dependency: business.licenseDependency,
    after_hours_burden: business.afterHoursBurden,
    capex_risk: business.capexRisk,
    regret_if_wrong_score: business.regretIfWrongScore,
    data_confidence_score: business.dataConfidenceScore,
    keep_day_job_fit: business.keepDayJobFit,
    quit_day_job_fit: business.quitDayJobFit,
    primary_use_case: business.primaryUseCase ?? "",
    beats_current_benchmark: formatBoolean(business.beatsCurrentBenchmark),
    benchmark_notes: formatString(business.benchmarkNotes),
    freshness_verified_at: formatString(business.freshnessVerifiedAt),
    stale_listing_risk: business.staleListingRisk,
    home_based_flag: formatBoolean(business.homeBasedFlag),
    recurring_revenue_percent: business.recurringRevenuePercent,
    owner_hours_claimed: business.ownerHoursClaimed,
    ops_manager_exists: formatBoolean(business.opsManagerExists),
    key_person_risk: business.keyPersonRisk,
    cash_to_close_low: business.cashToCloseLow,
    cash_to_close_high: business.cashToCloseHigh,
    cash_to_close_notes: formatString(business.cashToCloseNotes),
    annual_debt_service_assumed: business.annualDebtServiceAssumed,
    brother_cash_comp_assumed: business.brotherCashCompAssumed,
    conservative_sde_used: business.conservativeSdeUsed,
    paper_cash_after_brother: business.paperCashAfterBrother,
    conservative_cash_after_brother: business.conservativeCashAfterBrother,
  };
}

function mapNoteRows(business: BusinessDetail): BusinessExportNoteRow[] {
  return business.noteEntries.map((note) => ({
    business_id: business.id,
    business_name: business.businessName,
    note_id: note.id,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
    body: note.body,
  }));
}

function mapHistoryRows(business: BusinessDetail): BusinessExportHistoryRow[] {
  return business.historyEvents.map((event) => ({
    business_id: business.id,
    business_name: business.businessName,
    event_id: event.id,
    event_type: event.eventType,
    event_label: getHistoryEventLabel(event.eventType),
    created_at: event.createdAt,
    description: event.description,
    metadata_json: stringifyMetadata(event.metadata),
  }));
}

export function createBusinessExportDataset({
  businesses,
  filters,
  query,
  generatedAt = new Date(),
}: {
  businesses: BusinessDetail[];
  filters: BusinessFilters;
  query: FilterQueryRecord;
  generatedAt?: Date;
}): BusinessExportDataset {
  return {
    generatedAt,
    businesses: businesses.map(mapBusinessRow),
    notes: businesses.flatMap(mapNoteRows),
    history: businesses.flatMap(mapHistoryRows),
    metadata: createMetadataRows(businesses, filters, query, generatedAt),
  };
}

export function buildBusinessExportFilename(generatedAt: Date) {
  const safeTimestamp = generatedAt
    .toISOString()
    .replace(/[:]/g, "-")
    .replace(/\.\d{3}Z$/, "Z");

  return `biztracker-export-${safeTimestamp}.xlsx`;
}

export function getColumnWidths<Row extends Record<string, ExportValue>>(
  columns: readonly (keyof Row)[],
  rows: Row[],
) {
  return columns.map((column) => {
    const longestValue = rows.reduce((longest, row) => {
      const value = row[column];

      if (value === null || value === undefined) {
        return longest;
      }

      return Math.max(longest, String(value).length);
    }, String(column).length);

    return Math.min(Math.max(longestValue + 2, 14), 48);
  });
}

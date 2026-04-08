import { describe, expect, it } from "vitest";

import {
  businessExportColumns,
  buildBusinessExportFilename,
  createBusinessExportDataset,
} from "@/features/businesses/domain/business-export";
import { calculateBusinessScenario } from "@/features/businesses/domain/business-scenario";
import type {
  BusinessDetail,
  BusinessFilters,
  FilterQueryRecord,
} from "@/features/businesses/domain/business.types";

function createBusiness(overrides: Partial<BusinessDetail> = {}): BusinessDetail {
  const scenario = calculateBusinessScenario({
    askingPrice: 1450000,
    sde: 430000,
  });

  return {
    ...scenario,
    id: "business-1",
    businessName: "Northshore HVAC",
    sourceUrl: "https://chatgpt.com/c/northshore-hvac",
    category: "Home Services",
    subcategory: "HVAC",
    location: "Raleigh, NC",
    stateCode: "NC",
    askingPrice: 1450000,
    revenue: 2100000,
    sde: 430000,
    ebitda: 312000,
    employees: 12,
    summary: "Residential HVAC business with dense service routes and maintenance plans.",
    whyItMayFit: "Strong recurring revenue and operator-friendly dispatch rhythms.",
    risks: "Lead installer concentration remains a diligence risk.",
    brokerName: "Maya Jensen",
    brokerFirm: "Atlantic Deal Group",
    listingSource: "BizBuySell",
    dealStatus: "UNDER_REVIEW",
    ownerDependenceRating: 3,
    recurringRevenueRating: 5,
    transferabilityRating: 4,
    scheduleControlFitRating: 4,
    brotherOperatorFitRating: 5,
    aiResistanceScore: 5,
    financeabilityRating: 4,
    sellerFinancingAvailable: true,
    sellerFinancingNotes: "Broker mentioned seller paper may be possible for the right buyer.",
    operatorSkillDependency: 2,
    licenseDependency: 2,
    afterHoursBurden: 3,
    capexRisk: 3,
    regretIfWrongScore: 4,
    dataConfidenceScore: 4,
    keepDayJobFit: 4,
    quitDayJobFit: 4,
    primaryUseCase: "either",
    beatsCurrentBenchmark: true,
    benchmarkNotes: "Beats the current cleaning benchmark because route density and cash flow are stronger.",
    freshnessVerifiedAt: "2026-04-06T09:30:00.000Z",
    staleListingRisk: 2,
    homeBasedFlag: false,
    recurringRevenuePercent: 38,
    ownerHoursClaimed: 45,
    opsManagerExists: true,
    keyPersonRisk: 3,
    cashToCloseNotes: "Truck capex may push the close-cash range a bit higher than the default scenario.",
    overallScore: 84,
    notes: "Need deeper customer concentration review.",
    tags: ["hvac", "recurring", "service"],
    createdAt: "2026-04-05T12:00:00.000Z",
    updatedAt: "2026-04-05T16:30:00.000Z",
    noteEntries: [
      {
        id: "note-1",
        body: "Broker sent updated maintenance agreement breakdown.",
        createdAt: "2026-04-05T13:00:00.000Z",
        updatedAt: "2026-04-05T13:15:00.000Z",
      },
    ],
    historyEvents: [
      {
        id: "history-1",
        eventType: "STATUS_CHANGED",
        description: "Status changed from WATCHLIST to UNDER_REVIEW.",
        createdAt: "2026-04-05T15:00:00.000Z",
        metadata: {
          from: "WATCHLIST",
          to: "UNDER_REVIEW",
        },
      },
    ],
    ...overrides,
  };
}

describe("business export dataset", () => {
  it("builds workbook-ready rows and metadata from the current view", () => {
    const generatedAt = new Date("2026-04-05T17:45:00.000Z");
    const filters: BusinessFilters = {
      q: "hvac",
      view: "cards",
      sort: "score",
      state: "NC",
      category: "Home Services",
      minAsk: 1000000,
      maxAsk: 2000000,
      minSde: 300000,
      maxSde: undefined,
      minScore: 75,
      maxScore: undefined,
      status: "UNDER_REVIEW",
      tags: ["recurring", "service"],
      primaryUseCase: undefined,
      minKeepDayJobFit: undefined,
      minQuitDayJobFit: undefined,
      minAiResistanceScore: undefined,
      minFinanceabilityRating: undefined,
      maxCashToCloseHigh: undefined,
      minConservativeCashAfterBrother: undefined,
      sellerFinancingAvailable: undefined,
      homeBasedFlag: undefined,
      opsManagerExists: undefined,
      maxStaleListingRisk: undefined,
      minDataConfidenceScore: undefined,
      beatsCurrentBenchmark: undefined,
    };
    const query: FilterQueryRecord = {
      q: "hvac",
      view: "cards",
      sort: "score",
      state: "NC",
      category: "Home Services",
      minAsk: "1000000",
      maxAsk: "2000000",
      minSde: "300000",
      minScore: "75",
      status: "UNDER_REVIEW",
      tags: "recurring,service",
    };

    const dataset = createBusinessExportDataset({
      businesses: [createBusiness()],
      filters,
      query,
      generatedAt,
    });

    expect(dataset.businesses).toEqual([
      expect.objectContaining({
        business_name: "Northshore HVAC",
        deal_status_label: "Under review",
        ai_resistance_score: 5,
        keep_day_job_fit: 4,
        primary_use_case: "either",
        cash_to_close_high: 290000,
        tags: "hvac, recurring, service",
        note_count: 1,
        history_event_count: 1,
      }),
    ]);
    expect(dataset.notes).toEqual([
      expect.objectContaining({
        business_id: "business-1",
        body: "Broker sent updated maintenance agreement breakdown.",
      }),
    ]);
    expect(dataset.history).toEqual([
      expect.objectContaining({
        event_type: "STATUS_CHANGED",
        event_label: "Status changed",
        metadata_json: JSON.stringify({
          from: "WATCHLIST",
          to: "UNDER_REVIEW",
        }),
      }),
    ]);
    expect(dataset.metadata).toEqual(
      expect.arrayContaining([
        { field: "generated_at", value: "2026-04-05T17:45:00.000Z" },
        { field: "schema_version", value: 2 },
        { field: "export_scope", value: "current filtered view" },
        { field: "business_count", value: 1 },
        { field: "sort_label", value: "Score (high to low)" },
        { field: "status_label", value: "Under review" },
        { field: "query_json", value: JSON.stringify(query) },
      ]),
    );
    expect(businessExportColumns.businesses.slice(0, 32)).toEqual([
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
    ]);
    expect(businessExportColumns.businesses.slice(32)).toEqual([
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
    ]);
  });

  it("creates a stable timestamped filename", () => {
    expect(buildBusinessExportFilename(new Date("2026-04-05T17:45:00.000Z"))).toBe(
      "biztracker-export-2026-04-05T17-45-00Z.xlsx",
    );
  });
});

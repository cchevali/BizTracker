import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { createBusinessExportDataset } from "@/features/businesses/domain/business-export";
import { calculateBusinessScenario } from "@/features/businesses/domain/business-scenario";
import { parseBusinessWorkbook } from "@/features/businesses/domain/business-workbook-import";
import type {
  BusinessDetail,
  BusinessFilters,
} from "@/features/businesses/domain/business.types";
import { buildBusinessExportWorkbook } from "@/features/businesses/utils/business-export-workbook";

function createBusiness(): BusinessDetail {
  return {
    ...calculateBusinessScenario({
      askingPrice: 750000,
      sde: 225000,
    }),
    id: "business-1",
    businessName: "Fairfax Dryer Vent Cleaning",
    sourceUrl: "https://www.bizbuysell.com/business-opportunity/dryer-vent/1/",
    category: "Home Services",
    subcategory: "Dryer Vent Cleaning",
    location: "Fairfax, VA",
    stateCode: "VA",
    askingPrice: 750000,
    revenue: 610000,
    sde: 225000,
    ebitda: null,
    employees: 4,
    summary: "Procedural route-style service business with recurring customer reminders.",
    whyItMayFit: "Trainable work, low capex, and plausible brother-operated day-to-day flow.",
    risks: "Customer acquisition quality and route density still need real diligence.",
    brokerName: "Alex Broker",
    brokerFirm: "Main Street Deals",
    listingSource: "BizBuySell",
    dealStatus: "UNDER_REVIEW",
    ownerDependenceRating: 2,
    recurringRevenueRating: 4,
    transferabilityRating: 4,
    scheduleControlFitRating: 4,
    brotherOperatorFitRating: 5,
    aiResistanceScore: 5,
    financeabilityRating: 4,
    sellerFinancingAvailable: true,
    sellerFinancingNotes: "Seller open to discussing a small note.",
    operatorSkillDependency: 2,
    licenseDependency: 1,
    afterHoursBurden: 1,
    capexRisk: 1,
    regretIfWrongScore: 4,
    dataConfidenceScore: 4,
    keepDayJobFit: 5,
    quitDayJobFit: 3,
    primaryUseCase: "bridge_while_employed",
    beatsCurrentBenchmark: true,
    benchmarkNotes: "Beats the low-capital benchmark on route density and service repeatability.",
    freshnessVerifiedAt: "2026-04-07T12:00:00.000Z",
    staleListingRisk: 2,
    homeBasedFlag: true,
    recurringRevenuePercent: 42,
    ownerHoursClaimed: 35,
    opsManagerExists: false,
    keyPersonRisk: 2,
    cashToCloseNotes: "Working-capital needs could land near the top of the default range.",
    overallScore: 84,
    notes: "Backfill analysis placeholder.",
    tags: ["dryer-vent", "home-services"],
    createdAt: "2026-04-07T12:00:00.000Z",
    updatedAt: "2026-04-07T13:00:00.000Z",
    noteEntries: [],
    historyEvents: [],
  };
}

const filters: BusinessFilters = {
  q: "",
  view: "table",
  sort: "updated",
  state: "",
  category: "",
  minAsk: undefined,
  maxAsk: undefined,
  minSde: undefined,
  maxSde: undefined,
  minScore: undefined,
  maxScore: undefined,
  status: undefined,
  tags: [],
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

describe("business-workbook-import", () => {
  it("imports the current workbook schema including new nullable fields", async () => {
    const dataset = createBusinessExportDataset({
      businesses: [createBusiness()],
      filters,
      query: {},
      generatedAt: new Date("2026-04-07T15:00:00.000Z"),
    });
    const workbook = await buildBusinessExportWorkbook(dataset);

    const imported = await parseBusinessWorkbook(workbook);

    expect(imported).toEqual([
      expect.objectContaining({
        businessName: "Fairfax Dryer Vent Cleaning",
        primaryUseCase: "bridge_while_employed",
        aiResistanceScore: 5,
        financeabilityRating: 4,
        sellerFinancingAvailable: true,
        recurringRevenuePercent: 42,
      }),
    ]);
  });

  it("imports old workbooks that do not include the new columns", async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("businesses");

    worksheet.addRow([
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
    worksheet.addRow([
      "business-1",
      "Legacy Export Deal",
      "https://example.com/legacy",
      "Home Services",
      "Cleaning",
      "Richmond, VA",
      "VA",
      500000,
      700000,
      200000,
      "",
      3,
      "Legacy export summary",
      "Legacy fit rationale",
      "Legacy risks",
      "",
      "",
      "BizBuySell",
      "NEW",
      "New",
      3,
      4,
      4,
      4,
      4,
      80,
      "Legacy notes",
      "legacy, export",
      0,
      0,
      "2026-04-07T10:00:00.000Z",
      "2026-04-07T11:00:00.000Z",
    ]);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    const imported = await parseBusinessWorkbook(buffer);

    expect(imported).toEqual([
      expect.objectContaining({
        businessName: "Legacy Export Deal",
        aiResistanceScore: null,
        keepDayJobFit: null,
        sellerFinancingAvailable: null,
      }),
    ]);
  });
});

import { describe, expect, it } from "vitest";

import {
  buildBusinessExportFilename,
  createBusinessExportDataset,
} from "@/features/businesses/domain/business-export";
import type {
  BusinessDetail,
  BusinessFilters,
  FilterQueryRecord,
} from "@/features/businesses/domain/business.types";

function createBusiness(overrides: Partial<BusinessDetail> = {}): BusinessDetail {
  return {
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
        { field: "export_scope", value: "current filtered view" },
        { field: "business_count", value: 1 },
        { field: "sort_label", value: "Score (high to low)" },
        { field: "status_label", value: "Under review" },
        { field: "query_json", value: JSON.stringify(query) },
      ]),
    );
  });

  it("creates a stable timestamped filename", () => {
    expect(buildBusinessExportFilename(new Date("2026-04-05T17:45:00.000Z"))).toBe(
      "biztracker-export-2026-04-05T17-45-00Z.xlsx",
    );
  });
});

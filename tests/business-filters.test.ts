import { describe, expect, it } from "vitest";

import {
  buildBusinessExportHref,
  buildBusinessListHref,
  countActiveFilters,
  formatTagsForInput,
  parseBusinessFilters,
  patchBusinessListQuery,
  serializeBusinessFilters,
  splitTags,
} from "@/features/businesses/domain/business.filters";

describe("business.filters", () => {
  it("normalizes incoming search params and falls back to defaults", () => {
    const filters = parseBusinessFilters({
      q: "  HVAC leads  ",
      view: "kanban",
      sort: "profit",
      state: "nc",
      category: " Home Services ",
      minAsk: "$1,250,000",
      maxAsk: "-5",
      minSde: [" 250000 "],
      maxSde: "not-a-number",
      minScore: "70",
      maxScore: "120",
      status: "RESEARCHING",
      tags: " HVAC, recurring, HVAC,  service ",
    });

    expect(filters).toEqual({
      q: "HVAC leads",
      view: "table",
      sort: "ask-price",
      state: "NC",
      category: "Home Services",
      minAsk: 1250000,
      maxAsk: undefined,
      minSde: 250000,
      maxSde: undefined,
      minScore: 70,
      maxScore: undefined,
      status: "RESEARCHING",
      tags: ["hvac", "recurring", "service"],
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
    });
  });

  it("serializes only non-default values and round-trips tags", () => {
    const filters = parseBusinessFilters({
      q: "bookkeeping",
      view: "cards",
      sort: "financeability",
      state: "fl",
      primaryUseCase: "bridge_while_employed",
      minKeepDayJobFit: "4",
      sellerFinancingAvailable: "true",
      tags: " subscription, remote-friendly ",
      minScore: "80",
    });

    expect(serializeBusinessFilters(filters)).toEqual({
      q: "bookkeeping",
      view: "cards",
      sort: "financeability",
      state: "FL",
      primaryUseCase: "bridge_while_employed",
      minKeepDayJobFit: "4",
      sellerFinancingAvailable: "true",
      minScore: "80",
      tags: "subscription,remote-friendly",
    });
  });

  it("builds hrefs and patches query values predictably", () => {
    const baseQuery = {
      q: "hvac",
      view: "cards",
      sort: "score",
      state: "SC",
    } as const;

    const patched = patchBusinessListQuery(baseQuery, {
      view: "table",
      state: undefined,
      minScore: "75",
      maxCashToCloseHigh: "200000",
    });

    expect(patched).toEqual({
      q: "hvac",
      view: "table",
      sort: "score",
      minScore: "75",
      maxCashToCloseHigh: "200000",
    });
    expect(buildBusinessListHref(patched)).toBe(
      "/?q=hvac&view=table&sort=score&minScore=75&maxCashToCloseHigh=200000",
    );
    expect(buildBusinessExportHref(patched)).toBe(
      "/exports/businesses?q=hvac&view=table&sort=score&minScore=75&maxCashToCloseHigh=200000",
    );
  });

  it("counts active filters and formats tag helpers", () => {
    const filters = parseBusinessFilters({
      q: "cleaning",
      category: "Facility Services",
      minAsk: "1000000",
      minDataConfidenceScore: "4",
      tags: "b2b, recurring",
    });

    expect(countActiveFilters(filters)).toBe(5);
    expect(splitTags(" recurring, b2b, recurring ")).toEqual([
      "recurring",
      "b2b",
    ]);
    expect(formatTagsForInput(["recurring", "b2b"])).toBe("recurring, b2b");
  });
});

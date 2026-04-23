import { describe, expect, it } from "vitest";

import {
  RESEARCHED_LISTING_NOTE_HEADING,
  researchedListingSeeds,
} from "../scripts/researched-listings-2026-04-23-requested.data";

function getSeed(businessName: string) {
  const seed = researchedListingSeeds.find(
    (candidate) => candidate.businessName === businessName,
  );

  expect(seed).toBeDefined();
  return seed!;
}

describe("2026-04-23 requested researched listing batch", () => {
  it("keeps the requested 2026-04-23 landscaping comp batch unique and diligence-ready", () => {
    expect(researchedListingSeeds).toHaveLength(5);

    const names = new Set<string>();
    const sourceUrls = new Set<string>();

    for (const seed of researchedListingSeeds) {
      expect(names.has(seed.businessName)).toBe(false);
      expect(sourceUrls.has(seed.sourceUrl)).toBe(false);

      names.add(seed.businessName);
      sourceUrls.add(seed.sourceUrl);

      expect(seed.managedBusinessData.notes).toContain("Observed:");
      expect(seed.managedBusinessData.notes).toContain("Inference:");
      expect(seed.managedBusinessData.notes).toContain("Missing:");
      expect(seed.managedBusinessData.notes).toContain(
        "Top 3 follow-up questions:",
      );
      expect(seed.managedBusinessData.notes).toContain(
        RESEARCHED_LISTING_NOTE_HEADING,
      );
    }
  });

  it("keeps the Texas route-density comp app-compatible with the existing pending status vocabulary", () => {
    const seed = getSeed(
      "High-Margin Landscaping Co. with Route Density in Growth Corridor",
    );

    expect(seed.managedBusinessData.dealStatus).toBe("LETTER_OF_INTENT");
    expect(seed.managedBusinessData.sellerFinancingAvailable).toBe(true);
    expect(seed.managedBusinessData.recurringRevenuePercent).toBe(75);
    expect(seed.managedBusinessData.tags).toContain("pending");
    expect(seed.managedBusinessData.notes).toContain("Sale Pending");
  });

  it("captures the Arizona landscaping record as a home-based, owner-active tree-service comp", () => {
    const seed = getSeed(
      "39-Year Landscaping Business – Loyal Clients & High Profits",
    );

    expect(seed.managedBusinessData.employees).toBe(20);
    expect(seed.managedBusinessData.homeBasedFlag).toBe(true);
    expect(seed.managedBusinessData.notes).toContain("20 full-time employees");
    expect(seed.managedBusinessData.notes).toContain("home-based office");
    expect(seed.managedBusinessData.notes).toContain("owner who remains active");
  });
});

import { describe, expect, it } from "vitest";

import {
  RESEARCHED_LISTING_NOTE_HEADING,
  researchedListingSeeds,
} from "../scripts/researched-listings-2026-04-14.data";

describe("2026-04-14 researched listing batch", () => {
  it("keeps the 2026-04-14 researched batch unique and diligence-ready", () => {
    expect(researchedListingSeeds).toHaveLength(5);

    const names = new Set<string>();
    const sourceUrls = new Set<string>();

    for (const seed of researchedListingSeeds) {
      expect(names.has(seed.businessName)).toBe(false);
      expect(sourceUrls.has(seed.sourceUrl)).toBe(false);
      names.add(seed.businessName);
      sourceUrls.add(seed.sourceUrl);

      expect(seed.managedBusinessData.dealStatus).toBe("RESEARCHING");
      expect(seed.managedBusinessData.notes).toContain("Observed:");
      expect(seed.managedBusinessData.notes).toContain("Inference:");
      expect(seed.managedBusinessData.notes).toContain("Missing:");
      expect(seed.managedBusinessData.notes).toContain("Top 3 follow-up questions:");
      expect(seed.managedBusinessData.notes).toContain(
        RESEARCHED_LISTING_NOTE_HEADING,
      );
    }
  });

  it("keeps the restoration anomaly visible instead of silently normalizing it away", () => {
    const restorationSeed = researchedListingSeeds.find((seed) =>
      seed.businessName.includes("Property Damage & Restoration"),
    );

    expect(restorationSeed?.managedBusinessData.askingPrice).toBe(140000);
    expect(restorationSeed?.managedBusinessData.dataConfidenceScore).toBe(1);
    expect(restorationSeed?.managedBusinessData.staleListingRisk).toBeGreaterThanOrEqual(4);
    expect(restorationSeed?.managedBusinessData.benchmarkNotes).toContain("2306305");
    expect(restorationSeed?.managedBusinessData.cashToCloseNotes).toContain("140000");
  });
});

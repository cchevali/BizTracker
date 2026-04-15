import { describe, expect, it } from "vitest";

import {
  RESEARCHED_LISTING_NOTE_HEADING,
  researchedListingSeeds,
} from "../scripts/researched-listings-2026-04-15-requested.data";

describe("2026-04-15 requested researched listing batch", () => {
  it("keeps the requested 2026-04-15 researched batch unique and diligence-ready", () => {
    expect(researchedListingSeeds).toHaveLength(12);

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
      expect(seed.managedBusinessData.notes).toContain("Top 3 follow-up questions:");
      expect(seed.managedBusinessData.notes).toContain(
        RESEARCHED_LISTING_NOTE_HEADING,
      );
    }
  });

  it("maps the pending Central Ohio landscaping listing into the existing tracker status vocabulary", () => {
    const landscapingSeed = researchedListingSeeds.find((seed) =>
      seed.businessName.includes("Landscaping /Hardscaping"),
    );

    expect(landscapingSeed?.managedBusinessData.dealStatus).toBe(
      "LETTER_OF_INTENT",
    );
    expect(landscapingSeed?.managedBusinessData.tags).toContain("pending");
    expect(landscapingSeed?.managedBusinessData.notes).toContain("Sale Pending");
    expect(landscapingSeed?.managedBusinessData.notes).toContain("Under Contract");
  });

  it("keeps the organic lawn and pest listing conservative when the page withholds SDE and conflicts on price", () => {
    const organicSeed = researchedListingSeeds.find((seed) =>
      seed.businessName.includes("Organic Lawn Care"),
    );

    expect(organicSeed?.managedBusinessData.sde).toBeNull();
    expect(organicSeed?.managedBusinessData.dataConfidenceScore).toBe(2);
    expect(organicSeed?.managedBusinessData.sellerFinancingAvailable).toBe(true);
    expect(organicSeed?.managedBusinessData.notes).toContain("314000");
    expect(organicSeed?.managedBusinessData.notes).toContain("350000");
  });
});

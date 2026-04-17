import { describe, expect, it } from "vitest";

import {
  RESEARCHED_LISTING_NOTE_HEADING,
  researchedListingSeeds,
} from "../scripts/researched-listings-2026-04-17-requested.data";

function getSeed(businessName: string) {
  const seed = researchedListingSeeds.find(
    (candidate) => candidate.businessName === businessName,
  );

  expect(seed).toBeDefined();
  return seed!;
}

describe("2026-04-17 requested researched listing batch", () => {
  it("keeps the requested 2026-04-17 researched batch unique and diligence-ready", () => {
    expect(researchedListingSeeds).toHaveLength(3);

    const sourceUrls = new Set<string>();

    for (const seed of researchedListingSeeds) {
      sourceUrls.add(seed.sourceUrl);

      expect(seed.managedBusinessData.dealStatus).toBe("NEW");
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

    expect(sourceUrls.size).toBe(researchedListingSeeds.length);
  });

  it("treats the Clifton outdoor-services listing as a top-tier large-scale contender", () => {
    const seed = getSeed(
      "Established Landscaping, Snow Plowing, Hardscape & Concrete Company",
    );

    expect(seed.managedBusinessData.beatsCurrentBenchmark).toBe(true);
    expect(seed.managedBusinessData.opsManagerExists).toBe(true);
    expect(seed.managedBusinessData.homeBasedFlag).toBe(false);
    expect(seed.sourceUrl).toContain("/2445240/");
    expect(seed.managedBusinessData.notes).toContain("40+ employees");
    expect(seed.managedBusinessData.notes).toContain("3-year snow contracts");
    expect(seed.managedBusinessData.notes).toContain("management team");
  });

  it("treats Wayne as a top-tier verified fit under the current thesis", () => {
    const seed = getSeed(
      "Established Landscaping & Snow Removal Company | $500K SDE | 30+ Years",
    );

    expect(seed.listingSource).toBe("BizQuest");
    expect(seed.sourceUrl).toContain("/BW2480416/");
    expect(seed.managedBusinessData.beatsCurrentBenchmark).toBe(true);
    expect(seed.managedBusinessData.keepDayJobFit).toBe(5);
    expect(seed.managedBusinessData.quitDayJobFit).toBe(5);
    expect(seed.managedBusinessData.homeBasedFlag).toBe(false);
    expect(seed.managedBusinessData.notes).toContain("four full crews");
    expect(seed.managedBusinessData.notes).toContain("Wayne County MI");
  });

  it("keeps Tampa as a real contender below the top tier with recurring-maintenance depth", () => {
    const seed = getSeed(
      "Scalable Landscaping Platform | 50% Recurring Revenue | Tampa",
    );

    expect(seed.listingSource).toBe("BizBuySell");
    expect(seed.sourceUrl).toContain("/2479308/");
    expect(seed.managedBusinessData.recurringRevenuePercent).toBe(50);
    expect(seed.managedBusinessData.employees).toBe(20);
    expect(seed.managedBusinessData.beatsCurrentBenchmark).toBe(false);
    expect(seed.managedBusinessData.notes).toContain("50 percent recurring");
    expect(seed.managedBusinessData.notes).toContain("20 full-time employees");
  });
});

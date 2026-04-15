import { describe, expect, it } from "vitest";

import {
  RESEARCHED_LISTING_NOTE_HEADING,
  researchedListingSeeds,
} from "../scripts/researched-listings-2026-04-15.data";

describe("2026-04-15 researched listing batch", () => {
  it("keeps the 2026-04-15 researched batch unique and diligence-ready", () => {
    expect(researchedListingSeeds).toHaveLength(4);

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

  it("maps the public sale-pending plumbing listing into the tracker status vocabulary explicitly", () => {
    const plumbingSeed = researchedListingSeeds.find((seed) =>
      seed.businessName.includes("Central Ohio Plumbing"),
    );

    expect(plumbingSeed?.managedBusinessData.dealStatus).toBe("LETTER_OF_INTENT");
    expect(plumbingSeed?.managedBusinessData.tags).toContain("pending");
    expect(plumbingSeed?.managedBusinessData.notes).toContain("Sale Pending");
  });

  it("keeps the Fairfax remodeling listing conservative when the public SDE story conflicts", () => {
    const remodelingSeed = researchedListingSeeds.find((seed) =>
      seed.businessName.includes("Residential Remodeling"),
    );

    expect(remodelingSeed?.managedBusinessData.dataConfidenceScore).toBe(2);
    expect(remodelingSeed?.managedBusinessData.homeBasedFlag).toBe(true);
    expect(remodelingSeed?.managedBusinessData.notes).toContain("1013212");
    expect(remodelingSeed?.managedBusinessData.notes).toContain("881781");
  });
});

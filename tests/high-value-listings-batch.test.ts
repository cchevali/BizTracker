import { describe, expect, it } from "vitest";

import {
  HIGH_VALUE_LISTING_NOTE_HEADING,
  highValueListingSeeds,
} from "../scripts/high-value-listings-2026-04-11.data";

describe("high-value listing batch", () => {
  it("keeps the 2026-04-11 source-url batch unique and research-ready", () => {
    expect(highValueListingSeeds).toHaveLength(14);

    const names = new Set<string>();
    const sourceUrls = new Set<string>();

    for (const seed of highValueListingSeeds) {
      expect(names.has(seed.businessName)).toBe(false);
      expect(sourceUrls.has(seed.sourceUrl)).toBe(false);
      names.add(seed.businessName);
      sourceUrls.add(seed.sourceUrl);

      expect(seed.managedBusinessData.dealStatus).toBe("RESEARCHING");
      expect(seed.managedBusinessData.notes).toContain("Observed:");
      expect(seed.managedBusinessData.notes).toContain("Inference:");
      expect(seed.managedBusinessData.notes).toContain("Missing:");
      expect(seed.managedBusinessData.notes).toContain(HIGH_VALUE_LISTING_NOTE_HEADING);
    }
  });
});

import { describe, expect, it } from "vitest";

import {
  RESEARCHED_LISTING_NOTE_HEADING,
  researchedListingSeeds,
} from "../scripts/researched-listings-2026-04-12.data";
import { highValueListingSeeds } from "../scripts/high-value-listings-2026-04-11.data";
import { researchedListingSeeds as researchedListingSeeds20260414 } from "../scripts/researched-listings-2026-04-14.data";
import { researchedListingSeeds as researchedListingSeeds20260415 } from "../scripts/researched-listings-2026-04-15.data";
import { extractBizBuySellAdId } from "../scripts/managed-listing-batch.lib";

describe("researched listing batch", () => {
  it("keeps the 2026-04-12 researched source-url batch unique and diligence-ready", () => {
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

  it("does not collide by source URL, business name, or BizBuySell ad id with the other managed batches", () => {
    const sourceUrls = new Set<string>();
    const businessNames = new Set<string>();
    const bizBuySellAdIds = new Set<string>();

    for (const seed of [
      ...highValueListingSeeds,
      ...researchedListingSeeds,
      ...researchedListingSeeds20260414,
      ...researchedListingSeeds20260415,
    ]) {
      expect(sourceUrls.has(seed.sourceUrl)).toBe(false);
      expect(businessNames.has(seed.businessName)).toBe(false);

      const adId = extractBizBuySellAdId(seed.sourceUrl);

      if (adId) {
        expect(bizBuySellAdIds.has(adId)).toBe(false);
        bizBuySellAdIds.add(adId);
      }

      sourceUrls.add(seed.sourceUrl);
      businessNames.add(seed.businessName);
    }
  });
});

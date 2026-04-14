import { describe, expect, it } from "vitest";

import {
  extractBizBuySellAdId,
  findManagedBusinessForSeed,
  normalizeSourceUrl,
  type LoadedManagedBusiness,
} from "../scripts/managed-listing-batch.lib";

describe("managed listing batch dedupe helpers", () => {
  it("normalizes source URLs and extracts BizBuySell ad ids safely", () => {
    expect(
      normalizeSourceUrl(
        "HTTPS://www.bizbuysell.com/business-opportunity/test-listing/2458359?utm_source=x",
      ),
    ).toBe(
      "https://www.bizbuysell.com/business-opportunity/test-listing/2458359/",
    );
    expect(
      extractBizBuySellAdId(
        "https://www.bizbuysell.com/business-opportunity/test-listing/2458359/",
      ),
    ).toBe("2458359");
    expect(
      extractBizBuySellAdId(
        "https://www.bizquest.com/business-for-sale/test/BW2487506/",
      ),
    ).toBeNull();
  });

  it("matches by normalized source URL first, then ad id, then normalized title and location", () => {
    const businesses = [
      {
        businessName: "20 FedEx Ground Routes, Colorado Springs, CO",
        sourceUrl:
          "https://www.bizbuysell.com/business-opportunity/20-fedex-ground-routes-colorado-springs-co/2458359/",
        location: "Colorado Springs, CO",
        historyEvents: [],
      },
      {
        businessName: "Commercial Real Estate Service",
        sourceUrl: null,
        location: "Midvale, UT",
        historyEvents: [],
      },
    ] as Pick<
      LoadedManagedBusiness,
      "businessName" | "sourceUrl" | "location" | "historyEvents"
    >[];

    const byNormalizedUrl = findManagedBusinessForSeed(businesses, {
      businessName: "Different title",
      sourceUrl:
        "HTTPS://www.bizbuysell.com/business-opportunity/20-fedex-ground-routes-colorado-springs-co/2458359?utm_source=test",
      location: "Elsewhere",
    });

    expect(byNormalizedUrl?.businessName).toBe(
      "20 FedEx Ground Routes, Colorado Springs, CO",
    );

    const byAdId = findManagedBusinessForSeed(businesses, {
      businessName: "Another title",
      sourceUrl:
        "https://www.bizbuysell.com/business-opportunity/renamed-colorado-routes/2458359/",
      location: "Elsewhere",
    });

    expect(byAdId?.businessName).toBe(
      "20 FedEx Ground Routes, Colorado Springs, CO",
    );

    const byTitleLocation = findManagedBusinessForSeed(businesses, {
      businessName: "Commercial Real Estate Service",
      sourceUrl:
        "https://www.bizbuysell.com/business-opportunity/something-else/9999999/",
      location: "Midvale, UT",
    });

    expect(byTitleLocation?.businessName).toBe("Commercial Real Estate Service");
  });
});

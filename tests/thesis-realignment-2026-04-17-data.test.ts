import { describe, expect, it } from "vitest";

import {
  demotedBusinessNames,
  movedOutOfDefaultActiveViewBusinessNames,
  promotedBusinessNames,
  thesisRealignmentOverrides,
} from "../scripts/thesis-realignment-2026-04-17.data";

describe("2026-04-17 thesis realignment data", () => {
  it("keeps the Central Ohio landscaping sale-pending listing as a comp-only reference", () => {
    const businessName =
      "Established/Commercial Landscaping /Hardscaping Business - Central OH";
    const override = thesisRealignmentOverrides[businessName];

    expect(override).toBeDefined();
    expect(override?.pipelineBucket).toBe("COMP_ONLY");
    expect(override?.dealStatus).toBe("LETTER_OF_INTENT");
    expect(override?.tagAdditions).toContain("sale-pending-comp");
    expect(override?.noteReason).toContain("sale pending");
    expect(promotedBusinessNames).not.toContain(businessName);
    expect(demotedBusinessNames).toContain(businessName);
    expect(movedOutOfDefaultActiveViewBusinessNames).toContain(businessName);
  });

  it("keeps the 2026-04-23 landscaping additions in the active pipeline when explicitly promoted", () => {
    const activeNames = [
      "Established Landscape company with 40 years in business and solid Hist",
      "High-Margin Landscaping Co. with Route Density in Growth Corridor",
      "Established Commercial Landscaping — KC Metro — Recurring Contracts",
      "39-Year Landscaping Business – Loyal Clients & High Profits",
      "Highly Profitable Full-Service Landscaping & Snow Removal Company",
    ];

    for (const businessName of activeNames) {
      const override = thesisRealignmentOverrides[businessName];

      expect(override).toBeDefined();
      expect(override?.pipelineBucket).toBe("ACTIVE");
      expect(movedOutOfDefaultActiveViewBusinessNames).not.toContain(
        businessName,
      );
    }

    expect(
      thesisRealignmentOverrides[
        "High-Margin Landscaping Co. with Route Density in Growth Corridor"
      ]?.dealStatus,
    ).toBe("LETTER_OF_INTENT");
  });
});

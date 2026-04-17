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
});

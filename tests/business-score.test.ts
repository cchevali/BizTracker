import { describe, expect, it } from "vitest";

import {
  deriveOverallScoreFromRatings,
  normalizeImportedOverallScore,
} from "@/features/businesses/domain/business-score";

describe("business-score", () => {
  it("derives an overall score while inverting owner dependence", () => {
    expect(
      deriveOverallScoreFromRatings({
        ownerDependenceRating: 5,
        recurringRevenueRating: 5,
        transferabilityRating: 5,
        scheduleControlFitRating: 5,
        brotherOperatorFitRating: 5,
      }),
    ).toBe(84);

    expect(
      deriveOverallScoreFromRatings({
        ownerDependenceRating: 1,
        recurringRevenueRating: 5,
        transferabilityRating: 5,
        scheduleControlFitRating: 5,
        brotherOperatorFitRating: 5,
      }),
    ).toBe(100);
  });

  it("requires at least three ratings to derive a score", () => {
    expect(
      deriveOverallScoreFromRatings({
        ownerDependenceRating: 2,
        recurringRevenueRating: 5,
      }),
    ).toBeUndefined();
  });

  it("normalizes legacy 10-point imports onto the app's 100-point scale", () => {
    expect(
      normalizeImportedOverallScore(8, {
        ownerDependenceRating: 2,
        recurringRevenueRating: 5,
        transferabilityRating: 4,
        scheduleControlFitRating: 4,
        brotherOperatorFitRating: 4,
      }),
    ).toBe(84);

    expect(
      normalizeImportedOverallScore(7, {
        ownerDependenceRating: null,
        recurringRevenueRating: null,
        transferabilityRating: null,
        scheduleControlFitRating: null,
        brotherOperatorFitRating: null,
      }),
    ).toBe(70);
  });
});

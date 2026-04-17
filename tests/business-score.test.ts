import { describe, expect, it } from "vitest";

import {
  deriveAiResistanceScore,
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

  it("keeps pool and landscaping services in the physical-service AI bucket", () => {
    expect(
      deriveAiResistanceScore({
        businessName:
          "Premier NJ Residential Pool Service Co. - 37 yrs - Recurring Contracts",
        category: "home services",
        subcategory: "residential pool service and repair",
        summary: "Residential pool service and repair business with recurring contracts.",
      }),
    ).toBe(4);

    expect(
      deriveAiResistanceScore({
        businessName:
          "Established Landscaping, Snow Plowing, Hardscape & Concrete Company",
        category: "outdoor services",
        subcategory: "landscaping, snow plowing, hardscape, and concrete",
        summary: "Commercial landscaping and snow plowing company with crews.",
      }),
    ).toBe(4);

    expect(
      deriveAiResistanceScore({
        businessName: "Commercial Cleaning Business with Recurring Revenue!",
        category: "facility services",
        subcategory: "commercial cleaning and demolition",
        summary:
          "Commercial cleaning business with recurring janitorial contracts and a team of employees.",
        whyItMayFit: "Could support delegated field management.",
        risks: "Labor complexity and staffing noise.",
        notes: "Operational notes should not change the category-level AI bucket.",
      }),
    ).toBe(4);
  });
});

import { describe, expect, it } from "vitest";

import {
  emptyBusinessFormValues,
} from "@/features/businesses/domain/business.types";
import {
  createValidationErrorState,
  parseBusinessForm,
  parseNoteForm,
  parsePresetForm,
  parseStatusForm,
} from "@/features/businesses/domain/business.schemas";

import { createFormData } from "./helpers/form-data";

function createBusinessFormData(overrides: Record<string, string> = {}) {
  return createFormData({
    ...emptyBusinessFormValues,
    businessName: "Summit Home Services",
    sourceUrl: "https://chat.openai.com/c/sample-deal",
    category: "Home Services",
    subcategory: "HVAC",
    location: "Charlotte, nc",
    stateCode: "nc",
    askingPrice: "1250000",
    revenue: "2100000",
    sde: "420000",
    ebitda: "300000",
    employees: "11",
    summary: "A durable HVAC service business with a healthy maintenance base.",
    whyItMayFit: "Route density and recurring service revenue fit the target profile well.",
    risks: "Lead technician retention and shoulder-season utilization need diligence.",
    brokerName: "Jordan Ellis",
    brokerFirm: "Main Street Advisors",
    listingSource: "BizBuySell",
    dealStatus: "NEW",
    ownerDependenceRating: "3",
    recurringRevenueRating: "5",
    transferabilityRating: "4",
    scheduleControlFitRating: "4",
    brotherOperatorFitRating: "4",
    overallScore: "",
    notes: "Needs diligence on service agreement churn.",
    tags: "HVAC, recurring, HVAC",
    ...overrides,
  });
}

describe("business.schemas", () => {
  it("parses a valid business form and derives the overall score", () => {
    const result = parseBusinessForm(createBusinessFormData());

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Expected business form to parse successfully.");
    }

    expect(result.data.stateCode).toBe("NC");
    expect(result.data.tags).toEqual(["hvac", "recurring"]);
    expect(result.data.overallScore).toBe(80);
    expect(result.data.sourceUrl).toBe("https://chat.openai.com/c/sample-deal");
  });

  it("returns field errors for invalid numeric and URL inputs", () => {
    const result = parseBusinessForm(
      createBusinessFormData({
        sourceUrl: "ftp://invalid-url",
        employees: "10.5",
        ownerDependenceRating: "7",
      }),
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected business form validation to fail.");
    }

    expect(result.error.flatten().fieldErrors.sourceUrl).toEqual([
      "Source URL must start with http:// or https://.",
    ]);
    expect(result.error.flatten().fieldErrors.employees).toEqual([
      "Employees must be a whole number.",
    ]);
    expect(result.error.flatten().fieldErrors.ownerDependenceRating).toEqual([
      "Owner dependence rating must be between 1 and 5.",
    ]);
  });

  it("parses and normalizes preset queries", () => {
    const result = parsePresetForm(
      createFormData({
        name: "Recurring Cards",
        query: JSON.stringify({
          tags: " recurring, subscription ",
          sort: "score",
          view: "cards",
          minScore: "75",
        }),
      }),
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Expected preset form to parse successfully.");
    }

    expect(result.data).toEqual({
      name: "Recurring Cards",
      query: {
        tags: "recurring,subscription",
        sort: "score",
        view: "cards",
        minScore: "75",
      },
    });
  });

  it("reports malformed preset JSON cleanly", () => {
    const result = parsePresetForm(
      createFormData({
        name: "Broken preset",
        query: "{not-json",
      }),
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected malformed preset JSON to fail.");
    }

    expect(result.state).toEqual({
      status: "error",
      message: "Could not understand the current filters.",
    });
  });

  it("validates note and status forms", () => {
    expect(parseNoteForm(createFormData({ body: "Call broker tomorrow." })).success)
      .toBe(true);
    expect(
      parseStatusForm(createFormData({ dealStatus: "UNDER_REVIEW" })).success,
    ).toBe(true);
  });

  it("builds a standard validation error state shape", () => {
    const result = parseBusinessForm(createBusinessFormData({ businessName: "" }));

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected validation failure.");
    }

    expect(createValidationErrorState(result.error)).toEqual({
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: {
        businessName: ["Business name is required."],
      },
    });
  });
});

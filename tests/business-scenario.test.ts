import { describe, expect, it } from "vitest";

import {
  BUSINESS_SCENARIO_ASSUMPTIONS,
  calculateBusinessScenario,
} from "@/features/businesses/domain/business-scenario";

describe("business-scenario", () => {
  it("calculates the shared conservative acquisition scenario", () => {
    const scenario = calculateBusinessScenario({
      askingPrice: 1_000_000,
      sde: 300_000,
    });

    expect(scenario).toEqual({
      cashToCloseLow: 140000,
      cashToCloseHigh: 200000,
      annualDebtServiceAssumed: 152821,
      paperCashAfterBrother: 107179,
      conservativeCashAfterBrother: 47179,
      brotherCashCompAssumed:
        BUSINESS_SCENARIO_ASSUMPTIONS.BROTHER_CASH_COMP,
      conservativeSdeUsed: 240000,
    });
  });

  it("returns null for close-cash and debt-service fields when asking price is missing", () => {
    expect(
      calculateBusinessScenario({
        askingPrice: null,
        sde: 300_000,
      }),
    ).toEqual({
      cashToCloseLow: null,
      cashToCloseHigh: null,
      annualDebtServiceAssumed: null,
      paperCashAfterBrother: null,
      conservativeCashAfterBrother: null,
      brotherCashCompAssumed:
        BUSINESS_SCENARIO_ASSUMPTIONS.BROTHER_CASH_COMP,
      conservativeSdeUsed: 240000,
    });
  });

  it("returns null for cash-flow outputs when SDE is missing", () => {
    expect(
      calculateBusinessScenario({
        askingPrice: 1_000_000,
        sde: null,
      }),
    ).toEqual({
      cashToCloseLow: 140000,
      cashToCloseHigh: 200000,
      annualDebtServiceAssumed: 152821,
      paperCashAfterBrother: null,
      conservativeCashAfterBrother: null,
      brotherCashCompAssumed:
        BUSINESS_SCENARIO_ASSUMPTIONS.BROTHER_CASH_COMP,
      conservativeSdeUsed: null,
    });
  });
});

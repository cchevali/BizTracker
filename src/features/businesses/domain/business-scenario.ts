export const BUSINESS_SCENARIO_ASSUMPTIONS = {
  BROTHER_CASH_COMP: 40000,
  SBA_LTV: 0.9,
  SBA_INTEREST_RATE: 0.11,
  SBA_TERM_YEARS: 10,
  CASH_TO_CLOSE_LOW_PCT: 0.14,
  CASH_TO_CLOSE_HIGH_PCT: 0.2,
  CONSERVATIVE_SDE_HAIRCUT: 0.2,
} as const;

export type BusinessScenario = {
  cashToCloseLow: number | null;
  cashToCloseHigh: number | null;
  annualDebtServiceAssumed: number | null;
  paperCashAfterBrother: number | null;
  conservativeCashAfterBrother: number | null;
  brotherCashCompAssumed: number;
  conservativeSdeUsed: number | null;
};

function roundCurrency(value: number) {
  return Math.round(value);
}

function calculateAnnualLoanPayment({
  principal,
  annualRate,
  termYears,
}: {
  principal: number;
  annualRate: number;
  termYears: number;
}) {
  if (principal <= 0) {
    return 0;
  }

  if (annualRate === 0) {
    return principal / termYears;
  }

  const growth = (1 + annualRate) ** termYears;
  return principal * ((annualRate * growth) / (growth - 1));
}

export function calculateBusinessScenario({
  askingPrice,
  sde,
}: {
  askingPrice: number | null | undefined;
  sde: number | null | undefined;
}): BusinessScenario {
  const normalizedAskingPrice =
    askingPrice === null || askingPrice === undefined ? null : askingPrice;
  const normalizedSde = sde === null || sde === undefined ? null : sde;

  const financedAmount =
    normalizedAskingPrice === null
      ? null
      : normalizedAskingPrice * BUSINESS_SCENARIO_ASSUMPTIONS.SBA_LTV;

  const annualDebtServiceAssumed =
    financedAmount === null
      ? null
      : roundCurrency(
          calculateAnnualLoanPayment({
            principal: financedAmount,
            annualRate: BUSINESS_SCENARIO_ASSUMPTIONS.SBA_INTEREST_RATE,
            termYears: BUSINESS_SCENARIO_ASSUMPTIONS.SBA_TERM_YEARS,
          }),
        );

  const conservativeSdeUsed =
    normalizedSde === null
      ? null
      : roundCurrency(
          normalizedSde *
            (1 - BUSINESS_SCENARIO_ASSUMPTIONS.CONSERVATIVE_SDE_HAIRCUT),
        );

  return {
    cashToCloseLow:
      normalizedAskingPrice === null
        ? null
        : roundCurrency(
            normalizedAskingPrice *
              BUSINESS_SCENARIO_ASSUMPTIONS.CASH_TO_CLOSE_LOW_PCT,
          ),
    cashToCloseHigh:
      normalizedAskingPrice === null
        ? null
        : roundCurrency(
            normalizedAskingPrice *
              BUSINESS_SCENARIO_ASSUMPTIONS.CASH_TO_CLOSE_HIGH_PCT,
          ),
    annualDebtServiceAssumed,
    paperCashAfterBrother:
      normalizedSde === null || annualDebtServiceAssumed === null
        ? null
        : roundCurrency(
            normalizedSde -
              annualDebtServiceAssumed -
              BUSINESS_SCENARIO_ASSUMPTIONS.BROTHER_CASH_COMP,
          ),
    conservativeCashAfterBrother:
      conservativeSdeUsed === null || annualDebtServiceAssumed === null
        ? null
        : roundCurrency(
            conservativeSdeUsed -
              annualDebtServiceAssumed -
              BUSINESS_SCENARIO_ASSUMPTIONS.BROTHER_CASH_COMP,
          ),
    brotherCashCompAssumed: BUSINESS_SCENARIO_ASSUMPTIONS.BROTHER_CASH_COMP,
    conservativeSdeUsed,
  };
}

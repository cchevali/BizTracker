type ScoreInput = number | null | undefined;

export type BusinessScoreInputs = {
  ownerDependenceRating?: ScoreInput;
  recurringRevenueRating?: ScoreInput;
  transferabilityRating?: ScoreInput;
  scheduleControlFitRating?: ScoreInput;
  brotherOperatorFitRating?: ScoreInput;
};

function isDefinedNumber(value: ScoreInput): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeOwnerDependence(value: ScoreInput) {
  if (!isDefinedNumber(value)) {
    return undefined;
  }

  // The stored field is "dependence", where 1 is good and 5 is bad.
  // Invert it before blending into the overall quality score.
  return 6 - value;
}

export function getNormalizedScoreComponents(
  inputs: BusinessScoreInputs,
): number[] {
  return [
    normalizeOwnerDependence(inputs.ownerDependenceRating),
    inputs.recurringRevenueRating,
    inputs.transferabilityRating,
    inputs.scheduleControlFitRating,
    inputs.brotherOperatorFitRating,
  ].filter(isDefinedNumber);
}

export function deriveOverallScoreFromRatings(
  inputs: BusinessScoreInputs,
): number | undefined {
  const ratings = getNormalizedScoreComponents(inputs);

  if (ratings.length < 3) {
    return undefined;
  }

  return Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 20);
}

export function normalizeImportedOverallScore(
  rawScore: ScoreInput,
  inputs: BusinessScoreInputs,
): number | null {
  const derived = deriveOverallScoreFromRatings(inputs);

  if (!isDefinedNumber(rawScore)) {
    return derived ?? null;
  }

  if (rawScore >= 0 && rawScore <= 10) {
    return derived ?? Math.round(rawScore * 10);
  }

  if (rawScore >= 0 && rawScore <= 100) {
    return Math.round(rawScore);
  }

  return derived ?? null;
}

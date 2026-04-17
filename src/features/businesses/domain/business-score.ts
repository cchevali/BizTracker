type ScoreInput = number | null | undefined;

export type BusinessScoreInputs = {
  ownerDependenceRating?: ScoreInput;
  recurringRevenueRating?: ScoreInput;
  transferabilityRating?: ScoreInput;
  scheduleControlFitRating?: ScoreInput;
  brotherOperatorFitRating?: ScoreInput;
};

export type ThesisScoreInputs = BusinessScoreInputs & {
  financeabilityRating?: ScoreInput;
  operatorSkillDependency?: ScoreInput;
  licenseDependency?: ScoreInput;
  afterHoursBurden?: ScoreInput;
  capexRisk?: ScoreInput;
  staleListingRisk?: ScoreInput;
  keyPersonRisk?: ScoreInput;
  aiResistanceScore?: ScoreInput;
  keepDayJobFit?: ScoreInput;
  quitDayJobFit?: ScoreInput;
  dataConfidenceScore?: ScoreInput;
  opsManagerExists?: boolean | null;
  conservativeCashAfterBrother?: number | null;
  cashToCloseHigh?: number | null;
  sde?: number | null;
  publicSourceVerified?: boolean | null;
};

type AiResistanceInputs = {
  businessName?: string | null;
  category?: string | null;
  subcategory?: string | null;
  summary?: string | null;
  whyItMayFit?: string | null;
  risks?: string | null;
  notes?: string | null;
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

function normalizePositiveRating(value: ScoreInput) {
  return isDefinedNumber(value) ? value : undefined;
}

function normalizeInverseRating(value: ScoreInput) {
  if (!isDefinedNumber(value)) {
    return undefined;
  }

  return 6 - value;
}

function normalizeOpsManager(value: boolean | null | undefined) {
  if (value === true) {
    return 5;
  }

  if (value === false) {
    return 2;
  }

  return 3;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildSearchableText(inputs: AiResistanceInputs) {
  return [
    inputs.businessName,
    inputs.category,
    inputs.subcategory,
    inputs.summary,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function deriveAiResistanceScore(inputs: AiResistanceInputs) {
  const text = buildSearchableText(inputs);

  if (
    /(bookkeeping|accounting|therapy|pediatric therapy)/.test(text)
  ) {
    return 1;
  }

  if (
    /(fedex|linehaul|staffing|real estate service|property inspection|bread route)/.test(
      text,
    )
  ) {
    return 2;
  }

  if (
    /(\binspection\b|\bdocument\b|\bdisposal\b|\bcollision\b|\bwellness\b|\baesthetic\b|auto paint|paint and dent|paint & dent|dent repair)/.test(
      text,
    )
  ) {
    return 3;
  }

  if (
    /(pool|landscap|grounds maintenance|lawn care|snow plow|snow plowing|snow removal|commercial cleaning|janitorial|power washing|garage door|duct cleaning|air duct|dumpster|dryer vent franchise|window cleaning)/.test(
      text,
    )
  ) {
    return 4;
  }

  if (
    /(hvac|plumb|pest|termite|chimney|wildlife|sewer|water line|dryer vent|well drilling)/.test(
      text,
    )
  ) {
    return 5;
  }

  if (
    /(home services|facility services|outdoor services|industrial services|route services|construction services|trades)/.test(
      text,
    )
  ) {
    return 4;
  }

  return 3;
}

export function deriveOverallScoreFromThesis(
  inputs: ThesisScoreInputs,
): number | undefined {
  const weightedComponents: Array<{ value: number | undefined; weight: number }> = [
    { value: normalizePositiveRating(inputs.brotherOperatorFitRating), weight: 1.5 },
    { value: normalizePositiveRating(inputs.scheduleControlFitRating), weight: 1.25 },
    { value: normalizePositiveRating(inputs.transferabilityRating), weight: 1.25 },
    { value: normalizePositiveRating(inputs.financeabilityRating), weight: 1.1 },
    { value: normalizePositiveRating(inputs.recurringRevenueRating), weight: 0.85 },
    { value: normalizePositiveRating(inputs.aiResistanceScore), weight: 0.45 },
    { value: normalizePositiveRating(inputs.keepDayJobFit), weight: 0.55 },
    { value: normalizePositiveRating(inputs.quitDayJobFit), weight: 0.35 },
    { value: normalizeInverseRating(inputs.ownerDependenceRating), weight: 1.1 },
    { value: normalizeInverseRating(inputs.operatorSkillDependency), weight: 1.0 },
    { value: normalizeInverseRating(inputs.licenseDependency), weight: 0.95 },
    { value: normalizeInverseRating(inputs.afterHoursBurden), weight: 0.9 },
    { value: normalizeInverseRating(inputs.capexRisk), weight: 0.7 },
    { value: normalizeInverseRating(inputs.staleListingRisk), weight: 0.45 },
    { value: normalizeInverseRating(inputs.keyPersonRisk), weight: 0.8 },
    { value: normalizePositiveRating(inputs.dataConfidenceScore), weight: 0.35 },
    { value: normalizeOpsManager(inputs.opsManagerExists), weight: 0.9 },
  ];

  const populated = weightedComponents.filter(
    (component): component is { value: number; weight: number } =>
      component.value !== undefined,
  );

  if (populated.length < 5) {
    return deriveOverallScoreFromRatings(inputs);
  }

  const weightedAverage =
    populated.reduce((sum, component) => sum + component.value * component.weight, 0) /
    populated.reduce((sum, component) => sum + component.weight, 0);

  let score = weightedAverage * 20;

  if (typeof inputs.conservativeCashAfterBrother === "number") {
    if (inputs.conservativeCashAfterBrother < 0) {
      score -= 22;
    } else if (inputs.conservativeCashAfterBrother < 25_000) {
      score -= 14;
    } else if (inputs.conservativeCashAfterBrother < 75_000) {
      score -= 7;
    } else if (inputs.conservativeCashAfterBrother > 250_000) {
      score += 6;
    } else if (inputs.conservativeCashAfterBrother > 150_000) {
      score += 3;
    }
  }

  if (typeof inputs.cashToCloseHigh === "number") {
    if (inputs.cashToCloseHigh > 600_000) {
      score -= 8;
    } else if (inputs.cashToCloseHigh > 350_000) {
      score -= 4;
    } else if (inputs.cashToCloseHigh < 175_000) {
      score += 2;
    }
  }

  if (typeof inputs.sde === "number") {
    if (inputs.sde < 150_000) {
      score -= 12;
    } else if (inputs.sde < 250_000) {
      score -= 6;
    } else if (inputs.sde > 600_000) {
      score += 4;
    }
  }

  if (inputs.publicSourceVerified === false) {
    score -= 8;
  }

  if (inputs.opsManagerExists === true) {
    score += 3;
  } else if (inputs.opsManagerExists === false) {
    score -= 4;
  }

  return clampScore(score);
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

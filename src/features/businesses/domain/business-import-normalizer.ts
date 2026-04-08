import { normalizeImportedOverallScore } from "./business-score";

const validDealStatuses = new Set([
  "NEW",
  "WATCHLIST",
  "RESEARCHING",
  "CONTACTED_BROKER",
  "UNDER_REVIEW",
  "LETTER_OF_INTENT",
  "PASSED",
  "CLOSED",
]);

const legacyOwnerDependenceNote =
  "Inference: ownerDependenceRating uses 1 low dependence to 5 high dependence; other fit ratings use 1 low to 5 high.";
const normalizedOwnerDependenceNote =
  "Inference: owner dependence is recorded on its native 1-low to 5-high scale, while overall score is normalized separately onto the app's 0-100 scale.";
const validPrimaryUseCases = new Set([
  "bridge_while_employed",
  "full_time_replacement",
  "either",
  "neither",
]);

export type NormalizedBusinessListing = {
  businessName: string;
  sourceUrl: string | null;
  category: string;
  subcategory: string | null;
  location: string;
  stateCode: string | null;
  askingPrice: number | null;
  revenue: number | null;
  sde: number | null;
  ebitda: number | null;
  employees: number | null;
  summary: string;
  whyItMayFit: string;
  risks: string;
  brokerName: string | null;
  brokerFirm: string | null;
  listingSource: string | null;
  dealStatus:
    | "NEW"
    | "WATCHLIST"
    | "RESEARCHING"
    | "CONTACTED_BROKER"
    | "UNDER_REVIEW"
    | "LETTER_OF_INTENT"
    | "PASSED"
    | "CLOSED";
  ownerDependenceRating: number | null;
  recurringRevenueRating: number | null;
  transferabilityRating: number | null;
  scheduleControlFitRating: number | null;
  brotherOperatorFitRating: number | null;
  aiResistanceScore: number | null;
  keepDayJobFit: number | null;
  quitDayJobFit: number | null;
  primaryUseCase:
    | "bridge_while_employed"
    | "full_time_replacement"
    | "either"
    | "neither"
    | null;
  beatsCurrentBenchmark: boolean | null;
  benchmarkNotes: string | null;
  financeabilityRating: number | null;
  sellerFinancingAvailable: boolean | null;
  sellerFinancingNotes: string | null;
  operatorSkillDependency: number | null;
  licenseDependency: number | null;
  afterHoursBurden: number | null;
  capexRisk: number | null;
  regretIfWrongScore: number | null;
  dataConfidenceScore: number | null;
  staleListingRisk: number | null;
  keyPersonRisk: number | null;
  homeBasedFlag: boolean | null;
  recurringRevenuePercent: number | null;
  ownerHoursClaimed: number | null;
  opsManagerExists: boolean | null;
  freshnessVerifiedAt: string | null;
  cashToCloseNotes: string | null;
  overallScore: number | null;
  notes: string | null;
  tags: string[];
};

type ListingLike = Record<string, unknown>;

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableString(value: unknown) {
  const normalized = normalizeString(value);
  return normalized === "" ? null : normalized;
}

function normalizeRequiredString(value: unknown, fallback = "") {
  const normalized = normalizeString(value);
  return normalized === "" ? fallback : normalized;
}

function normalizeStateCode(value: unknown) {
  const normalized = normalizeString(value).toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? normalized : null;
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeInteger(value: unknown) {
  const normalized = normalizeNumber(value);
  return normalized === null ? null : Math.round(normalized);
}

function normalizeBoundedRating(value: unknown) {
  const normalized = normalizeInteger(value);
  return normalized !== null && normalized >= 1 && normalized <= 5
    ? normalized
    : null;
}

function normalizeBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true" || normalized === "yes") {
      return true;
    }

    if (normalized === "false" || normalized === "no") {
      return false;
    }
  }

  return null;
}

function normalizePrimaryUseCase(
  value: unknown,
): NormalizedBusinessListing["primaryUseCase"] {
  const normalized = normalizeString(value).toLowerCase();

  if (validPrimaryUseCases.has(normalized)) {
    return normalized as NormalizedBusinessListing["primaryUseCase"];
  }

  if (normalized === "bridge while employed") {
    return "bridge_while_employed";
  }

  if (normalized === "full-time replacement") {
    return "full_time_replacement";
  }

  return null;
}

function normalizeDateTime(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  const normalized = normalizeString(value);

  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((tag) => (typeof tag === "string" ? tag.trim().toLowerCase() : ""))
        .filter(Boolean),
    ),
  );
}

function normalizeDealStatus(value: unknown): NormalizedBusinessListing["dealStatus"] {
  const normalized = normalizeString(value).toUpperCase();
  return validDealStatuses.has(normalized)
    ? (normalized as NormalizedBusinessListing["dealStatus"])
    : "NEW";
}

function normalizeNotes(value: unknown) {
  const normalized = normalizeNullableString(value);

  if (!normalized) {
    return null;
  }

  return normalized.replace(legacyOwnerDependenceNote, normalizedOwnerDependenceNote);
}

function inferListingSource(sourceUrl: string | null, listingSource: string | null) {
  if (listingSource) {
    return listingSource;
  }

  if (sourceUrl?.includes("bizbuysell.com")) {
    return "BizBuySell";
  }

  return null;
}

export function normalizeChatGptBusinessListing(
  input: ListingLike,
): NormalizedBusinessListing {
  const sourceUrl = normalizeNullableString(input.sourceUrl);
  const rawOverallScore = normalizeNumber(input.overallScore);
  const ownerDependenceRating = normalizeBoundedRating(input.ownerDependenceRating);
  const recurringRevenueRating = normalizeBoundedRating(input.recurringRevenueRating);
  const transferabilityRating = normalizeBoundedRating(input.transferabilityRating);
  const scheduleControlFitRating = normalizeBoundedRating(
    input.scheduleControlFitRating,
  );
  const brotherOperatorFitRating = normalizeBoundedRating(
    input.brotherOperatorFitRating,
  );

  return {
    businessName: normalizeRequiredString(input.businessName),
    sourceUrl,
    category: normalizeRequiredString(input.category),
    subcategory: normalizeNullableString(input.subcategory),
    location: normalizeRequiredString(input.location),
    stateCode: normalizeStateCode(input.stateCode),
    askingPrice: normalizeNumber(input.askingPrice),
    revenue: normalizeNumber(input.revenue),
    sde: normalizeNumber(input.sde),
    ebitda: normalizeNumber(input.ebitda),
    employees: normalizeInteger(input.employees),
    summary: normalizeRequiredString(input.summary),
    whyItMayFit: normalizeRequiredString(input.whyItMayFit),
    risks: normalizeRequiredString(input.risks),
    brokerName: normalizeNullableString(input.brokerName),
    brokerFirm: normalizeNullableString(input.brokerFirm),
    listingSource: inferListingSource(
      sourceUrl,
      normalizeNullableString(input.listingSource),
    ),
    dealStatus: normalizeDealStatus(input.dealStatus),
    ownerDependenceRating,
    recurringRevenueRating,
    transferabilityRating,
    scheduleControlFitRating,
    brotherOperatorFitRating,
    aiResistanceScore: normalizeBoundedRating(input.aiResistanceScore),
    keepDayJobFit: normalizeBoundedRating(input.keepDayJobFit),
    quitDayJobFit: normalizeBoundedRating(input.quitDayJobFit),
    primaryUseCase: normalizePrimaryUseCase(input.primaryUseCase),
    beatsCurrentBenchmark: normalizeBoolean(input.beatsCurrentBenchmark),
    benchmarkNotes: normalizeNullableString(input.benchmarkNotes),
    financeabilityRating: normalizeBoundedRating(input.financeabilityRating),
    sellerFinancingAvailable: normalizeBoolean(input.sellerFinancingAvailable),
    sellerFinancingNotes: normalizeNullableString(input.sellerFinancingNotes),
    operatorSkillDependency: normalizeBoundedRating(
      input.operatorSkillDependency,
    ),
    licenseDependency: normalizeBoundedRating(input.licenseDependency),
    afterHoursBurden: normalizeBoundedRating(input.afterHoursBurden),
    capexRisk: normalizeBoundedRating(input.capexRisk),
    regretIfWrongScore: normalizeBoundedRating(input.regretIfWrongScore),
    dataConfidenceScore: normalizeBoundedRating(input.dataConfidenceScore),
    staleListingRisk: normalizeBoundedRating(input.staleListingRisk),
    keyPersonRisk: normalizeBoundedRating(input.keyPersonRisk),
    homeBasedFlag: normalizeBoolean(input.homeBasedFlag),
    recurringRevenuePercent: (() => {
      const normalized = normalizeNumber(input.recurringRevenuePercent);
      return normalized !== null && normalized >= 0 && normalized <= 100
        ? normalized
        : null;
    })(),
    ownerHoursClaimed: normalizeInteger(input.ownerHoursClaimed),
    opsManagerExists: normalizeBoolean(input.opsManagerExists),
    freshnessVerifiedAt: normalizeDateTime(input.freshnessVerifiedAt),
    cashToCloseNotes: normalizeNullableString(input.cashToCloseNotes),
    overallScore: normalizeImportedOverallScore(rawOverallScore, {
      ownerDependenceRating,
      recurringRevenueRating,
      transferabilityRating,
      scheduleControlFitRating,
      brotherOperatorFitRating,
    }),
    notes: normalizeNotes(input.notes),
    tags: normalizeTags(input.tags),
  };
}

export function normalizeChatGptBusinessListings(inputs: ListingLike[]) {
  return inputs.map(normalizeChatGptBusinessListing);
}

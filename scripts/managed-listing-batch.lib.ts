import { Prisma, type PrismaClient } from "../src/generated/prisma/client";

export type LoadedManagedBusiness = Prisma.BusinessGetPayload<{
  include: {
    historyEvents: true;
  };
}>;

export const managedFieldNames = [
  "businessName",
  "sourceUrl",
  "category",
  "subcategory",
  "location",
  "stateCode",
  "askingPrice",
  "revenue",
  "sde",
  "ebitda",
  "employees",
  "summary",
  "whyItMayFit",
  "risks",
  "brokerName",
  "brokerFirm",
  "listingSource",
  "dealStatus",
  "ownerDependenceRating",
  "recurringRevenueRating",
  "transferabilityRating",
  "scheduleControlFitRating",
  "brotherOperatorFitRating",
  "aiResistanceScore",
  "financeabilityRating",
  "sellerFinancingAvailable",
  "sellerFinancingNotes",
  "operatorSkillDependency",
  "licenseDependency",
  "afterHoursBurden",
  "capexRisk",
  "regretIfWrongScore",
  "dataConfidenceScore",
  "keepDayJobFit",
  "quitDayJobFit",
  "primaryUseCase",
  "beatsCurrentBenchmark",
  "benchmarkNotes",
  "freshnessVerifiedAt",
  "staleListingRisk",
  "homeBasedFlag",
  "recurringRevenuePercent",
  "ownerHoursClaimed",
  "opsManagerExists",
  "keyPersonRisk",
  "cashToCloseNotes",
  "overallScore",
  "notes",
  "tags",
] as const;

export function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSourceUrl(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    const normalizedPath = parsed.pathname.replace(/\/+$/, "").toLowerCase();
    return `${parsed.origin.toLowerCase()}${normalizedPath}/`;
  } catch {
    const withoutQueryOrHash = trimmed.replace(/[?#].*$/, "");
    return `${withoutQueryOrHash.toLowerCase().replace(/\/+$/, "")}/`;
  }
}

export function extractBizBuySellAdId(value: string | null | undefined) {
  const normalized = normalizeSourceUrl(value);

  if (!normalized || !normalized.includes("bizbuysell.com/")) {
    return null;
  }

  const match = normalized.match(/\/(\d+)\/$/);
  return match?.[1] ?? null;
}

export function normalizeComparableValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  if (Array.isArray(value)) {
    return JSON.stringify([...value].sort());
  }

  return value;
}

export async function loadManagedBusinesses(prisma: PrismaClient) {
  return prisma.business.findMany({
    include: {
      historyEvents: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export function findManagedBusinessForSeed<
  Business extends {
    businessName: string;
    sourceUrl: string | null;
    location: string;
  },
  Seed extends {
    businessName: string;
    sourceUrl: string;
    location: string;
  },
>(businesses: Business[], seed: Seed) {
  const normalizedSeedSourceUrl = normalizeSourceUrl(seed.sourceUrl);

  if (normalizedSeedSourceUrl) {
    const bySourceUrl =
      businesses.find(
        (business) =>
          normalizeSourceUrl(business.sourceUrl) === normalizedSeedSourceUrl,
      ) ?? null;

    if (bySourceUrl) {
      return bySourceUrl;
    }
  }

  const seedAdId = extractBizBuySellAdId(seed.sourceUrl);

  if (seedAdId) {
    const byAdId =
      businesses.find(
        (business) => extractBizBuySellAdId(business.sourceUrl) === seedAdId,
      ) ?? null;

    if (byAdId) {
      return byAdId;
    }
  }

  const normalizedSeedTitle = normalizeTitle(seed.businessName);
  const normalizedSeedLocation = normalizeTitle(seed.location);

  return (
    businesses.find(
      (business) =>
        normalizeTitle(business.businessName) === normalizedSeedTitle &&
        normalizeTitle(business.location) === normalizedSeedLocation,
    ) ?? null
  );
}

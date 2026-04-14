import { Prisma, type PrismaClient } from "../src/generated/prisma/client";
import { DealStatus, HistoryEventType } from "../src/generated/prisma/enums";
import {
  ARCHIVE_BUSINESS_NAMES,
  BACKFILL_DATE,
  BACKFILL_NOTE_HEADING,
  CLEANUP_STATUS_DESCRIPTION,
  existingBackfills,
  newListingSeeds,
  type BackfillSpec,
} from "./backfill-acquisition-thesis.data";
import {
  upsertHighValueListingBatch,
} from "./high-value-listings-2026-04-11.lib";
import { upsertResearchedListingBatch } from "./researched-listings-2026-04-12.lib";
import { upsertResearchedListingBatch20260414 } from "./researched-listings-2026-04-14.lib";

const backfillFieldNames = [
  "sourceUrl",
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
  "notes",
] as const;

type LoadedBusiness = Prisma.BusinessGetPayload<{
  include: {
    historyEvents: true;
  };
}>;

export type AcquisitionThesisBackfillSummary = {
  archivedNames: string[];
  createdNames: string[];
  existingUpdatedCount: number;
  newListingUpdatedCount: number;
  highValueCreatedNames: string[];
  highValueUpdatedNames: string[];
  researchedCreatedNames: string[];
  researchedUpdatedNames: string[];
  researched20260414CreatedNames: string[];
  researched20260414UpdatedNames: string[];
};

function buildAnalysisBlock(spec: BackfillSpec["analysis"]) {
  return [
    BACKFILL_NOTE_HEADING,
    `- Thesis fit: ${spec.thesisFit}`,
    `- Main reasons it may work: ${spec.mainReasons}`,
    `- Main failure modes: ${spec.failureModes}`,
    `- Keep-day-job view: ${spec.keepDayJobView}`,
    `- Quit-day-job view: ${spec.quitDayJobView}`,
    `- Benchmark comparison: ${spec.benchmarkComparison}`,
    `- Confidence / missing diligence: ${spec.confidence}`,
  ].join("\n");
}

function appendAnalysisBlock(existingNotes: string | null, spec: BackfillSpec["analysis"]) {
  const trimmedExisting = existingNotes?.trim() ?? "";

  if (trimmedExisting.includes(BACKFILL_NOTE_HEADING)) {
    return trimmedExisting;
  }

  const block = buildAnalysisBlock(spec);
  return trimmedExisting ? `${trimmedExisting}\n\n${block}` : block;
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeComparableValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  return value;
}

function buildBackfillData(
  spec: BackfillSpec,
  notes: string,
  sourceUrl?: string,
): Prisma.BusinessUpdateInput {
  return {
    ...(sourceUrl ? { sourceUrl } : {}),
    aiResistanceScore: spec.manual.aiResistanceScore,
    financeabilityRating: spec.manual.financeabilityRating,
    sellerFinancingAvailable: spec.manual.sellerFinancingAvailable,
    sellerFinancingNotes: spec.manual.sellerFinancingNotes,
    operatorSkillDependency: spec.manual.operatorSkillDependency,
    licenseDependency: spec.manual.licenseDependency,
    afterHoursBurden: spec.manual.afterHoursBurden,
    capexRisk: spec.manual.capexRisk,
    regretIfWrongScore: spec.manual.regretIfWrongScore,
    dataConfidenceScore: spec.manual.dataConfidenceScore,
    keepDayJobFit: spec.manual.keepDayJobFit,
    quitDayJobFit: spec.manual.quitDayJobFit,
    primaryUseCase: spec.manual.primaryUseCase,
    beatsCurrentBenchmark: spec.manual.beatsCurrentBenchmark,
    benchmarkNotes: spec.manual.benchmarkNotes,
    freshnessVerifiedAt: spec.manual.freshnessVerifiedAt,
    staleListingRisk: spec.manual.staleListingRisk,
    homeBasedFlag: spec.manual.homeBasedFlag,
    recurringRevenuePercent: spec.manual.recurringRevenuePercent,
    ownerHoursClaimed: spec.manual.ownerHoursClaimed,
    opsManagerExists: spec.manual.opsManagerExists,
    keyPersonRisk: spec.manual.keyPersonRisk,
    cashToCloseNotes: spec.manual.cashToCloseNotes,
    notes,
  };
}

function getChangedBackfillFields(business: LoadedBusiness, data: Prisma.BusinessUpdateInput) {
  const existingRecord = business as Record<string, unknown>;
  const nextRecord = data as Record<string, unknown>;

  return backfillFieldNames.filter((fieldName) => {
    if (!(fieldName in nextRecord)) {
      return false;
    }

    return (
      normalizeComparableValue(existingRecord[fieldName]) !==
      normalizeComparableValue(nextRecord[fieldName])
    );
  });
}

async function loadBusinesses(prisma: PrismaClient) {
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

function findBusinessByName(businesses: LoadedBusiness[], businessName: string) {
  return businesses.find((business) => business.businessName === businessName) ?? null;
}

function findBusinessForSeed(
  businesses: LoadedBusiness[],
  seed: (typeof newListingSeeds)[number],
) {
  const bySourceUrl =
    businesses.find((business) => business.sourceUrl === seed.sourceUrl) ?? null;

  if (bySourceUrl) {
    return bySourceUrl;
  }

  const normalizedSeedTitle = normalizeTitle(seed.businessName);
  return (
    businesses.find(
      (business) => normalizeTitle(business.businessName) === normalizedSeedTitle,
    ) ?? null
  );
}

async function archiveLowFitBusinesses(prisma: PrismaClient) {
  const businesses = await loadBusinesses(prisma);
  const archivedNames: string[] = [];

  for (const businessName of ARCHIVE_BUSINESS_NAMES) {
    const business = findBusinessByName(businesses, businessName);

    if (!business) {
      continue;
    }

    const alreadyLogged = business.historyEvents.some(
      (event) =>
        event.eventType === HistoryEventType.STATUS_CHANGED &&
        event.description === CLEANUP_STATUS_DESCRIPTION,
    );

    if (business.dealStatus === DealStatus.PASSED && alreadyLogged) {
      archivedNames.push(business.businessName);
      continue;
    }

    await prisma.business.update({
      where: {
        id: business.id,
      },
      data: {
        dealStatus: DealStatus.PASSED,
        historyEvents: {
          create: {
            eventType: HistoryEventType.STATUS_CHANGED,
            description: CLEANUP_STATUS_DESCRIPTION,
            metadata: {
              backfillDate: BACKFILL_DATE,
              from: business.dealStatus,
              to: DealStatus.PASSED,
            },
          },
        },
      },
    });

    archivedNames.push(business.businessName);
  }

  return archivedNames;
}

async function createMissingPublicListings(prisma: PrismaClient) {
  const businesses = await loadBusinesses(prisma);
  const createdNames: string[] = [];
  const knownSourceUrls = new Set(
    businesses
      .map((business) => business.sourceUrl)
      .filter((value): value is string => Boolean(value)),
  );
  const knownTitles = new Set(
    businesses.map((business) => normalizeTitle(business.businessName)),
  );

  for (const seed of newListingSeeds) {
    const normalizedSeedTitle = normalizeTitle(seed.businessName);

    if (knownSourceUrls.has(seed.sourceUrl) || knownTitles.has(normalizedSeedTitle)) {
      continue;
    }

    const existing = findBusinessForSeed(businesses, seed);

    if (existing) {
      continue;
    }

    await prisma.business.create({
      data: seed.createData,
    });

    createdNames.push(seed.businessName);
    knownSourceUrls.add(seed.sourceUrl);
    knownTitles.add(normalizedSeedTitle);
  }

  return createdNames;
}

async function applyBackfill(
  prisma: PrismaClient,
  business: LoadedBusiness,
  spec: BackfillSpec,
  sourceUrl?: string,
) {
  const notes = appendAnalysisBlock(business.notes, spec.analysis);
  const data = buildBackfillData(
    spec,
    notes,
    sourceUrl && !business.sourceUrl ? sourceUrl : undefined,
  );
  const changedFields = getChangedBackfillFields(business, data);

  if (changedFields.length === 0) {
    return false;
  }

  await prisma.business.update({
    where: {
      id: business.id,
    },
    data: {
      ...data,
      historyEvents: {
        create: {
          eventType: HistoryEventType.UPDATED,
          description: "Backfilled acquisition screening fields during thesis cleanup.",
          metadata: {
            backfillDate: BACKFILL_DATE,
            changedFields,
          },
        },
      },
    },
  });

  return true;
}

async function backfillExistingBusinesses(prisma: PrismaClient) {
  const businesses = await loadBusinesses(prisma);
  let updatedCount = 0;

  for (const [businessName, spec] of Object.entries(existingBackfills)) {
    const business = findBusinessByName(businesses, businessName);

    if (!business) {
      throw new Error(`Could not find business for backfill: ${businessName}`);
    }

    if (await applyBackfill(prisma, business, spec)) {
      updatedCount += 1;
    }
  }

  return updatedCount;
}

async function backfillNewListings(prisma: PrismaClient) {
  const businesses = await loadBusinesses(prisma);
  let updatedCount = 0;

  for (const seed of newListingSeeds) {
    const business = findBusinessForSeed(businesses, seed);

    if (!business) {
      throw new Error(`Could not find or create new listing: ${seed.businessName}`);
    }

    if (await applyBackfill(prisma, business, seed.spec, seed.sourceUrl)) {
      updatedCount += 1;
    }
  }

  return updatedCount;
}

export async function runAcquisitionThesisBackfill(
  prisma: PrismaClient,
): Promise<AcquisitionThesisBackfillSummary> {
  const archivedNames = await archiveLowFitBusinesses(prisma);
  const createdNames = await createMissingPublicListings(prisma);
  const existingUpdatedCount = await backfillExistingBusinesses(prisma);
  const newListingUpdatedCount = await backfillNewListings(prisma);
  const highValueSummary = await upsertHighValueListingBatch(prisma);
  const researchedSummary = await upsertResearchedListingBatch(prisma);
  const researched20260414Summary = await upsertResearchedListingBatch20260414(prisma);

  return {
    archivedNames,
    createdNames,
    existingUpdatedCount,
    newListingUpdatedCount,
    highValueCreatedNames: highValueSummary.createdNames,
    highValueUpdatedNames: highValueSummary.updatedNames,
    researchedCreatedNames: researchedSummary.createdNames,
    researchedUpdatedNames: researchedSummary.updatedNames,
    researched20260414CreatedNames: researched20260414Summary.createdNames,
    researched20260414UpdatedNames: researched20260414Summary.updatedNames,
  };
}

export function printAcquisitionThesisBackfillSummary(
  summary: AcquisitionThesisBackfillSummary,
) {
  console.log(`Archived or confirmed passed: ${summary.archivedNames.length}`);
  console.log(`Created new listings: ${summary.createdNames.length}`);
  console.log(`Updated existing active businesses: ${summary.existingUpdatedCount}`);
  console.log(`Updated or confirmed new listings: ${summary.newListingUpdatedCount}`);
  console.log(
    `Created 2026-04-11 high-value listings: ${summary.highValueCreatedNames.length}`,
  );
  console.log(
    `Updated 2026-04-11 high-value listings: ${summary.highValueUpdatedNames.length}`,
  );
  console.log(
    `Created 2026-04-12 researched listings: ${summary.researchedCreatedNames.length}`,
  );
  console.log(
    `Updated 2026-04-12 researched listings: ${summary.researchedUpdatedNames.length}`,
  );
  console.log(
    `Created 2026-04-14 researched listings: ${summary.researched20260414CreatedNames.length}`,
  );
  console.log(
    `Updated 2026-04-14 researched listings: ${summary.researched20260414UpdatedNames.length}`,
  );

  if (summary.archivedNames.length > 0) {
    console.log("Archived businesses:");
    for (const businessName of summary.archivedNames) {
      console.log(`- ${businessName}`);
    }
  }

  if (summary.createdNames.length > 0) {
    console.log("Created listings:");
    for (const businessName of summary.createdNames) {
      console.log(`- ${businessName}`);
    }
  }

  if (summary.highValueCreatedNames.length > 0) {
    console.log("Created high-value listings:");
    for (const businessName of summary.highValueCreatedNames) {
      console.log(`- ${businessName}`);
    }
  }

  if (summary.highValueUpdatedNames.length > 0) {
    console.log("Updated high-value listings:");
    for (const businessName of summary.highValueUpdatedNames) {
      console.log(`- ${businessName}`);
    }
  }

  if (summary.researchedCreatedNames.length > 0) {
    console.log("Created researched listings:");
    for (const businessName of summary.researchedCreatedNames) {
      console.log(`- ${businessName}`);
    }
  }

  if (summary.researchedUpdatedNames.length > 0) {
    console.log("Updated researched listings:");
    for (const businessName of summary.researchedUpdatedNames) {
      console.log(`- ${businessName}`);
    }
  }

  if (summary.researched20260414CreatedNames.length > 0) {
    console.log("Created 2026-04-14 researched listings:");
    for (const businessName of summary.researched20260414CreatedNames) {
      console.log(`- ${businessName}`);
    }
  }

  if (summary.researched20260414UpdatedNames.length > 0) {
    console.log("Updated 2026-04-14 researched listings:");
    for (const businessName of summary.researched20260414UpdatedNames) {
      console.log(`- ${businessName}`);
    }
  }
}

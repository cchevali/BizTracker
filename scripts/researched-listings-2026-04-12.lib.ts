import { Prisma, type PrismaClient } from "../src/generated/prisma/client";
import { DealStatus, HistoryEventType } from "../src/generated/prisma/enums";
import {
  RESEARCHED_LISTING_BATCH_DATE,
  researchedListingSeeds,
} from "./researched-listings-2026-04-12.data";

type LoadedBusiness = Prisma.BusinessGetPayload<{
  include: {
    historyEvents: true;
  };
}>;

export type ResearchedListingUpsertSummary = {
  createdNames: string[];
  updatedNames: string[];
};

const managedFieldNames = [
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

  if (Array.isArray(value)) {
    return JSON.stringify([...value].sort());
  }

  return value;
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

function findBusinessForSeed(
  businesses: LoadedBusiness[],
  seed: (typeof researchedListingSeeds)[number],
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

function getChangedFields(
  business: LoadedBusiness,
  data: Prisma.BusinessCreateInput,
) {
  const existingRecord = business as Record<string, unknown>;
  const nextRecord = data as Record<string, unknown>;

  return managedFieldNames.filter((fieldName) => {
    if (!(fieldName in nextRecord)) {
      return false;
    }

    return (
      normalizeComparableValue(existingRecord[fieldName]) !==
      normalizeComparableValue(nextRecord[fieldName])
    );
  });
}

async function createSeedBusiness(
  prisma: PrismaClient,
  seed: (typeof researchedListingSeeds)[number],
) {
  await prisma.business.create({
    data: {
      ...seed.managedBusinessData,
      historyEvents: {
        create: [
          {
            eventType: HistoryEventType.CREATED,
            description: "Added from the 2026-04-12 researched listing batch.",
            metadata: {
              batchDate: RESEARCHED_LISTING_BATCH_DATE,
              sourceUrl: seed.sourceUrl,
            },
          },
          {
            eventType: HistoryEventType.STATUS_CHANGED,
            description: `Initial seeded status set to ${seed.dealStatus}.`,
            metadata: {
              batchDate: RESEARCHED_LISTING_BATCH_DATE,
              to: seed.dealStatus,
            },
          },
        ],
      },
    },
  });
}

async function updateSeedBusiness(
  prisma: PrismaClient,
  business: LoadedBusiness,
  seed: (typeof researchedListingSeeds)[number],
) {
  const changedFields = getChangedFields(business, seed.managedBusinessData);

  if (changedFields.length === 0) {
    return false;
  }

  const historyEvents: Prisma.BusinessHistoryEventCreateWithoutBusinessInput[] = [
    {
      eventType: HistoryEventType.UPDATED,
      description: "Updated fields from the 2026-04-12 researched listing batch.",
      metadata: {
        batchDate: RESEARCHED_LISTING_BATCH_DATE,
        sourceUrl: seed.sourceUrl,
        changedFields,
      },
    },
  ];

  if (business.dealStatus !== seed.managedBusinessData.dealStatus) {
    historyEvents.push({
      eventType: HistoryEventType.STATUS_CHANGED,
      description: `Status changed from ${business.dealStatus} to ${seed.managedBusinessData.dealStatus}.`,
      metadata: {
        batchDate: RESEARCHED_LISTING_BATCH_DATE,
        from: business.dealStatus,
        to: seed.managedBusinessData.dealStatus,
      },
    });
  }

  await prisma.business.update({
    where: {
      id: business.id,
    },
    data: {
      ...seed.managedBusinessData,
      dealStatus:
        seed.managedBusinessData.dealStatus === DealStatus.RESEARCHING
          ? DealStatus.RESEARCHING
          : seed.managedBusinessData.dealStatus,
      historyEvents: {
        create: historyEvents,
      },
    },
  });

  return true;
}

export async function upsertResearchedListingBatch(
  prisma: PrismaClient,
): Promise<ResearchedListingUpsertSummary> {
  const businesses = await loadBusinesses(prisma);
  const createdNames: string[] = [];
  const updatedNames: string[] = [];

  for (const seed of researchedListingSeeds) {
    const existing = findBusinessForSeed(businesses, seed);

    if (!existing) {
      await createSeedBusiness(prisma, seed);
      createdNames.push(seed.businessName);
      continue;
    }

    if (await updateSeedBusiness(prisma, existing, seed)) {
      updatedNames.push(seed.businessName);
    }
  }

  return {
    createdNames,
    updatedNames,
  };
}

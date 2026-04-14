import { Prisma, type PrismaClient } from "../src/generated/prisma/client";
import { DealStatus, HistoryEventType } from "../src/generated/prisma/enums";
import {
  RESEARCHED_LISTING_BATCH_DATE,
  researchedListingSeeds,
} from "./researched-listings-2026-04-14.data";
import {
  findManagedBusinessForSeed,
  loadManagedBusinesses,
  managedFieldNames,
  normalizeComparableValue,
  type LoadedManagedBusiness,
} from "./managed-listing-batch.lib";

export type ResearchedListing20260414UpsertSummary = {
  createdNames: string[];
  updatedNames: string[];
};

function getChangedFields(
  business: LoadedManagedBusiness,
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
            description: "Added from the 2026-04-14 researched listing batch.",
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
  business: LoadedManagedBusiness,
  seed: (typeof researchedListingSeeds)[number],
) {
  const changedFields = getChangedFields(business, seed.managedBusinessData);

  if (changedFields.length === 0) {
    return false;
  }

  const historyEvents: Prisma.BusinessHistoryEventCreateWithoutBusinessInput[] = [
    {
      eventType: HistoryEventType.UPDATED,
      description: "Updated fields from the 2026-04-14 researched listing batch.",
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

export async function upsertResearchedListingBatch20260414(
  prisma: PrismaClient,
): Promise<ResearchedListing20260414UpsertSummary> {
  const businesses = await loadManagedBusinesses(prisma);
  const createdNames: string[] = [];
  const updatedNames: string[] = [];

  for (const seed of researchedListingSeeds) {
    const existing = findManagedBusinessForSeed(businesses, seed);

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

import { execSync } from "node:child_process";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { HistoryEventType } from "../src/generated/prisma/enums";
import {
  printAcquisitionThesisBackfillSummary,
  runAcquisitionThesisBackfill,
} from "./backfill-acquisition-thesis.lib";
import {
  assertProductionTarget,
  loadEnvironmentFromFile,
} from "./reconciliation-env";
import { reconciliationSeedBusinesses } from "./reconciliation-seed.data";
import { verifyBizTrackerReconciliation } from "./verify-biztracker-reconciliation";

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function runPrismaMigrateDeploy() {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: process.env,
  });
}

async function ensureSeedBaselineBusinesses(prisma: PrismaClient) {
  const existingBusinesses = await prisma.business.findMany({
    select: {
      businessName: true,
      sourceUrl: true,
    },
  });
  const knownSourceUrls = new Set(
    existingBusinesses
      .map((business) => business.sourceUrl)
      .filter((value): value is string => Boolean(value)),
  );
  const knownTitles = new Set(
    existingBusinesses.map((business) => normalizeTitle(business.businessName)),
  );
  const createdNames: string[] = [];

  for (const business of reconciliationSeedBusinesses) {
    const normalizedTitle = normalizeTitle(business.businessName);

    if (knownSourceUrls.has(business.sourceUrl) || knownTitles.has(normalizedTitle)) {
      continue;
    }

    const created = await prisma.business.create({
      data: {
        businessName: business.businessName,
        sourceUrl: business.sourceUrl,
        category: business.category,
        subcategory: business.subcategory,
        location: business.location,
        stateCode: business.stateCode,
        askingPrice: business.askingPrice,
        revenue: business.revenue,
        sde: business.sde,
        ebitda: business.ebitda,
        employees: business.employees,
        summary: business.summary,
        whyItMayFit: business.whyItMayFit,
        risks: business.risks,
        brokerName: business.brokerName,
        brokerFirm: business.brokerFirm,
        listingSource: business.listingSource,
        dealStatus: business.dealStatus,
        ownerDependenceRating: business.ownerDependenceRating,
        recurringRevenueRating: business.recurringRevenueRating,
        transferabilityRating: business.transferabilityRating,
        scheduleControlFitRating: business.scheduleControlFitRating,
        brotherOperatorFitRating: business.brotherOperatorFitRating,
        overallScore: business.overallScore,
        notes: business.notes,
        tags: [...business.tags],
        noteEntries: {
          create: business.noteEntries.map((note) => ({
            body: note.body,
          })),
        },
        historyEvents: {
          create: [
            {
              eventType: HistoryEventType.CREATED,
              description: "Seeded business record created during production reconciliation.",
            },
            {
              eventType: HistoryEventType.STATUS_CHANGED,
              description: `Initial seeded status set to ${business.dealStatus
                .replaceAll("_", " ")
                .toLowerCase()}.`,
              metadata: {
                to: business.dealStatus,
                source: "production-reconciliation",
              },
            },
          ],
        },
      },
    });

    if (business.noteEntries.length > 0) {
      await prisma.businessHistoryEvent.createMany({
        data: business.noteEntries.map((note) => ({
          businessId: created.id,
          eventType: HistoryEventType.NOTE_ADDED,
          description: note.body.slice(0, 110),
        })),
      });
    }

    createdNames.push(business.businessName);
    knownSourceUrls.add(business.sourceUrl);
    knownTitles.add(normalizedTitle);
  }

  return createdNames;
}

async function main() {
  const { databaseUrl, summary: databaseTarget } = loadEnvironmentFromFile(
    "production",
  );

  assertProductionTarget(databaseTarget);

  console.log(
    JSON.stringify(
      {
        step: "target-confirmed",
        databaseTarget,
      },
      null,
      2,
    ),
  );

  runPrismaMigrateDeploy();

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }),
  });

  try {
    const createdSeedNames = await ensureSeedBaselineBusinesses(prisma);
    const backfillSummary = await runAcquisitionThesisBackfill(prisma);
    const verificationResult = await verifyBizTrackerReconciliation({
      databaseUrl,
    });

    console.log(`Created missing baseline businesses: ${createdSeedNames.length}`);

    if (createdSeedNames.length > 0) {
      for (const businessName of createdSeedNames) {
        console.log(`- ${businessName}`);
      }
    }

    printAcquisitionThesisBackfillSummary(backfillSummary);
    console.log(JSON.stringify(verificationResult.summary, null, 2));

    if (verificationResult.failures.length > 0) {
      throw new Error(
        `Production reconciliation finished with verification failures:\n${verificationResult.failures.join("\n")}`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

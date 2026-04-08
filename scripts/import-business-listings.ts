import { readFile } from "node:fs/promises";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadDotenv } from "dotenv";

import {
  normalizeChatGptBusinessListings,
  type NormalizedBusinessListing,
} from "../src/features/businesses/domain/business-import-normalizer";
import { parseBusinessWorkbook } from "../src/features/businesses/domain/business-workbook-import";
import { HistoryEventType } from "../src/generated/prisma/enums";
import { PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) {
  loadDotenv();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "",
  }),
});

function getLookupWhere(listing: NormalizedBusinessListing) {
  if (listing.sourceUrl) {
    return {
      sourceUrl: listing.sourceUrl,
    };
  }

  return {
    businessName: listing.businessName,
    location: listing.location,
  };
}

async function importListing(
  listing: NormalizedBusinessListing,
  sourceLabel: string,
  importType: string,
) {
  const existing = await prisma.business.findFirst({
    where: getLookupWhere(listing),
    select: {
      id: true,
      businessName: true,
    },
  });

  if (existing) {
    return {
      status: "skipped" as const,
      businessName: existing.businessName,
    };
  }

  const created = await prisma.business.create({
    data: {
      businessName: listing.businessName,
      sourceUrl: listing.sourceUrl,
      category: listing.category,
      subcategory: listing.subcategory,
      location: listing.location,
      stateCode: listing.stateCode,
      askingPrice: listing.askingPrice,
      revenue: listing.revenue,
      sde: listing.sde,
      ebitda: listing.ebitda,
      employees: listing.employees,
      summary: listing.summary,
      whyItMayFit: listing.whyItMayFit,
      risks: listing.risks,
      brokerName: listing.brokerName,
      brokerFirm: listing.brokerFirm,
      listingSource: listing.listingSource,
      dealStatus: listing.dealStatus,
      ownerDependenceRating: listing.ownerDependenceRating,
      recurringRevenueRating: listing.recurringRevenueRating,
      transferabilityRating: listing.transferabilityRating,
      scheduleControlFitRating: listing.scheduleControlFitRating,
      brotherOperatorFitRating: listing.brotherOperatorFitRating,
      aiResistanceScore: listing.aiResistanceScore,
      keepDayJobFit: listing.keepDayJobFit,
      quitDayJobFit: listing.quitDayJobFit,
      primaryUseCase: listing.primaryUseCase,
      beatsCurrentBenchmark: listing.beatsCurrentBenchmark,
      benchmarkNotes: listing.benchmarkNotes,
      financeabilityRating: listing.financeabilityRating,
      sellerFinancingAvailable: listing.sellerFinancingAvailable,
      sellerFinancingNotes: listing.sellerFinancingNotes,
      operatorSkillDependency: listing.operatorSkillDependency,
      licenseDependency: listing.licenseDependency,
      afterHoursBurden: listing.afterHoursBurden,
      capexRisk: listing.capexRisk,
      regretIfWrongScore: listing.regretIfWrongScore,
      dataConfidenceScore: listing.dataConfidenceScore,
      staleListingRisk: listing.staleListingRisk,
      keyPersonRisk: listing.keyPersonRisk,
      homeBasedFlag: listing.homeBasedFlag,
      recurringRevenuePercent: listing.recurringRevenuePercent,
      ownerHoursClaimed: listing.ownerHoursClaimed,
      opsManagerExists: listing.opsManagerExists,
      freshnessVerifiedAt: listing.freshnessVerifiedAt,
      cashToCloseNotes: listing.cashToCloseNotes,
      overallScore: listing.overallScore,
      notes: listing.notes,
      tags: listing.tags,
      historyEvents: {
        create: {
          eventType: HistoryEventType.CREATED,
          description: `Imported from listing batch: ${sourceLabel}.`,
          metadata: {
            sourceLabel,
            sourceUrl: listing.sourceUrl,
            importType,
          },
        },
      },
    },
    select: {
      id: true,
      businessName: true,
    },
  });

  return {
    status: "created" as const,
    businessName: created.businessName,
  };
}

async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error(
      "Usage: npm run import:listings -- <input-json-or-xlsx-path>",
    );
    process.exitCode = 1;
    return;
  }

  const extension = path.extname(inputPath).toLowerCase();
  let normalized: NormalizedBusinessListing[];

  if (extension === ".xlsx") {
    normalized = await parseBusinessWorkbook(await readFile(inputPath));
  } else {
    const raw = JSON.parse(await readFile(inputPath, "utf8")) as unknown;

    if (!Array.isArray(raw)) {
      throw new Error("Expected the input JSON to be an array of business objects.");
    }

    normalized = normalizeChatGptBusinessListings(
      raw as Record<string, unknown>[],
    );
  }

  const sourceLabel = path.basename(inputPath);
  const importType = extension === ".xlsx" ? "biztracker-workbook" : "chatgpt-json-batch";

  let createdCount = 0;
  let skippedCount = 0;

  for (const listing of normalized) {
    const result = await importListing(listing, sourceLabel, importType);

    if (result.status === "created") {
      createdCount += 1;
      continue;
    }

    skippedCount += 1;
  }

  console.log(`Processed ${normalized.length} listings from ${sourceLabel}.`);
  console.log(`Created: ${createdCount}`);
  console.log(`Skipped existing: ${skippedCount}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

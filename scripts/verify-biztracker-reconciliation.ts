import { pathToFileURL } from "node:url";

import { Client } from "pg";

import { ARCHIVE_BUSINESS_NAMES, newListingSeeds } from "./backfill-acquisition-thesis.data";
import { highValueListingSeeds } from "./high-value-listings-2026-04-11.data";
import { researchedListingSeeds } from "./researched-listings-2026-04-12.data";
import { researchedListingSeeds as researchedListingSeeds20260414 } from "./researched-listings-2026-04-14.data";
import { researchedListingSeeds as researchedListingSeeds20260415 } from "./researched-listings-2026-04-15.data";
import { researchedListingSeeds as researchedListingSeeds20260415Requested } from "./researched-listings-2026-04-15-requested.data";
import { researchedListingSeeds as researchedListingSeeds20260417Requested } from "./researched-listings-2026-04-17-requested.data";
import {
  assertProductionTarget,
  type ReconciliationTarget,
  loadEnvironmentFromFile,
} from "./reconciliation-env";
import { reconciliationSeedBusinesses } from "./reconciliation-seed.data";

type VerificationSummary = {
  counts: {
    total: number;
    active: number;
    watchlist: number;
    comp_only: number;
    unverified: number;
    passed: number;
  };
  hvacBenchmarkPresent: boolean;
  missingRequiredBusinesses: string[];
  archiveNamesStillActive: string[];
  nonLowercaseCategories: string[];
  nonPublicActiveNames: string[];
  activeBackfillCoverage: {
    activeCount: number;
    aiResistancePopulated: number;
    financeabilityPopulated: number;
    keepDayJobPopulated: number;
    quitDayJobPopulated: number;
    primaryUseCasePopulated: number;
  };
  sampleBusinesses: Array<{
    businessName: string;
    dealStatus: string;
    pipelineBucket: string;
    publicSourceVerified: boolean;
    aiResistanceScore: number | null;
    financeabilityRating: number | null;
    keepDayJobFit: number | null;
    quitDayJobFit: number | null;
    primaryUseCase: string | null;
  }>;
};

const MINIMUM_EXPECTED_ACTIVE_COUNT = 15;
const MINIMUM_EXPECTED_WATCHLIST_COUNT = 10;
const MINIMUM_EXPECTED_COMP_ONLY_COUNT = 15;
const MINIMUM_EXPECTED_UNVERIFIED_COUNT = 5;
const MINIMUM_EXPECTED_PASSED_COUNT = 20;
const HVAC_BENCHMARK_NAME =
  "Profitable HVAC Air Quality & Duct Cleaning Business Franchise";
const sampleBusinessNames = [
  HVAC_BENCHMARK_NAME,
  "High Income Recession-Proof HVAC Services Business",
  "Premier NJ Residential Pool Service Co. - 37 yrs - Recurring Contracts",
  "Blue Ridge HVAC Services",
  "Northshore Commercial Cleaning",
  "Northeast Virginia Multi-trade Company",
  "Commercial Cleaning Business with Recurring Revenue!",
  "23 FedEx Ground Routes - Buffalo, NY - Seller & Vehicle Financing",
  "19 FedEx Ground Routes, Colorado Springs, CO",
  "Established Secure Document & Specialty Disposal Business – South FL",
  "Commercial Real Estate Service",
  "Anchor Point Bookkeeping Co.",
  "Established Landscaping & Snow Removal Company | $500K SDE | 30+ Years",
  "Established Landscaping, Snow Plowing, Hardscape & Concrete Company",
  "Scalable Landscaping Platform | 50% Recurring Revenue | Tampa",
] as const;

export async function verifyBizTrackerReconciliation({
  databaseUrl,
}: {
  databaseUrl: string;
}) {
  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();

  try {
    const countsResult = await client.query<{
      total: number;
      active: number;
      watchlist: number;
      comp_only: number;
      unverified: number;
      passed: number;
    }>(`
      select
        count(*)::int as total,
        count(*) filter (where "pipelineBucket" = 'ACTIVE')::int as active,
        count(*) filter (where "pipelineBucket" = 'WATCHLIST')::int as watchlist,
        count(*) filter (where "pipelineBucket" = 'COMP_ONLY')::int as comp_only,
        count(*) filter (where "pipelineBucket" = 'UNVERIFIED')::int as unverified,
        count(*) filter (where "dealStatus" = 'PASSED')::int as passed
      from "Business"
    `);

    const hvacBenchmarkResult = await client.query<{ present: boolean }>(
      `
        select exists(
          select 1 from "Business" where "businessName" = $1
        ) as present
      `,
      [HVAC_BENCHMARK_NAME],
    );

    const requiredBusinessNames = [
      ...reconciliationSeedBusinesses.map((business) => business.businessName),
      ...newListingSeeds.map((seed) => seed.businessName),
      ...highValueListingSeeds.map((seed) => seed.businessName),
      ...researchedListingSeeds.map((seed) => seed.businessName),
      ...researchedListingSeeds20260414.map((seed) => seed.businessName),
      ...researchedListingSeeds20260415.map((seed) => seed.businessName),
      ...researchedListingSeeds20260415Requested.map(
        (seed) => seed.businessName,
      ),
      ...researchedListingSeeds20260417Requested.map(
        (seed) => seed.businessName,
      ),
    ];

    const missingRequiredBusinessesResult = await client.query<{
      business_name: string;
    }>(
      `
        select business_name
        from unnest($1::text[]) as required(business_name)
        where not exists (
          select 1
          from "Business"
          where "businessName" = required.business_name
        )
        order by business_name
      `,
      [requiredBusinessNames],
    );

    const archiveNamesStillActiveResult = await client.query<{
      businessName: string;
    }>(
      `
        select "businessName"
        from "Business"
        where "businessName" = any($1::text[])
          and "dealStatus" <> 'PASSED'
        order by "businessName"
      `,
      [ARCHIVE_BUSINESS_NAMES],
    );

    const nonLowercaseCategoriesResult = await client.query<{ category: string }>(`
      select distinct category
      from "Business"
      where category <> lower(category)
      order by category
    `);

    const nonPublicActiveNamesResult = await client.query<{ businessName: string }>(`
      select "businessName"
      from "Business"
      where "pipelineBucket" = 'ACTIVE'
        and "publicSourceVerified" = false
      order by "businessName"
    `);

    const activeBackfillCoverageResult = await client.query<{
      active_count: number;
      ai_resistance_populated: number;
      financeability_populated: number;
      keep_day_job_populated: number;
      quit_day_job_populated: number;
      primary_use_case_populated: number;
    }>(`
      select
        count(*)::int as active_count,
        count(*) filter (where "aiResistanceScore" is not null)::int as ai_resistance_populated,
        count(*) filter (where "financeabilityRating" is not null)::int as financeability_populated,
        count(*) filter (where "keepDayJobFit" is not null)::int as keep_day_job_populated,
        count(*) filter (where "quitDayJobFit" is not null)::int as quit_day_job_populated,
        count(*) filter (where "primaryUseCase" is not null)::int as primary_use_case_populated
      from "Business"
      where "pipelineBucket" in ('ACTIVE', 'WATCHLIST')
    `);

    const sampleBusinessesResult = await client.query<{
      businessName: string;
      dealStatus: string;
      pipelineBucket: string;
      publicSourceVerified: boolean;
      aiResistanceScore: number | null;
      financeabilityRating: number | null;
      keepDayJobFit: number | null;
      quitDayJobFit: number | null;
      primaryUseCase: string | null;
    }>(
      `
        select
          "businessName",
          "dealStatus",
          "pipelineBucket",
          "publicSourceVerified",
          "aiResistanceScore",
          "financeabilityRating",
          "keepDayJobFit",
          "quitDayJobFit",
          "primaryUseCase"
        from "Business"
        where "businessName" = any($1::text[])
        order by "businessName"
      `,
      [sampleBusinessNames],
    );

    const summary: VerificationSummary = {
      counts: countsResult.rows[0],
      hvacBenchmarkPresent: hvacBenchmarkResult.rows[0]?.present ?? false,
      missingRequiredBusinesses: missingRequiredBusinessesResult.rows.map(
        (row) => row.business_name,
      ),
      archiveNamesStillActive: archiveNamesStillActiveResult.rows.map(
        (row) => row.businessName,
      ),
      nonLowercaseCategories: nonLowercaseCategoriesResult.rows.map(
        (row) => row.category,
      ),
      nonPublicActiveNames: nonPublicActiveNamesResult.rows.map(
        (row) => row.businessName,
      ),
      activeBackfillCoverage: {
        activeCount: activeBackfillCoverageResult.rows[0].active_count,
        aiResistancePopulated:
          activeBackfillCoverageResult.rows[0].ai_resistance_populated,
        financeabilityPopulated:
          activeBackfillCoverageResult.rows[0].financeability_populated,
        keepDayJobPopulated:
          activeBackfillCoverageResult.rows[0].keep_day_job_populated,
        quitDayJobPopulated:
          activeBackfillCoverageResult.rows[0].quit_day_job_populated,
        primaryUseCasePopulated:
          activeBackfillCoverageResult.rows[0].primary_use_case_populated,
      },
      sampleBusinesses: sampleBusinessesResult.rows,
    };

    const failures: string[] = [];

    if (summary.counts.active < MINIMUM_EXPECTED_ACTIVE_COUNT) {
      failures.push(
        `Active count ${summary.counts.active} is below the expected minimum ${MINIMUM_EXPECTED_ACTIVE_COUNT}.`,
      );
    }

    if (summary.counts.watchlist < MINIMUM_EXPECTED_WATCHLIST_COUNT) {
      failures.push(
        `Watchlist count ${summary.counts.watchlist} is below the expected minimum ${MINIMUM_EXPECTED_WATCHLIST_COUNT}.`,
      );
    }

    if (summary.counts.comp_only < MINIMUM_EXPECTED_COMP_ONLY_COUNT) {
      failures.push(
        `Comp-only count ${summary.counts.comp_only} is below the expected minimum ${MINIMUM_EXPECTED_COMP_ONLY_COUNT}.`,
      );
    }

    if (summary.counts.unverified < MINIMUM_EXPECTED_UNVERIFIED_COUNT) {
      failures.push(
        `Unverified count ${summary.counts.unverified} is below the expected minimum ${MINIMUM_EXPECTED_UNVERIFIED_COUNT}.`,
      );
    }

    if (summary.counts.passed < MINIMUM_EXPECTED_PASSED_COUNT) {
      failures.push(
        `Passed count ${summary.counts.passed} is below the expected minimum ${MINIMUM_EXPECTED_PASSED_COUNT}.`,
      );
    }

    if (!summary.hvacBenchmarkPresent) {
      failures.push(`${HVAC_BENCHMARK_NAME} is missing.`);
    }

    if (summary.missingRequiredBusinesses.length > 0) {
      failures.push(
        `Missing required businesses: ${summary.missingRequiredBusinesses.join(", ")}`,
      );
    }

    if (summary.archiveNamesStillActive.length > 0) {
      failures.push(
        `Archive candidates still active: ${summary.archiveNamesStillActive.join(", ")}`,
      );
    }

    if (summary.nonLowercaseCategories.length > 0) {
      failures.push(
        `Found non-lowercase categories: ${summary.nonLowercaseCategories.join(", ")}`,
      );
    }

    if (summary.nonPublicActiveNames.length > 0) {
      failures.push(
        `Active pipeline still contains unverified source rows: ${summary.nonPublicActiveNames.join(", ")}`,
      );
    }

    if (
      summary.activeBackfillCoverage.aiResistancePopulated !==
        summary.activeBackfillCoverage.activeCount ||
      summary.activeBackfillCoverage.financeabilityPopulated !==
        summary.activeBackfillCoverage.activeCount ||
      summary.activeBackfillCoverage.keepDayJobPopulated !==
        summary.activeBackfillCoverage.activeCount ||
      summary.activeBackfillCoverage.quitDayJobPopulated !==
        summary.activeBackfillCoverage.activeCount ||
      summary.activeBackfillCoverage.primaryUseCasePopulated !==
        summary.activeBackfillCoverage.activeCount
    ) {
      failures.push(
        `Not all active businesses have populated thesis fields. Coverage: ${JSON.stringify(summary.activeBackfillCoverage)}`,
      );
    }

    return {
      failures,
      summary,
    };
  } finally {
    await client.end();
  }
}

function parseArgs(argv: string[]) {
  let explicitEnvFile: string | undefined;
  let target: ReconciliationTarget = "local";

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--env-file") {
      explicitEnvFile = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === "--target") {
      const nextValue = argv[index + 1];

      if (nextValue === "local" || nextValue === "production") {
        target = nextValue;
        index += 1;
      }
    }
  }

  return {
    explicitEnvFile,
    target,
  };
}

async function main() {
  const { explicitEnvFile, target } = parseArgs(process.argv.slice(2));
  const { databaseUrl, summary: databaseTarget } = loadEnvironmentFromFile(
    target,
    explicitEnvFile,
  );

  if (target === "production") {
    assertProductionTarget(databaseTarget);
  }

  console.log(
    JSON.stringify(
      {
        target,
        databaseTarget,
      },
      null,
      2,
    ),
  );

  const result = await verifyBizTrackerReconciliation({
    databaseUrl,
  });

  console.log(JSON.stringify(result.summary, null, 2));

  if (result.failures.length > 0) {
    for (const failure of result.failures) {
      console.error(`FAIL: ${failure}`);
    }

    process.exitCode = 1;
  }
}

const isDirectExecution = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

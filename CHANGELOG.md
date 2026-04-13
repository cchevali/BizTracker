# CHANGELOG

## 2026-04-05
- Created the initial Next.js 16 + Prisma 7 + PostgreSQL acquisition tracker.
- Added dashboard table/cards views, search, filters, sorting, and saved presets.
- Added create/edit/detail flows with validation.
- Added business notes, change history, and quick status updates.
- Added realistic seed data and the initial migration.
- Added context-retention and handoff documentation for future Codex sessions.
- Added Vitest unit tests for filter parsing, validation, and repository mutations.
- Fixed dark Link-based buttons that were rendering without visible labels.
- Added a `Generate ChatGPT workbook` dashboard action and `.xlsx` export route with `businesses`, `notes`, `history`, and `metadata` sheets.
- Added export-focused unit tests and chose `exceljs` for workbook generation after rejecting `xlsx` because of unresolved audit advisories.
- Fixed auto-derived overall scoring so owner dependence lowers the score instead of raising it.
- Added a reusable `normalize:listings` script for cleaning ChatGPT JSON batches into import-ready records.
- Added a reusable `import:listings` script for safely importing normalized ChatGPT listing batches into PostgreSQL.
- Imported the first 24-listing BizBuySell ChatGPT batch into the tracker database.
- Added production base-path support, deployed the app on Vercel + Neon, and published it at `https://microflowops.com/biztracker` through the existing MicroFlowOps host rewrite.
- Added a GitHub Actions workflow and deployment docs for Git-based preview and production deploys to the `microflowops-biztracker` Vercel project.
- Adjusted the GitHub Actions deploy workflow to use `npm install` after the first Linux runner execution exposed optional dependency issues with `npm ci`.
- Simplified the mobile dashboard around search plus score filtering, card-first small-screen results, and an ask-price-low-to-high default sort.

## 2026-04-07
- Extended the BizTracker schema, validation, repository layer, forms, detail page, filters, sorting, and workbook export to support acquisition-screening v2 fields.
- Added shared scenario assumptions and derived cash calculations for cash to close, debt service, conservative SDE, and post-brother cash outputs.
- Preserved workbook compatibility by appending new `businesses` columns after the original schema and adding workbook import support for both old and v2 exports.
- Added DB-level check constraints for legacy and new 1-to-5 rating fields plus `recurringRevenuePercent`.
- Added Vitest coverage for scenario math, workbook import compatibility, new filter/sort behavior, and expanded export assertions.
- Updated the default active pipeline to exclude `Passed` deals unless the filter explicitly requests them.
- Added `scripts/backfill-acquisition-thesis.ts` and `scripts/backfill-acquisition-thesis.data.ts` for the April 7, 2026 thesis cleanup pass.
- Marked seven low-fit deals as passed, added eight discussed public listings, backfilled acquisition-thesis fields for active businesses, and appended structured skeptical analysis notes without overwriting prior notes.
- Fixed the thesis backfill runner to be idempotent and added duplicate guards for same-run source URL and normalized-title collisions.

## 2026-04-08
- Diagnosed a production data mismatch where the live Neon database had the new schema but still only held the original 24 imported businesses with no thesis cleanup/backfill applied.
- Added `scripts/reconciliation-seed.data.ts`, `scripts/reconciliation-env.ts`, `scripts/reconcile-production-data.ts`, and `scripts/verify-biztracker-reconciliation.ts` to make production repair explicit, safe, and repeatable.
- Restored the six missing curated baseline businesses in production, reran the thesis archive/add/backfill pass against production, and brought the live data to `38 total / 30 active / 8 passed`.
- Updated the production deploy workflow to verify the expected reconciliation state after migrations so future schema-only deploys cannot silently leave production data half-migrated.

## 2026-04-11
- Added `scripts/high-value-listings-2026-04-11.data.ts` and `scripts/high-value-listings-2026-04-11.lib.ts` for a repo-managed high-value public listing batch that upserts full records by `sourceUrl`.
- Added 14 serious public listing candidates to the managed thesis set, including full skeptical assessment text, tags, taxonomy, and acquisition-screening fields.
- Removed the Doug Jackson chimney listing from the April 7 archive set and moved the Harrisburg residential pest listing out of the older thesis-only backfill map so the new managed upsert batch can own those records cleanly.
- Extended the thesis backfill runner and reconciliation verifier to expect the new batch, and added a test that enforces unique source URLs plus the required notes house style for the 2026-04-11 managed listings.
- Hardened the Vercel deploy workflow with explicit token/project validation, retryable `vercel pull`, and direct `vercel deploy --format=json` deploys instead of the separate prebuilt path.
- Added `scripts/check-vercel-access.ts`, `scripts/manual-production-deploy.ts`, and `scripts/vercel-deploy.lib.ts` so future sessions have a repo-native way to diagnose Vercel auth drift and run the working manual production deploy sequence with smoke checks.
- Fixed the repo-native manual production deploy helper on Windows by switching its command runner away from direct `*.cmd` spawning, made Vercel deploy output parsing tolerant of mixed status/json output, and limited smoke checks to the stable public URLs because the raw deployment URL can return `401` even after a healthy production deploy.
- Added the same transient Prisma advisory-lock retry behavior to the manual production deploy fallback after a live Neon lock timeout interrupted the first retry-free run.

## 2026-04-12
- Added `scripts/researched-listings-2026-04-12.data.ts` and `scripts/researched-listings-2026-04-12.lib.ts` for a second repo-managed public listing batch covering five researched additions.
- Added first-pass underwriting, benchmark notes, skeptical analysis text, and follow-up diligence questions for Buffalo FedEx Ground Routes, Ann Arbor Area Construction Business, the Pittsburgh multi-unit auto paint business, the White Bear Lake healthcare staffing agency, and the Raleigh AI-enhanced wellness listing.
- Wired the new researched batch into `scripts/backfill-acquisition-thesis.ts` and `scripts/verify-biztracker-reconciliation.ts` so reconciliation now expects and recreates those listings alongside the earlier 2026-04-11 managed batch.
- Added test coverage for the 2026-04-12 researched batch, including required notes house style and cross-batch source URL and business-name uniqueness.
- Verified the new researched batch locally against a Docker-backed disposable Postgres database via the focused upsert path, then reconciled and manually redeployed production so the live workbook export now returns `48` active businesses including all five additions.

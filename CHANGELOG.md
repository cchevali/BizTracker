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

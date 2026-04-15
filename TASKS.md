# TASKS

## Completed
- Scaffolded a Next.js 16 App Router app with TypeScript and Tailwind
- Added PostgreSQL local development via `compose.yaml`
- Added Prisma 7 config, schema, generated client output, initial migration, and seed script
- Implemented dashboard search, filtering, sorting, table/cards views, and saved filter presets
- Implemented create, edit, and detail flows
- Implemented status updates, notes, and change history
- Added context-retention docs and human setup docs
- Added Vitest unit tests for filter parsing, validation, and repository mutations
- Added a ChatGPT workbook export button and `.xlsx` download flow for the current tracker view
- Added shared score normalization and a reusable ChatGPT listing JSON normalizer script
- Added a reusable ChatGPT listing import script and imported the first 24-listing BizBuySell batch
- Productionized the app on Vercel + Neon and published it at `https://microflowops.com/biztracker`
- Added GitHub Actions-based preview and production auto-deploys for the `microflowops-biztracker` Vercel project
- Simplified the mobile dashboard to search plus score filtering and made ask price low-to-high the default sort
- Extended the `Business` model, validation, repository mapping, forms, detail pages, filters, sorting, and workbook export/import support for acquisition-screening v2 fields
- Added shared scenario assumptions and derived cash calculations for cash-to-close, debt service, and post-brother cash outputs
- Added workbook import parsing for old-schema and v2-schema tracker exports
- Added tests for scenario calculations, workbook import compatibility, export headers/values, and new filter/sort behavior
- Added an idempotent thesis cleanup/backfill script that archives selected low-fit deals, seeds the discussed public listings, backfills active businesses, and appends structured analysis notes
- Updated the default active pipeline to exclude `Passed` deals while keeping them queryable and exportable when explicitly requested
- Diagnosed and fixed production data drift by restoring missing curated seed records, running the thesis cleanup/backfill against Neon production, and verifying the expected `30 active / 8 passed` state
- Added production-safe reconciliation and verification scripts plus an automatic production deploy check for reconciliation drift
- Added a repo-managed 2026-04-11 high-value public listing upsert batch keyed by `sourceUrl`, including full listing facts, skeptical assessments, and coherent history/status updates for the tracker's serious public candidates
- Added a repo-managed 2026-04-12 researched public listing batch keyed by `sourceUrl`, deduped against the active tracker export baseline, with full first-pass underwriting, skeptical notes, and diligence questions for five new listings
- Added a shared managed-listing dedupe helper that falls back from normalized `sourceUrl` to BizBuySell ad id and normalized title + location before creating repo-managed public listings
- Added a repo-managed 2026-04-14 researched public listing batch for two Colorado Springs FedEx route packages, the Midvale commercial real-estate service listing, the Grand Rapids restoration anomaly listing, and the Grand Rapids multi-unit paint-and-dent franchise follow-up
- Added a repo-managed 2026-04-15 researched public listing batch for the Columbus-area plumbing listing, the Southeast Michigan residential HVAC listing, the Fairfax remodeling listing, and the Charlotte commercial HVAC listing, including conservative scorecards and a pending-to-`LETTER_OF_INTENT` mapping for the live sale-pending plumbing deal
- Hardened Vercel deploy automation with explicit credential validation, retryable `vercel pull`, direct CLI deploys, and a repo-native manual production deploy fallback with smoke checks
- Reconciled and manually deployed production after the 2026-04-12 researched batch, bringing the live tracker to `55 total / 48 active / 7 passed`
- Reconciled production after the 2026-04-14 researched batch, bringing the live tracker to `60 total / 53 active / 7 passed`, and verified the live export plus public search/filter views for the new rows
- Reconciled production after the 2026-04-15 researched batch, bringing the live tracker to `64 total / 57 active / 7 passed`, and verified the live export includes each new source URL exactly once
- Verified typecheck, lint, build, migration, and seed
- Verified the acquisition-screening v2 and thesis cleanup pass with `npm run db:migrate`, `npm run backfill:thesis`, `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`
- Verified production reconciliation with `npm run reconcile:production`, a second idempotence rerun, and the live export route at `https://microflowops.com/biztracker/exports/businesses`

## In Progress
- None

## Next Recommended Tasks
- Rotate the GitHub repo `VERCEL_TOKEN` now that the 2026-04-12 production run failed early with `The token provided via --token argument is not valid`
- Consider adding a dedicated public pending status or richer deal-stage mapping now that live sale-pending listings are being tracked through the existing `LETTER_OF_INTENT` enum
- Add a Prisma-backed integration smoke test for workbook export/import and the thesis backfill script against a real test database
- Consider a scheduled or manually dispatchable GitHub workflow that runs the production reconciliation verifier without requiring a code push
- Add explicit bulk archive/revive actions in the UI now that the active pipeline intentionally hides `Passed` deals by default
- Add optional structured source ingestion from pasted listing URLs, workbook uploads, or Codex links
- Add a marketplace comparison workflow that pairs the workbook export with current-market listing inputs
- Build an in-app import flow that uses the JSON/workbook normalizers instead of requiring offline prep
- Add authentication if this ever becomes shared across users
- Consider Postgres full-text search if global search becomes a bottleneck
- Optionally add pull-request comments or deployment-status reporting if preview URLs need to surface directly in GitHub discussions

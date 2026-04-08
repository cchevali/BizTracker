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
- Verified typecheck, lint, build, migration, and seed
- Verified the acquisition-screening v2 and thesis cleanup pass with `npm run db:migrate`, `npm run backfill:thesis`, `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build`

## In Progress
- None

## Next Recommended Tasks
- Add a Prisma-backed integration smoke test for workbook export/import and the thesis backfill script against a real test database
- Add explicit bulk archive/revive actions in the UI now that the active pipeline intentionally hides `Passed` deals by default
- Add optional structured source ingestion from pasted listing URLs, workbook uploads, or Codex links
- Add a marketplace comparison workflow that pairs the workbook export with current-market listing inputs
- Build an in-app import flow that uses the JSON/workbook normalizers instead of requiring offline prep
- Add authentication if this ever becomes shared across users
- Consider Postgres full-text search if global search becomes a bottleneck
- Optionally add pull-request comments or deployment-status reporting if preview URLs need to surface directly in GitHub discussions

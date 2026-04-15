# ARCHITECTURE

## System Structure
- App layer: Next.js App Router pages under `src/app`
- Feature UI: `src/features/businesses/components`
- Domain layer: `src/features/businesses/domain`
- Data layer: `src/features/businesses/data`
- Mutation layer: `src/features/businesses/actions`
- Feature utilities: `src/features/businesses/utils`
- Shared UI/utilities: `src/components/ui`, `src/lib`
- Persistence: Prisma schema, migrations, and seed under `prisma/`
- Deployment: standalone Vercel app `microflowops-biztracker`, Neon Postgres, and an external host-app rewrite from `microflowops.com/biztracker`
- Release automation: GitHub Actions workflow `.github/workflows/vercel-deploy.yml`

## Folder Layout
- `src/app/page.tsx`: dashboard
- `src/app/businesses/new/page.tsx`: create flow
- `src/app/businesses/[businessId]/page.tsx`: detail page
- `src/app/businesses/[businessId]/edit/page.tsx`: edit flow
- `src/features/businesses/domain/business.types.ts`: business-facing types and options
- `src/features/businesses/domain/business.filters.ts`: URL filter parsing/serialization
- `src/features/businesses/domain/business.schemas.ts`: server-side validation
- `src/features/businesses/domain/business-score.ts`: shared rating-to-score logic
- `src/features/businesses/domain/business-scenario.ts`: shared acquisition scenario assumptions and derived cash calculations
- `src/features/businesses/domain/business-import-normalizer.ts`: ChatGPT JSON cleanup into import-ready records
- `src/features/businesses/domain/business-export.ts`: export dataset shaping for workbook downloads
- `src/features/businesses/domain/business-workbook-import.ts`: workbook parsing for old and v2 tracker exports
- `src/features/businesses/data/business-repository.ts`: Prisma reads/writes
- `src/features/businesses/utils/business-export-workbook.ts`: Excel workbook generation
- `src/features/businesses/actions/business-actions.ts`: server actions
- `src/app/exports/businesses/route.ts`: workbook download endpoint for current tracker filters
- `scripts/normalize-chatgpt-listings.ts`: CLI normalizer for external ChatGPT listing batches
- `scripts/import-business-listings.ts`: CLI importer that creates businesses from normalized ChatGPT listing batches
- `scripts/backfill-acquisition-thesis.data.ts`: manual thesis ratings, benchmark notes, and listing seed data for the April 7, 2026 cleanup pass
- `scripts/backfill-acquisition-thesis.lib.ts`: reusable archive/add/backfill logic for the thesis cleanup pass
- `scripts/backfill-acquisition-thesis.ts`: idempotent cleanup/backfill runner for archiving low-fit deals and updating active ones
- `scripts/high-value-listings-2026-04-11.data.ts`: full managed listing records for the 2026-04-11 high-value batch, including skeptical notes, taxonomy, and scores
- `scripts/high-value-listings-2026-04-11.lib.ts`: source-url upsert logic for the 2026-04-11 high-value batch
- `scripts/researched-listings-2026-04-12.data.ts`: full managed listing records for the 2026-04-12 researched additions batch, including first-pass underwriting and diligence questions
- `scripts/researched-listings-2026-04-12.lib.ts`: source-url upsert logic for the 2026-04-12 researched additions batch
- `scripts/researched-listings-2026-04-14.data.ts`: full managed listing records for the 2026-04-14 researched additions batch, including the new Colorado Springs FedEx, Midvale commercial real estate, Grand Rapids restoration, and Grand Rapids franchise follow-up listings
- `scripts/researched-listings-2026-04-14.lib.ts`: upsert logic for the 2026-04-14 researched additions batch
- `scripts/researched-listings-2026-04-15.data.ts`: full managed listing records for the 2026-04-15 researched additions batch, including the Columbus-area plumbing, Southeast Michigan HVAC, Fairfax remodeling, and Charlotte commercial HVAC follow-up listings
- `scripts/researched-listings-2026-04-15.lib.ts`: upsert logic for the 2026-04-15 researched additions batch
- `scripts/researched-listings-2026-04-15-requested.data.ts`: full managed listing records for the 2026-04-15 requested 12-listing researched batch, including workbook-informed dedupe and conservative first-pass underwriting for HVAC, plumbing, pool, landscaping, air-duct, lawn-care, and pest-control additions
- `scripts/researched-listings-2026-04-15-requested.lib.ts`: upsert logic for the 2026-04-15 requested 12-listing researched batch
- `scripts/managed-listing-batch.lib.ts`: shared normalized source-url, BizBuySell ad-id, and normalized title-location dedupe helpers for managed public listing batches
- `scripts/reconciliation-seed.data.ts`: baseline curated records that production reconciliation must restore if the production DB was never seeded
- `scripts/reconciliation-env.ts`: env-file loading and production-target safety checks for reconciliation scripts
- `scripts/reconcile-production-data.ts`: one-shot production reconciliation runner that migrates, restores missing curated records, runs the thesis cleanup/backfill, and verifies the result
- `scripts/verify-biztracker-reconciliation.ts`: lightweight DB verification for expected counts, benchmark presence, archive status, and thesis-field coverage
- `scripts/check-vercel-access.ts`: validates GitHub Actions Vercel credentials and prints an actionable failure when token/project config drifts
- `scripts/manual-production-deploy.ts`: repo-native manual production deploy fallback that pulls env, runs migrations, verifies reconciliation state, deploys directly through Vercel, and smoke-checks the standalone alias, public path, and workbook export
- `scripts/vercel-deploy.lib.ts`: small shared helpers for Vercel CLI command execution and JSON output parsing
- `src/lib/prisma.ts`: Prisma client singleton with Pg adapter
- `src/lib/site.ts`: base-path and site URL helpers for local vs production hosting
- `src/generated/prisma/*`: generated Prisma client output
- `tests/*`: Vitest unit coverage for filters, validation, scoring, scenario math, workbook import/export shaping, import normalization, and repository mutations

## Data Flow
1. Dashboard reads `searchParams`.
2. `business.filters.ts` parses URL state into typed filters.
3. `business-repository.ts` builds Prisma queries, applies the default active-pipeline behavior, and returns mapped view models with derived scenario values.
4. Server components render dashboard/detail pages.
5. Forms submit to server actions in `business-actions.ts`.
6. Actions validate input with Zod, call repository functions, then `redirect`, `refresh`, or `revalidatePath`.
7. Repository writes durable audit context via `BusinessHistoryEvent` and `BusinessNote`, including new acquisition-screening field changes.
8. `business-scenario.ts` provides one shared assumptions module for cash-to-close, debt-service, and post-brother cash calculations; list/detail/export views all reuse it.
9. Workbook export reads the same filter query state, loads matching businesses plus notes/history, shapes rows in `business-export.ts`, and streams an `.xlsx` response from `src/app/exports/businesses/route.ts`.
10. Workbook import parsing in `business-workbook-import.ts` accepts both the original workbook schema and the v2 appended-column schema, then normalizes the result through the same import-normalizer path.
11. External ChatGPT listing batches can be normalized offline through `scripts/normalize-chatgpt-listings.ts`, which standardizes score semantics before later import.
12. `scripts/import-business-listings.ts` imports normalized listing batches into PostgreSQL, keyed conservatively by `sourceUrl` when available so repeat runs skip existing records instead of overwriting them.
13. `scripts/backfill-acquisition-thesis.ts` performs the April 7, 2026 thesis cleanup pass by marking selected deals as passed, seeding missing public listings, and backfilling acquisition-thesis fields plus analysis notes for active records.
14. The thesis backfill runner now also upserts the 2026-04-11 high-value public listing batch plus the 2026-04-12, 2026-04-14, 2026-04-15, and 2026-04-15 requested researched additions batches, matching managed rows by normalized `sourceUrl`, then BizBuySell ad id, then normalized title + location before refreshing listing facts, skeptical assessment text, deal status, and matching history rows.
15. Managed public rows can preserve live public sale-pending context by mapping those listings into the existing `LETTER_OF_INTENT` enum plus pending-style tags until a dedicated pending status exists in the schema.
16. `scripts/reconcile-production-data.ts` is the safe production repair path when schema/code is live but the Neon database still lacks the baseline curated records, thesis cleanup pass, or any of the managed public listing batches.
17. `scripts/verify-biztracker-reconciliation.ts` provides the same production data assertions for manual use and for the GitHub Actions production deploy job.
18. `.github/workflows/vercel-deploy.yml` now validates Vercel access explicitly, retries `vercel pull`, and deploys directly with `vercel deploy --format=json` instead of relying on a separate prebuilt artifact step.
19. `scripts/manual-production-deploy.ts` mirrors that safer direct-deploy path for local fallback use, then smoke-checks the stable public URLs instead of the raw deployment URL.
20. In production, `microflowops.com/biztracker` requests are rewritten by `C:\dev\OSHA_Leads\web\next.config.mjs` to the standalone BizTracker Vercel deployment, which serves the app with `NEXT_PUBLIC_BASE_PATH=/biztracker`.

## Database Model Summary
- `Business`: primary acquisition record with financials, qualitative assessment, legacy ratings, acquisition-thesis fields, manual diligence notes, score, status, tags, and timestamps
- `BusinessNote`: per-business note entries
- `BusinessHistoryEvent`: durable event log for create/update/status/note changes
- `FilterPreset`: saved dashboard query states

## API Boundaries
- There is no public REST API yet.
- Mutations use server actions.
- Reads are server-side Prisma queries from App Router pages/components.
- The only route handler is the workbook export endpoint because file download is a concrete integration need.
- Keep the API surface small unless a concrete integration requires route handlers later.

## Deployment Notes
- Production app URL: `https://microflowops.com/biztracker`
- Standalone Vercel deployment URL: `https://microflowops-biztracker.vercel.app/biztracker`
- Production database: Neon Postgres connected through Vercel-managed environment variables
- Public path routing depends on the external MicroFlowOps host repo at `C:\dev\OSHA_Leads\web`
- Git-based deploy automation is handled in-repo through `.github/workflows/vercel-deploy.yml` using GitHub secrets/variables rather than Vercel's native repo connection
- Local manual production fallback is `npm run deploy:production:manual`, which intentionally avoids the brittle local `vercel build --prod` path and smoke-checks the live URLs after deploy

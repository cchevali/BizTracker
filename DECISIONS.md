# DECISIONS

## 2026-04-05
Decision: Build as a single Next.js App Router monolith with feature folders.
Reason: The product is small, internal, and benefits more from obvious file boundaries than distributed services or separate packages.
Consequences: UI, domain, data access, and actions stay in one repo with low coordination overhead.

## 2026-04-05
Decision: Use server actions for mutations and server-rendered reads for the dashboard/detail pages.
Reason: This keeps the API surface minimal and makes the mutation flow easy for future sessions to trace.
Consequences: There is no public REST layer yet; future integrations may add route handlers only if needed.

## 2026-04-05
Decision: Use Prisma 7 with `prisma.config.ts`, generated client output in `src/generated/prisma`, and `@prisma/adapter-pg`.
Reason: Prisma 7 no longer supports datasource URLs in `schema.prisma`, and the current official setup expects config-based datasource wiring plus an adapter-backed client.
Consequences: Future changes must preserve `prisma.config.ts` and avoid reintroducing old Prisma patterns.

## 2026-04-05
Decision: Keep dashboard state in URL search params and store saved presets as serialized query state.
Reason: URL state is durable, sharable, and easy for future Codex sessions to reason about.
Consequences: Filter and sort behavior should continue to round-trip through `business.filters.ts`.

## 2026-04-05
Decision: Store tags directly on `Business` as a lowercase Postgres string array.
Reason: This is simpler than a normalized tag table for the current single-user scope.
Consequences: Tag analytics and global tag management are limited; a future normalization pass is possible if the product grows.

## 2026-04-05
Decision: Record notes and change history in dedicated tables instead of relying only on `updatedAt`.
Reason: Context continuity is a core product requirement, and audit-like history helps future sessions understand how a record evolved.
Consequences: Meaningful mutations should continue to create history entries.

## 2026-04-05
Decision: Add Vitest for focused unit tests and mock Prisma in repository mutation tests.
Reason: The highest-value coverage at this stage is fast feedback on filter parsing, form validation, and mutation contracts without requiring a separate test database harness.
Consequences: Repository tests verify Prisma call shapes and mutation behavior, but they do not replace future integration tests against a real database.

## 2026-04-05
Decision: Export tracker data as a multi-sheet `.xlsx` workbook using an App Router route handler and `exceljs`.
Reason: ChatGPT comparison workflows benefit from spreadsheet uploads, and `exceljs` avoided the unresolved high-severity audit issues found in `xlsx`.
Consequences: Workbook shape now lives in `src/features/businesses/domain/business-export.ts`, download delivery lives in `src/app/exports/businesses/route.ts`, and future export changes should preserve the `businesses`, `notes`, `history`, and `metadata` sheets unless there is a strong reason to break compatibility.

## 2026-04-05
Decision: Treat `ownerDependenceRating` as a negative factor when deriving overall score, and normalize external ChatGPT JSON batches through a dedicated script.
Reason: The UI records owner dependence as `1 low, 5 high`, so averaging it directly would reward worse businesses. External ChatGPT exports were also arriving with legacy 10-point scores that needed consistent cleanup before import.
Consequences: Score derivation now inverts owner dependence via `src/features/businesses/domain/business-score.ts`, and future ChatGPT listing batches should run through `scripts/normalize-chatgpt-listings.ts` before import or manual review.

## 2026-04-05
Decision: Import ChatGPT listing batches through a create-only CLI keyed by `sourceUrl` instead of updating matching records automatically.
Reason: Imported listings may later receive manual edits, and a conservative create-or-skip import path is safer than silently overwriting analyst changes on reruns.
Consequences: `scripts/import-business-listings.ts` can be rerun safely for the same batch, but refreshing an already-imported listing now requires a deliberate manual edit or a future update workflow.

## 2026-04-05
Decision: Deploy BizTracker as its own Vercel app with a `/biztracker` base path, and publish it under `microflowops.com/biztracker` through a rewrite in the existing MicroFlowOps host app.
Reason: Vercel custom domains attach at the project level, but this app needed to live under an existing apex site path rather than take over the whole domain.
Consequences: Production hosting now depends on both this repo and `C:\dev\OSHA_Leads\web\next.config.mjs`; future public-routing changes must keep `next.config.ts`, `src/lib/site.ts`, and the host-app rewrite aligned.

## 2026-04-05
Decision: Use GitHub Actions with a Vercel token for auto-deploys instead of relying on Vercel's native GitHub repository connection.
Reason: Connecting `cchevali/BizTracker` directly through `vercel git connect` failed from the CLI, likely because the Vercel GitHub integration does not currently have access to that repository.
Consequences: Auto-deploys are now repo-owned and explicit in `.github/workflows/vercel-deploy.yml`, but they depend on `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` being maintained in GitHub repo settings.

## 2026-04-05
Decision: Use `npm install` rather than `npm ci` in the GitHub Actions deploy workflow.
Reason: The repo is maintained on Windows, and the current dependency tree includes Linux-only optional native packages that caused `npm ci` to fail on GitHub's Ubuntu runner even though local installs were healthy.
Consequences: Deploy automation stays cross-platform and reliable, but the workflow gives up strict lockfile immutability checks during deploy runs.

## 2026-04-06
Decision: Keep the mobile dashboard focused on global search, score filtering, and card-first results, while changing the default sort to ask price low-to-high.
Reason: The full desktop filter sidebar and table view were too dense on phones, and ask price is the most practical default browsing order for this acquisition workflow.
Consequences: Small screens now intentionally hide most filter fields and always render cards for table-mode views, while desktop retains the full filter set and view toggle behavior.

## 2026-04-07
Decision: Preserve the meaning of legacy `overall_score` and add acquisition-thesis analysis as separate fields plus shared scenario math.
Reason: Existing records and exports already use `overall_score`, so silently changing its meaning would make historical comparisons misleading.
Consequences: New fields such as `keep_day_job_fit`, `quit_day_job_fit`, and financeability metrics live alongside the legacy score, while `src/features/businesses/domain/business-scenario.ts` computes cash-to-close and post-brother cash outputs from shared assumptions.

## 2026-04-07
Decision: Keep workbook compatibility by appending new export columns, accepting both old and new workbook schemas on import, and recomputing derived scenario fields from base data.
Reason: ChatGPT workbook workflows already depended on the original businesses-sheet column order, but the new screening fields still needed to round-trip safely.
Consequences: `src/features/businesses/domain/business-export.ts` preserves the original columns first and appends the v2 fields afterward, while `src/features/businesses/domain/business-workbook-import.ts` tolerates missing new columns and does not trust imported derived values over recalculation.

## 2026-04-07
Decision: Treat `Passed` deals as archived from the default active pipeline without deleting them, and make the thesis cleanup/backfill reproducible through a dedicated script.
Reason: The product needs a cleaner working set for active evaluation, but archived deals, notes, and history still matter for context and export integrity.
Consequences: Dashboard queries now exclude `Passed` deals by default unless filters explicitly request them, and `scripts/backfill-acquisition-thesis.ts` can rerun safely to preserve the April 7, 2026 cleanup state.

## 2026-04-08
Decision: Repair production data drift through an explicit reconciliation command and fail production deploys when the expected thesis-cleanup data state is missing.
Reason: The production database can be on the correct schema and app version while still missing baseline curated records or the manual thesis cleanup/backfill pass, so deploy success alone is not enough to prove live correctness.
Consequences: `npm run reconcile:production` now restores missing curated records, reruns the thesis reconciliation safely against the Vercel production env, and verifies the result, while `.github/workflows/vercel-deploy.yml` runs `scripts/verify-biztracker-reconciliation.ts` so future drift is caught automatically.

## 2026-04-11
Decision: Treat the 2026-04-11 high-value public listing batch as repo-managed tracker data that upserts full records by `sourceUrl` instead of only creating missing rows or backfilling thesis-only fields.
Reason: These public listings are now part of the tracked thesis set, and some of them already existed with weaker notes or outdated status, so create-only behavior would either duplicate them or leave stale assessments in place.
Consequences: `scripts/backfill-acquisition-thesis.ts` now refreshes the managed high-value batch with canonical listing facts, skeptical notes, `RESEARCHING` status, and matching history rows, while unrelated manual note entries and non-managed records remain untouched.

## 2026-04-11
Decision: Harden Vercel deploy automation around explicit auth validation, retryable environment pulls, and direct `vercel deploy` calls instead of relying on a separate local `vercel build --prebuilt` path.
Reason: The session exposed two operational weak points: GitHub Actions failures at the Vercel auth/pull step were too opaque, and the local Windows fallback using `vercel build --prod` failed even though a direct `vercel --prod --yes` deploy succeeded.
Consequences: `.github/workflows/vercel-deploy.yml` now validates Vercel credentials before pull, retries `vercel pull`, and deploys directly from Vercel CLI JSON output, while `scripts/manual-production-deploy.ts` becomes the documented fallback path with smoke checks for the standalone alias, public path, and export route.

## 2026-04-12
Decision: Treat the stable public production URLs as the required smoke targets for manual production deploys instead of the raw per-deployment Vercel URL.
Reason: The 2026-04-12 manual production deploy produced a valid deployment and healthy public alias/export responses, but the raw deployment URL returned `401`, which made it a poor health signal for this project.
Consequences: `scripts/manual-production-deploy.ts` now verifies the standalone alias, public `/biztracker` path, and workbook export only, while still logging the deployment URL for operator reference.

## 2026-04-12
Decision: Add the 2026-04-12 researched public listings as a second repo-managed `sourceUrl` upsert batch instead of importing them ad hoc or editing the database manually.
Reason: These five additions need the same reproducible first-pass underwriting, dedupe protection, and reconciliation behavior as the earlier managed listing batch, while still preserving skeptical notes and nulls for undisclosed facts like the Pittsburgh listing's missing SDE.
Consequences: `scripts/backfill-acquisition-thesis.ts` now owns both managed public listing batches, verification expects the new researched records to exist after reconciliation, and future refreshes for these exact listings should update the batch files rather than patch rows manually.

## 2026-04-14
Decision: Add the 2026-04-14 researched public listings as a third repo-managed batch and strengthen managed-batch dedupe to match by normalized `sourceUrl`, then BizBuySell ad id, then normalized title + location.
Reason: The 2026-04-14 workbook snapshot could lag live production, and BizBuySell listing variants can shift slugs or titles while still representing the same ad, so source-url-only matching was too brittle for safe follow-up imports.
Consequences: `scripts/backfill-acquisition-thesis.ts` now owns three managed public listing batches, reconciliation expects the five new listings to exist after repair, and future public-listing refreshes are less likely to create duplicates when URLs or titles drift.

## 2026-04-15
Decision: Add the 2026-04-15 requested public listings as a fourth repo-managed batch and map live public `Sale Pending` / LOI-style listings into the existing `LETTER_OF_INTENT` tracker status.
Reason: The user-provided workbook export was the source of truth for what already existed, the four requested listings needed reproducible research-grade inserts rather than ad hoc DB edits, and the schema still lacks a generic pending enum even though the Ohio plumbing page is currently marked `Sale Pending`.
Consequences: `scripts/backfill-acquisition-thesis.ts` and production reconciliation now own four managed public listing batches, the tracker can preserve strategically relevant pending listings without inventing a new schema state, and future sessions should keep using `LETTER_OF_INTENT` plus pending-style tags until a dedicated pending status is introduced.

## 2026-04-15
Decision: Add the requested 12-listing public batch as a fifth repo-managed researched batch and require workbook-plus-live-DB dedupe before seeding any new requested public listings.
Reason: The user explicitly supplied a tracker export workbook as the dedupe source of truth, but workbook snapshots can lag the live database, so safe requested-listing adds needed both the workbook and the current DB checked before creating managed rows.
Consequences: `scripts/researched-listings-2026-04-15-requested.*` now own these 12 listings through the normal managed-batch path, future sessions should repeat the same workbook-plus-DB dedupe workflow for similar user-requested public batches, and production verification now expects the live tracker to include those rows after reconciliation.

## 2026-04-17
Decision: For requested public-listing adds, only seed listings that can be validated from the exact requested URL or from an exact-title/location live relist; skip inaccessible requested URLs instead of substituting similar alternatives.
Reason: The April 17 request included two inaccessible BizBuySell URLs plus one Clifton listing that had been relisted under a different live BizBuySell ad id, and the tracker needs reproducible live facts rather than guessed near-matches.
Consequences: The Clifton listing is stored under its current live `2445240` URL, the Wayne County and Tampa Bay requests stay unseeded until updated live links are available, and future sessions should document any URL swap explicitly in the repo docs and handoff.

## 2026-04-17
Decision: Add explicit `pipelineBucket` and `publicSourceVerified` fields instead of overloading `dealStatus` alone to hide distractions or flag weak sources.
Reason: The tracker needed a conservative, non-destructive way to separate serious active contenders from watchlist, comp-only, and unverified rows without deleting history or inventing new workflow semantics for every record.
Consequences: Default dashboard views now key off `pipelineBucket`, public-source quality is queryable and exportable, and future sessions can rebucket rows without losing audit trail or overusing `PASSED` as the only archive mechanism.

## 2026-04-17
Decision: Run a repo-managed thesis realignment pass after the managed public listing batches so category normalization, source verification, AI resistance, and conservative ranking are all reproducible.
Reason: The user asked for a broad re-ranking and cleanup across existing rows, and one-off manual DB edits would have been fragile, non-repeatable, and easy to drift from production over time.
Consequences: `scripts/thesis-realignment-2026-04-17.*` now owns the brother-local / buyer-remote rebucketing logic, production reconciliation restores that state automatically, and future scoring or bucket changes should flow through the realignment data/lib rather than ad hoc DB updates.

## 2026-04-17
Decision: Reinterpret `overall_score` as the current thesis-weighted ranking signal instead of preserving the old legacy average semantics.
Reason: The user explicitly asked for overall ranking to lean much harder on brother-operator fit, schedule control, transferability, financeability, recurring revenue, management depth, and conservative post-brother cash while penalizing weak source quality, platform dependence, and buy-a-job economics.
Consequences: `src/features/businesses/domain/business-score.ts` now derives a more opinionated thesis score, production reconciliation rewrites existing rankings accordingly, and future sessions should treat `overall_score` as the live acquisition-priority signal rather than as a stable historical average.

## 2026-04-17
Decision: Allow requested public listings to canonicalize to a live direct relist or a live direct mirror-marketplace individual page when the requested URL is stale, but only if the title, location, and economics still match exactly.
Reason: The Wayne County landscaping candidate no longer had a usable live BizBuySell page, the user-supplied BizQuest `BW2487125` URL was also stale, and the tracker still needed a conservative way to preserve the real opportunity without inventing a source URL or seeding a merely similar listing.
Consequences: Wayne is now stored under the live direct BizQuest individual page `BW2480416`, Clifton remains on the live BizBuySell relist `2445240`, Tampa uses its live BizBuySell page `2479308`, and future sessions should document dead or stale requested URLs explicitly in notes, docs, and handoff rather than silently substituting near-matches.

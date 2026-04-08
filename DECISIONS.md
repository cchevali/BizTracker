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

# SESSION_HANDOFF

## What Changed
- Built the initial business acquisition tracker as a Next.js 16 monolith with App Router, Prisma 7, PostgreSQL, and Tailwind.
- Added dashboard search/filter/sort/view state, saved filter presets, create/edit/detail pages, quick status updates, notes, and history.
- Added Prisma migration `20260406021428_init` and realistic seed data.
- Added repo memory files: `AGENTS.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TASKS.md`, `SESSION_HANDOFF.md`, and `CHANGELOG.md`.
- Added Vitest with unit tests for filter parsing, form validation, and repository mutations.
- Fixed Link-based primary buttons by removing the global anchor color override and tightening shared button styles.
- Added a filtered workbook export route and dashboard button that generates a ChatGPT-friendly `.xlsx` file with `businesses`, `notes`, `history`, and `metadata` sheets.
- Added export-focused unit coverage for workbook dataset shaping and the export URL/repository path.
- Added shared score derivation logic that correctly treats owner dependence as a negative factor.
- Added `scripts/normalize-chatgpt-listings.ts` plus tested domain helpers for cleaning external ChatGPT listing JSON into import-ready records.
- Generated a normalized sample file for the provided batch at `C:\Users\lever\Downloads\business_listings.normalized.json`.
- Added `scripts/import-business-listings.ts` for create-only batch imports keyed by `sourceUrl`.
- Imported the normalized 24-listing BizBuySell batch from `C:\Users\lever\Downloads\business_listings.normalized.json` into PostgreSQL.
- Added production base-path support via `next.config.ts` and `src/lib/site.ts`.
- Created Vercel project `microflowops-biztracker`, connected a Neon production Postgres database, applied the existing Prisma migration, and imported the 24-listing batch into production.
- Deployed BizTracker to `https://microflowops-biztracker.vercel.app/biztracker`.
- Wired the public path `https://microflowops.com/biztracker` through the existing MicroFlowOps host app rewrite in `C:\dev\OSHA_Leads\web\next.config.mjs`.
- Added `.github/workflows/vercel-deploy.yml` for GitHub Actions-based preview and production deploys to the `microflowops-biztracker` Vercel project.
- Configured GitHub repo secret `VERCEL_TOKEN` and repo variables `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` for `cchevali/BizTracker`.
- Added `DEPLOYMENT.md` to document the hosted topology, release workflow, token rotation, and fallback manual deploy steps.
- Pushed the workflow to GitHub, observed the first production run fail on `npm ci`, and updated the workflow to use `npm install` for cross-platform optional dependency compatibility.
- Verified the follow-up GitHub Actions production run succeeded end to end for commit `a655857`.
- Changed the default dashboard sort to ask price low-to-high.
- Simplified the mobile dashboard so smaller screens use global search plus score filtering, show a compact sort control, and render cards instead of the table view.

## What Is Unfinished
- No UI/integration tests yet
- No auth or multi-user support
- No source URL parsing/import automation beyond manual entry
- No direct marketplace comparison workflow yet beyond exporting tracker data
- No in-app JSON import flow yet; normalization and import currently happen via CLI scripts

## What Should Be Worked On Next
- Add integration coverage for Prisma-backed reads and a few critical user flows.
- If deployment polish matters next, add preview URL reporting back into pull requests or GitHub environments.
- If product work is preferred over deployment polish, the next highest-value feature is an in-app import flow using the new ChatGPT JSON normalizer, or source URL ingestion assistance.

## Risks Or Bugs
- Dashboard search uses simple `contains` queries, not full-text indexing.
- Saved presets are global because there is no user model.
- Local Postgres defaults to port `5433` because `5432` was already occupied on this machine.
- The workbook export currently mirrors the active tracker filters; if users need explicit “export all” vs “export current view” controls, that should be added in the UI rather than inferred.
- Imported legacy batches may still contain factual inconsistencies from the source listing text; the normalizer fixes score semantics and shape, not underlying listing truth.
- The current import script skips existing `sourceUrl` matches rather than updating them; this is intentional to protect manual edits.
- Public hosting at `microflowops.com/biztracker` depends on the external host repo rewrite in `C:\dev\OSHA_Leads\web\next.config.mjs`; if that rewrite is removed, the public path breaks even if the standalone BizTracker deployment is healthy.
- The GitHub Actions deploy path depends on repo secret `VERCEL_TOKEN`; forked PRs will not receive that secret, so preview deploys intentionally skip those cases.
- The deploy workflow uses `npm install` instead of `npm ci` because the lockfile currently trips Linux-only optional dependency checks on GitHub's Ubuntu runner.
- Mobile users below the `lg` breakpoint now get the simplified score-only filter experience by design; if broader tablet filtering is needed later, the breakpoint or layout can be revisited.

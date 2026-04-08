# SESSION_HANDOFF

## What Changed
- Added acquisition-screening v2 support across the Prisma schema, migrations, repository mapping, validation, forms, detail page, list views, sorting, filtering, and workbook export/import paths.
- Added shared scenario assumptions in `src/features/businesses/domain/business-scenario.ts` for cash to close, annual debt service, conservative SDE, and post-brother cash calculations.
- Kept legacy `overall_score` semantics intact; new thesis-fit and scenario values are additive and do not reinterpret historical scores.
- Added workbook import parsing in `src/features/businesses/domain/business-workbook-import.ts` so both original exports and v2 appended-column exports normalize successfully.
- Added migration `20260408023947_acquisition_screening_v2` for the new nullable business fields and follow-up migration `20260408050000_acquisition_screening_constraints` for rating/percent check constraints.
- Added tests covering scenario math, workbook import compatibility, expanded export headers/values, and new filter/sort behavior.
- Updated the default active pipeline so `Passed` deals are excluded unless the filter explicitly requests them.
- Added `scripts/backfill-acquisition-thesis.ts` plus `scripts/backfill-acquisition-thesis.data.ts` to make the April 7, 2026 thesis cleanup pass reproducible and idempotent.
- Marked these businesses as `Passed` during the thesis cleanup pass:
  - `Exceptional Termite Control Company Tremendous Growth Potential`
  - `Profitable Home-Based Service Business | Proven Demand & Ready to Grow`
  - `Garage Door Installation & Repair`
  - `Highly Profitable Chimney Repair and Duct Cleaning Business`
  - `Chimney Cleaning and Repair Service - by Doug Jackson`
  - `Garage Door Installation and Service, Commercial and Residential`
  - `Highly Reputable Plumbing and HVAC Installation and Service Business`
- Added these public listings if missing and backfilled them with the new thesis fields:
  - `Profitable HVAC Air Quality & Duct Cleaning Business Franchise`
  - `Money Saving Service Business - Dryer Vent Cleaning - Fairfax`
  - `Turnkey Appliance Repair Biz | Absentee Ownership Possible | SW VA`
  - `3 FedEx Linehaul Routes - Stafford, VA - Highly Profitable`
  - `Long-Established Commercial Cleaning & Contracting Company (37 Years)`
  - `Most profitable business`
  - `Flowers Bread Route, Fairfax County, Virginia`
  - `9 FedEx Ground Routes, Manassas VA`
- Backfilled all remaining active businesses with acquisition-thesis ratings, benchmark notes, freshness/downside fields, cash-to-close commentary, and an appended `Backfill analysis (2026-04-07)` notes block when missing.
- Fixed an early duplicate-seed bug in the thesis backfill data, removed the accidentally duplicated local records, and hardened the script to guard same-run duplicate source URLs and normalized titles.
- Local database state after the April 7, 2026 cleanup pass:
  - Active businesses: `30`
  - Passed businesses from the cleanup list: `7`

## What Is Unfinished
- No Prisma-backed integration test harness yet; current coverage is still unit-heavy
- No auth or multi-user support
- No source URL parsing/import automation beyond manual entry and offline scripts
- No in-app workbook or JSON import flow yet; normalization and import currently happen via CLI scripts
- No bulk archive/revive workflow in the UI even though the active pipeline now intentionally hides `Passed` deals by default
- No separate thesis score v2 yet; only the new stored fields and scenario values were added

## What Should Be Worked On Next
- Add a real-database integration smoke test that exercises workbook export/import compatibility and the thesis backfill script on a disposable dataset.
- Add bulk archive/revive actions or a clearer archived toggle in the UI now that the default pipeline hides `Passed` deals.
- If product work is preferred over internal tooling, the next highest-value feature is an in-app import flow for workbook/JSON inputs or source URL ingestion assistance.

## Risks Or Bugs
- Dashboard search uses simple `contains` queries, not full-text indexing.
- Saved presets are global because there is no user model.
- Local Postgres defaults to port `5433` because `5432` was already occupied on this machine.
- The workbook export mirrors the active tracker filters and the default active-pipeline behavior; exporting archived deals now requires explicit filter state rather than relying on the default view.
- Imported legacy batches may still contain factual inconsistencies from the source listing text; the normalizer fixes score semantics and shape, not underlying listing truth.
- The current JSON import script skips existing `sourceUrl` matches rather than updating them; this is intentional to protect manual edits.
- Workbook import parsing tolerates old and new schemas, but there is still no in-app upload flow wired to it yet.
- Thesis backfill judgments are manual and intentionally skeptical; rerunning `npm run backfill:thesis` is safe, but changing the manual dataset file will change future outcomes by design.
- Public hosting at `microflowops.com/biztracker` depends on the external host repo rewrite in `C:\dev\OSHA_Leads\web\next.config.mjs`; if that rewrite is removed, the public path breaks even if the standalone BizTracker deployment is healthy.
- The GitHub Actions deploy path depends on repo secret `VERCEL_TOKEN`; forked PRs will not receive that secret, so preview deploys intentionally skip those cases.
- The deploy workflow uses `npm install` instead of `npm ci` because the lockfile currently trips Linux-only optional dependency checks on GitHub's Ubuntu runner.
- Mobile users below the `lg` breakpoint now get the simplified score-only filter experience by design; if broader tablet filtering is needed later, the breakpoint or layout can be revisited.

## Verification
- Passed locally on April 7, 2026:
  - `npm run db:migrate`
  - `npm run backfill:thesis`
  - `npm run typecheck`
  - `npm test`
  - `npm run lint`
  - `npm run build`

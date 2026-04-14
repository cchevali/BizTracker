# SESSION_HANDOFF

## What Changed
- Added a shared managed-listing dedupe helper in `scripts/managed-listing-batch.lib.ts`.
- Updated the repo-managed public listing upsert flow so managed batches now match in this order before creating anything:
  - normalized `sourceUrl`
  - BizBuySell ad id
  - normalized `businessName + location`
- Added the new managed researched batch in:
  - `scripts/researched-listings-2026-04-14.data.ts`
  - `scripts/researched-listings-2026-04-14.lib.ts`
- Added five researched listings with full first-pass underwriting, skeptical notes, benchmark comparisons, and follow-up diligence questions:
  - `19 FedEx Ground Routes, Colorado Springs, CO`
  - `20 FedEx Ground Routes, Colorado Springs, CO`
  - `Commercial Real Estate Service`
  - `Company w/ High Gross Profits - Property Damage & Restoration`
  - `Grand Rapids, MI - Automotive Paint & Dent Repair Multi-Unit Franchise`
- Wired the new batch into:
  - `scripts/backfill-acquisition-thesis.lib.ts`
  - `scripts/verify-biztracker-reconciliation.ts`
- Added tests in:
  - `tests/managed-listing-batch.lib.test.ts`
  - `tests/researched-listings-2026-04-14-batch.test.ts`
  - updated `tests/researched-listings-batch.test.ts` to enforce cross-batch uniqueness by source URL, business name, and BizBuySell ad id
- Updated `CONTEXT.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TASKS.md`, and `CHANGELOG.md` to reflect the new batch, the stronger dedupe order, and the live production state.

## Dedupe Baseline Used
- Used the user-provided workbook snapshot:
  - `C:\Users\lever\Downloads\biztracker-export-2026-04-14T14-24-32Z.xlsx`
- Also verified live production before insert via:
  - `npm run verify:production-data`
  - direct production DB queries against the pulled Vercel production env
  - the live workbook export route at `https://microflowops.com/biztracker/exports/businesses`
- Confirmed all five target listings were missing from:
  - the workbook snapshot
  - the live active export
  - the full production database
- Confirmed the user-marked skip URLs were already present and therefore not re-added:
  - `https://www.bizbuysell.com/business-opportunity/sewer-water-line-repair-co-1-4m-rev-607k-net-sp-only-1-6m-growing/2456675/`
  - `https://www.bizbuysell.com/business-opportunity/23-fedex-ground-routes-buffalo-ny-seller-and-vehicle-financing/2452419/`
  - `https://www.bizbuysell.com/business-opportunity/pittsburgh-pa-multi-unit-auto-paint-business/2238298/`

## Verification
- Passed locally:
  - `npm run typecheck`
  - `npm test -- managed-listing-batch.lib researched-listings-2026-04-14-batch researched-listings-batch`
  - `npm test`
  - `npm run lint`
- Passed against production:
  - `npm run reconcile:production`
  - `npm run verify:production-data`
- Live export verification after reconcile:
  - downloaded `https://microflowops.com/biztracker/exports/businesses`
  - confirmed `53` active business rows
  - confirmed each newly added source URL appears exactly once in the live export
- Public search/filter verification:
  - `https://microflowops.com/biztracker?q=Colorado%20Springs&sellerFinancingAvailable=true&sort=sde`
    - server-rendered page contains both new Colorado Springs FedEx listings
  - `https://microflowops.com/biztracker?q=Commercial%20Real%20Estate%20Service`
    - server-rendered page contains the Midvale listing
  - filtered export `https://microflowops.com/biztracker/exports/businesses?q=Colorado%20Springs&sellerFinancingAvailable=true&sort=sde`
    - returns exactly the two new Colorado Springs FedEx listings in descending SDE order
  - filtered export `https://microflowops.com/biztracker/exports/businesses?q=Grand%20Rapids&minDataConfidenceScore=3&sort=data-confidence`
    - returns only `Grand Rapids, MI - Automotive Paint & Dent Repair Multi-Unit Franchise`
    - correctly excludes the restoration anomaly listing because its `data_confidence_score` is `1`

## Production Outcome
- `npm run reconcile:production` created exactly 5 new records and updated 0 of the new 2026-04-14 records.
- Production now verifies at:
  - `60 total / 53 active / 7 passed`
- New source URLs now live in production:
  - `https://www.bizbuysell.com/business-opportunity/19-fedex-ground-routes-colorado-springs-co/2415787/`
  - `https://www.bizbuysell.com/business-opportunity/20-fedex-ground-routes-colorado-springs-co/2458359/`
  - `https://www.bizbuysell.com/business-opportunity/commercial-real-estate-service/2206744/`
  - `https://www.bizbuysell.com/business-opportunity/company-w-high-gross-profits-property-damage-and-restoration/2306305/`
  - `https://www.bizbuysell.com/business-opportunity/grand-rapids-mi-automotive-paint-and-dent-repair-multi-unit-franchise/2238488/`
- Ran `npm run deploy:production:manual` successfully after push:
  - deployment URL: `https://microflowops-biztracker-4069hs9zv-chases-projects-6e9e1ba6.vercel.app`
  - smoke checks passed for:
    - `https://microflowops-biztracker.vercel.app/biztracker`
    - `https://microflowops.com/biztracker`
    - `https://microflowops.com/biztracker/exports/businesses`

## Git / Push State
- Committed and pushed to `origin/main`:
  - commit: `d7ed24ca3c494f64899dfcd0207dd84f0e2dd0fa`
  - message: `Add 2026-04-14 researched listing batch`
- The repo worktree was clean immediately after that push.
- This session did not attempt to repair the separate GitHub Actions `VERCEL_TOKEN` secret drift, so the GitHub-hosted production workflow may still fail even though local manual production deploys are healthy.

## What Should Be Worked On Next
- Rotate the GitHub repo `VERCEL_TOKEN` and rerun the production workflow; that unrelated GitHub-hosted deploy auth issue was not addressed in this session.
- Consider adding a disposable-database integration test that exercises the full reconciliation runner, not just the batch/unit test paths.

## Risks Or Bugs
- The restoration listing intentionally preserves the raw public ask of `140000`; it is flagged as anomalous in `benchmarkNotes`, `cashToCloseNotes`, `dataConfidenceScore`, and `staleListingRisk`, but a broker-backed correction workflow still does not exist in-app.
- Managed-batch dedupe is now materially safer, but the older thesis-only `newListingSeeds` path in `backfill-acquisition-thesis.data.ts` still uses its own simpler matching logic.
- GitHub Actions production deploy auth is still expected to fail until the repo `VERCEL_TOKEN` is rotated.

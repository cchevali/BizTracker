# SESSION_HANDOFF

## What Changed
- Added a fifth repo-managed public listing batch:
  - `scripts/researched-listings-2026-04-15-requested.data.ts`
  - `scripts/researched-listings-2026-04-15-requested.lib.ts`
- Wired that batch into:
  - `scripts/backfill-acquisition-thesis.lib.ts`
  - `scripts/verify-biztracker-reconciliation.ts`
  - `tests/researched-listings-batch.test.ts`
  - `tests/researched-listings-2026-04-15-requested-batch.test.ts`
- Used the user-provided workbook export plus the live production DB as the dedupe baseline before creating any rows:
  - workbook: `C:\Users\lever\Downloads\biztracker-export-2026-04-15T17-55-12Z.xlsx`
  - live DB checked through the existing production env at `.vercel/.env.production.local`
- Reconciled production through the existing managed-batch path with `npx tsx scripts/reconcile-production-data.ts`.
- Live production now verifies at:
  - `76 total / 69 active / 7 passed`

## Production Outcome
- All 12 requested listings were created in production with managed facts, ratings, notes, tags, and history:
  - `Established Commercial HVAC and Refrigeration Service Company`
  - `Premier NJ Residential Pool Service Co. - 37 yrs - Recurring Contracts`
  - `$2.0 Million Plumbing Contractor, $350K Net; SBA Pre-Approved! (17923)`
  - `Profitable Plumbing & HVAC Business – Hampton Roads`
  - `Highly Profitable, Established HVAC Service Provider with Real Estate`
  - `Established/Commercial Landscaping /Hardscaping Business - Central OH`
  - `Great South Charlotte pool company with high end clientele`
  - `Established Air Duct Cleaning & Indoor Air Quality Business`
  - `Commercial HVAC Filter Change-Out & Maintenance`
  - `Lucrative, Pool Service Business with 4.9 Stars!`
  - `Established Organic Lawn Care & Pest Control – Recurring Revenue`
  - `Well Established HVAC Company Serving Southern Maryland`
- No requested listing was skipped as a duplicate.
- The three workbook-protected existing businesses were confirmed present and left untouched:
  - `Growing Central Ohio Plumbing Business for Sale`
  - `High Income Recession-Proof HVAC Services Business`
  - `Profitable Residential Pest Control Company`
- Reconciliation also refreshed one pre-existing managed listing:
  - `Sewer/Water Line Repair Co, 1.4M Rev, 607K, Net, SP Only 1.6M, Growing`

## Verification
- Local code checks passed:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `npx vitest run tests/researched-listings-batch.test.ts tests/researched-listings-2026-04-15-requested-batch.test.ts tests/researched-listings-2026-04-15-batch.test.ts`
- Production reconciliation passed with no missing required businesses and full thesis-field coverage on all active records.
- Manual production deploy fallback passed with `npm run deploy:production:manual`.
- Manual deploy completed at:
  - `https://microflowops-biztracker-39hiekmog-chases-projects-6e9e1ba6.vercel.app`
- Manual deploy smoke checks passed for:
  - `https://microflowops-biztracker.vercel.app/biztracker`
  - `https://microflowops.com/biztracker`
  - `https://microflowops.com/biztracker/exports/businesses`
- Live UI smoke checks passed:
  - search for `Premier NJ Residential Pool Service` returned the new NJ pool listing
  - `status=NEW` plus search for `Commercial HVAC Filter Change-Out & Maintenance` returned the new Kansas listing
  - `status=LETTER_OF_INTENT` plus search for `Established/Commercial Landscaping /Hardscaping Business` returned the pending Central Ohio landscaping listing
- Live export smoke check passed:
  - `https://microflowops.com/biztracker/exports/businesses`
  - each of the 12 new `source_url` values appears exactly once in the exported workbook

## Notable Public Data Inconsistencies
- `Established Commercial HVAC and Refrigeration Service Company`: detailed page says `2` full-time employees while other copy implies `3` including the owner.
- `Highly Profitable, Established HVAC Service Provider with Real Estate`: employee count is `17` in the detail field but the description claims a `22-person` team.
- `Great South Charlotte pool company with high end clientele`: page shows EBITDA above SDE and still displays a lease expiration of `01/01/2023`.
- `Lucrative, Pool Service Business with 4.9 Stars!`: header says established `2021`, description says launched in `2022`.
- `Established Organic Lawn Care & Pest Control – Recurring Revenue`: header ask is `314000`, while description still references `350000` and a seller-carry structure.

## What To Work On Next
- Standing repo-level next task is still rotating the GitHub repo `VERCEL_TOKEN`.
- `npm run check:vercel-access` still fails locally because `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are not present in the local shell environment even though the repo-local manual production deploy path works from the saved Vercel project context.
- If another requested public batch comes in, repeat the same workflow:
  - read the workbook export first
  - dedupe against workbook and live DB
  - add a new managed batch file/lib pair
  - reconcile production through the existing script
- Consider adding a dedicated pending status if public `Sale Pending` / `Under Contract` listings keep accumulating beyond the current `LETTER_OF_INTENT` mapping.

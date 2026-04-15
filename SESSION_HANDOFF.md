# SESSION_HANDOFF

## What Changed
- Added the new managed researched batch in:
  - `scripts/researched-listings-2026-04-15.data.ts`
  - `scripts/researched-listings-2026-04-15.lib.ts`
- Added four researched listings with conservative underwriting, short fit/risk notes, and follow-up diligence questions:
  - `Growing Central Ohio Plumbing Business for Sale`
  - `Residential HVAC Company - Southeast Michigan`
  - `High-end Residential Remodeling and contracting service`
  - `Longstanding Commercial HVAC Business - SBA Pre-Qualified`
- Wired the new batch into:
  - `scripts/backfill-acquisition-thesis.lib.ts`
  - `scripts/verify-biztracker-reconciliation.ts`
- Added tests in:
  - `tests/researched-listings-2026-04-15-batch.test.ts`
  - updated `tests/researched-listings-batch.test.ts` for cross-batch uniqueness
- Tightened `findManagedBusinessForSeed` in `scripts/managed-listing-batch.lib.ts` so the shared dedupe helper accepts slimmer business fixtures cleanly in tests and still returns the matched row type.
- Updated `CONTEXT.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TASKS.md`, and `CHANGELOG.md` to reflect the new batch, the pending-status mapping, and the live production state.

## Dedupe Baseline Used
- Used the user-provided workbook snapshot:
  - `C:\Users\lever\Downloads\biztracker-export-2026-04-14T17-13-22Z.xlsx`
- Parsed the `businesses` sheet and confirmed all four requested source URLs were missing by:
  - normalized `source_url`
  - normalized `business_name + location`
- Also confirmed the workbook had `53` active exported rows before insert, which matched the prior live 2026-04-14 state.
- No duplicate requested rows were skipped in this session because all four targets were missing from the workbook baseline.

## Live Listing Notes
- The Ohio plumbing page currently shows `Sale Pending`, so the tracker stores it as:
  - `dealStatus = LETTER_OF_INTENT`
  - tag `pending`
- The Southeast Michigan HVAC page explicitly requires a qualifying Michigan mechanical license or licensed employee, so it was scored conservatively on transferability and quit-the-job fit.
- The Fairfax remodeling page conflicts on SDE (`881,782` on the summary vs `1,013,212` in the description for 2024), so it was kept low-confidence.
- The Charlotte commercial HVAC page still withholds revenue/SDE/EBITDA and shows the owner involved full time, so it remains a lower-confidence watchlist record.

## Verification
- Passed locally:
  - `npm run typecheck`
  - `npm test -- managed-listing-batch.lib researched-listings-2026-04-15-batch researched-listings-batch`
- Passed against production:
  - `npm run reconcile:production`
  - `npm run verify:production-data`
- Live export verification after reconcile:
  - downloaded `https://microflowops.com/biztracker/exports/businesses`
  - confirmed `57` active business rows
  - confirmed each newly added source URL appears exactly once in the live export

## Production Outcome
- `npm run reconcile:production` created exactly 4 new records and updated 0 of the new 2026-04-15 records.
- Production now verifies at:
  - `64 total / 57 active / 7 passed`
- New source URLs now live in production:
  - `https://www.bizbuysell.com/business-opportunity/growing-central-ohio-plumbing-business-for-sale/2464974/`
  - `https://www.bizbuysell.com/business-opportunity/residential-hvac-company-southeast-michigan/2455495/`
  - `https://www.bizbuysell.com/business-opportunity/high-end-residential-remodeling-and-contracting-service/2458857/`
  - `https://www.bizbuysell.com/business-opportunity/longstanding-commercial-hvac-business-sba-pre-qualified/2388349/`
- Ran `npm run deploy:production:manual` successfully after the reconcile:
  - deployment URL: `https://microflowops-biztracker-jgo4lfgqv-chases-projects-6e9e1ba6.vercel.app`
  - smoke checks passed for:
    - `https://microflowops-biztracker.vercel.app/biztracker`
    - `https://microflowops.com/biztracker`
    - `https://microflowops.com/biztracker/exports/businesses`

## Git / Push State
- Production data has been reconciled and deployed successfully from this workspace.
- Committed and pushed to `origin/main`:
  - commit: `c0e4e07b50b4db13ec86bb53a4581517b607cb2c`
  - message: `Add 2026-04-15 researched listing batch`
- The repo worktree was clean immediately before this handoff-only follow-up update.

## What Should Be Worked On Next
- Rotate the GitHub repo `VERCEL_TOKEN` and rerun the GitHub-hosted production workflow; that unrelated deploy auth issue is still not fixed.
- Consider adding a dedicated public pending/deal-stage status instead of continuing to map sale-pending listings into `LETTER_OF_INTENT`.
- Add a disposable-database integration test that exercises the full reconciliation runner, not just the batch/unit test paths.

## Risks Or Bugs
- The tracker still has no dedicated generic pending enum, so public `Sale Pending` listings are currently represented through `LETTER_OF_INTENT` plus tags.
- Managed-batch dedupe is strong for repo-managed listing batches, but the older thesis-only `newListingSeeds` path in `backfill-acquisition-thesis.data.ts` still uses simpler matching logic.
- GitHub Actions production deploy auth is still expected to fail until the repo `VERCEL_TOKEN` is rotated.

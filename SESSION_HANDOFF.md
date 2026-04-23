# SESSION_HANDOFF

## What Changed
- Added a new repo-managed requested batch for five retained landscaping comparison records:
  - `scripts/researched-listings-2026-04-23-requested.data.ts`
  - `scripts/researched-listings-2026-04-23-requested.lib.ts`
- Wired that batch into the normal backfill and verification path:
  - `scripts/backfill-acquisition-thesis.lib.ts`
  - `scripts/verify-biztracker-reconciliation.ts`
- Added thesis-realignment overrides so all five rows stay verified `COMP_ONLY` records instead of entering the default active contender view:
  - `scripts/thesis-realignment-2026-04-17.data.ts`
- Added focused regression coverage:
  - `tests/researched-listings-2026-04-23-requested-batch.test.ts`
  - `tests/researched-listings-batch.test.ts`
- Updated the repo truth files:
  - `CHANGELOG.md`
  - `CONTEXT.md`
  - `ARCHITECTURE.md`
  - `DECISIONS.md`
  - `TASKS.md`
  - `SESSION_HANDOFF.md`

## Production Outcome
- Reconciled production with `npx tsx scripts/reconcile-production-data.ts`.
- Live production now verifies at:
  - `84 total`
  - `33 active`
  - `14 watchlist`
  - `31 comp-only`
  - `6 unverified`
  - `29 passed`
- New production rows created exactly once:
  - `Established Landscape company with 40 years in business and solid Hist` -> `NEW`, `COMP_ONLY`, verified, score `84`
  - `High-Margin Landscaping Co. with Route Density in Growth Corridor` -> `LETTER_OF_INTENT`, `COMP_ONLY`, verified, score `85`
  - `Established Commercial Landscaping — KC Metro — Recurring Contracts` -> `NEW`, `COMP_ONLY`, verified, score `83`
  - `39-Year Landscaping Business – Loyal Clients & High Profits` -> `NEW`, `COMP_ONLY`, verified, score `77`
  - `Highly Profitable Full-Service Landscaping & Snow Removal Company` -> `NEW`, `COMP_ONLY`, verified, score `82`
- Existing key landscaping rows stayed unchanged in their core identity:
  - Wayne remains on `BW2480416`, `ACTIVE`, score `89`
  - Clifton remains on BizBuySell `2445240`, `ACTIVE`, score `88`
  - Tampa remains on BizBuySell `2479308`, `ACTIVE`, score `79`
  - Gwinnett remains on BizBuySell `2486510`, `ACTIVE`, score `81`

## Canonical Source Notes
- New 2026-04-23 comp URLs now stored in production:
  - `https://www.bizbuysell.com/business-opportunity/established-landscape-company-with-40-years-in-business-and-solid-hist/2460333/`
  - `https://www.bizquest.com/business-for-sale/high-margin-landscaping-co-with-route-density-in-growth-corridor/BW2475102/`
  - `https://www.bizbuysell.com/business-opportunity/established-commercial-landscaping-kc-metro-recurring-contracts/2494710/`
  - `https://www.bizbuysell.com/business-opportunity/39-year-landscaping-business-loyal-clients-and-high-profits/2485754/`
  - `https://www.bizbuysell.com/business-opportunity/highly-profitable-full-service-landscaping-and-snow-removal-company/2484806/`
- Dedupe baseline before insert was the live production DB. No existing row matched any of the five requested source URLs or normalized title-plus-location pairs.

## Verification
- Local checks passed:
  - `npx vitest run tests/researched-listings-2026-04-23-requested-batch.test.ts tests/researched-listings-batch.test.ts tests/researched-listings-2026-04-17-requested-batch.test.ts tests/researched-listings-2026-04-15-requested-batch.test.ts tests/thesis-realignment-2026-04-17-data.test.ts`
  - `npm run typecheck`
  - `npm run lint`
- Production reconciliation passed:
  - `npx tsx scripts/reconcile-production-data.ts`
- Live app checks passed:
  - `https://microflowops.com/biztracker?pipeline=comp-only&state=MA`
  - `https://microflowops.com/biztracker?pipeline=comp-only&state=TX`
  - `https://microflowops.com/biztracker?pipeline=comp-only&state=MO`
  - `https://microflowops.com/biztracker?pipeline=comp-only&state=AZ`
  - `https://microflowops.com/biztracker?pipeline=comp-only&state=NY`
  - `https://microflowops.com/biztracker?pipeline=comp-only&q=landscaping`
  - `https://microflowops.com/biztracker?pipeline=comp-only&q=landscaping&view=cards`
- Verification still confirms:
  - no missing required businesses
  - no non-lowercase categories
  - no unverified rows remain in the `ACTIVE` bucket
  - thesis fields are populated across `ACTIVE` + `WATCHLIST`

## Field-Level Assumptions
- `COMP_ONLY` exists in the schema, so all five new rows use the real pipeline bucket instead of a tag-only fallback.
- The Texas BizQuest listing is stored as `LETTER_OF_INTENT` rather than `NEW` because the live page is explicitly marked `Sale Pending`; that matches the app's existing pending-listing convention while still keeping the row in `COMP_ONLY`.
- `homeBasedFlag` is `true` for the Scottsdale listing because the live page says it operates from a home-based office.
- `sellerFinancingAvailable` is `true` for the Texas and Kansas City rows because their live public pages explicitly mention seller financing.
- Advanced derived cash fields were not manually stored; the tracker continues deriving scenario outputs from asking price and SDE.

## What To Work On Next
- Standing repo-level next task is still rotating the GitHub repo `VERCEL_TOKEN`.
- Decide whether to add an explicit canonical-source or relist-alias field now that live marketplace relists and alternate-marketplace canonical URLs keep showing up in landscaping comps.
- If the default active view still feels too noisy, do a second-pass review of the remaining mid-tier `ACTIVE` rows and move more of them into `WATCHLIST` conservatively rather than deleting them.
- If pipeline maintenance is becoming more frequent, add an in-app bulk rebucket/archive workflow so these changes do not always require the CLI reconciliation path.

# SESSION_HANDOFF

## What Changed
- Updated exactly one production business record:
  - `cmnv3ombh0009hsv0vf1l59ni`
  - public URL: `https://microflowops.com/biztracker/businesses/cmnv3ombh0009hsv0vf1l59ni`
- Replaced the old listing-level profile with a diligence-informed profile based on the uploaded Joe Frei data-room materials.
- Preserved existing history and added two new durable history events:
  - `UPDATED`: `Updated diligence-informed profile fields from Joe Frei data-room review.`
  - `STATUS_CHANGED`: `RESEARCHING` -> `UNDER_REVIEW`
- Did not touch any other business record.

## Data Sources Used
- `C:\Users\lever\Downloads\Joe-Frei-Excavating-Adjusted-Earnings-as-of-12-31-2025.xlsx`
- `C:\Users\lever\Downloads\Joe-Frei-Misc-Questions-and-Answers-1-20-2026.docx`
- The uploaded PDF packet was also used as the factual basis for the rewritten memo, especially the tax-return and balance-sheet references captured in the user request.

## Key Record Outcome
- Status is now `UNDER_REVIEW`.
- Revenue is now `1420669`.
- SDE is now `584073` based on the adjusted-earnings support.
- EBITDA was cleared to `null` so the stale copied listing EBITDA is no longer carried.
- Summary, fit, risks, benchmark notes, financing notes, operational ratings, tags, and durable notes were all rewritten to reflect the diligence packet rather than the old listing blurb.
- Durable notes now mention the third-party LOI through `2026-04-17`, the 2023/2024 tax-return support, the 2025 internal-book step-up, the working-capital snapshot, the FF&E reconciliation problem, the Joe/Dayna handoff load, the referral / municipal revenue mix, the no-maintenance-contract profile, and the quality-of-earnings cautions around cash receipts and rent normalization.

## Verification
- Queried the production database directly and confirmed the updated record values.
- Confirmed the latest public detail page renders:
  - `Under review`
  - the new summary text
  - the new diligence memo LOI phrase

## Repo State
- No lasting code or schema changes were kept from this session.
- The only repo file changed locally is this refreshed handoff note.

## What Should Be Worked On Next
- If this business becomes actionable after the third-party LOI window, the next step should be a tighter QoE pass on cash receipts, rent normalization, and true owner / spouse replacement cost rather than more listing-level research.
- Separately, the standing repo-level next task is still rotating the GitHub `VERCEL_TOKEN`.

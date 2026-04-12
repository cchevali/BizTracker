# SESSION_HANDOFF

## What Changed
- Hardened `.github/workflows/vercel-deploy.yml` so preview and production deploys now:
  - run `scripts/check-vercel-access.ts` before the first Vercel CLI call
  - retry `vercel pull` up to three times with a clear token/project remediation message
  - deploy directly with `vercel deploy --format=json` instead of relying on a separate `vercel build` + `--prebuilt` path
- Added `scripts/check-vercel-access.ts` to verify `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` and to fail with an explicit rotation message when auth drifts.
- Added `scripts/manual-production-deploy.ts` as the repo-native fallback for production deploys. It:
  - pulls the production env
  - confirms the linked Vercel project and production DB target
  - runs `prisma migrate deploy`
  - verifies reconciliation state before deploy
  - deploys directly to production
  - smoke-checks the returned deployment URL, the standalone alias, the public `/biztracker` path, and the workbook export
- Added `scripts/vercel-deploy.lib.ts` for the shared Vercel CLI helpers and `tests/vercel-deploy-lib.test.ts` for JSON/url parsing coverage.
- Updated `AGENTS.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TASKS.md`, `CHANGELOG.md`, and `DEPLOYMENT.md` to reflect the new deploy hardening and fallback workflow.
- Added package scripts:
  - `npm run check:vercel-access`
  - `npm run deploy:production:manual`
- Updated `reconcile:production` and `verify:production-data` to use `vercel pull --non-interactive`.

## Current State
- Production data was already live from the prior session at `50 total / 43 active / 7 passed`, and the public app/export were previously smoke-checked successfully.
- This session focused on cleanup and recurrence prevention for the deployment issues, not on changing business data.
- The repo now has one documented manual production deploy path that matches the working in-session fallback and avoids the failed local Windows `vercel build --prod` path.

## What Is Unfinished
- The hardened deploy workflow has only been validated locally with repo checks in this session; it has not yet been pushed to GitHub or exercised in GitHub Actions.
- The repo still cannot rotate `VERCEL_TOKEN` automatically. If GitHub Actions auth fails again, someone must create a fresh classic Vercel personal token in the Vercel account UI and update the GitHub secret.
- There is still no real-database integration smoke test for workbook export/import plus thesis backfill together.

## What Should Be Worked On Next
- Push this deploy-hardening patch and watch the next GitHub Actions `Vercel Deploy` run to confirm the new auth check, pull retry, and direct deploy path behave correctly.
- If that run still fails at Vercel auth, rotate `VERCEL_TOKEN` in `cchevali/BizTracker` with a fresh classic Vercel personal token from `https://vercel.com/account/tokens`.
- Add a disposable-database integration smoke test for workbook export/import plus the thesis/high-value backfill path.

## Risks Or Bugs
- `scripts/manual-production-deploy.ts` intentionally hits real production URLs for smoke checks. Use `--skip-smoke-checks` only if you already have separate live verification coverage.
- The manual deploy fallback assumes the local `.vercel` link still targets `microflowops-biztracker`; the script checks this and will fail loudly if the local link drifts.
- GitHub Actions still depends on external repo secrets/variables. The new auth check makes drift obvious, but it cannot repair the secret automatically.

## Verification
- Passed:
  - `npm test`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Not run in this session:
  - `npm run deploy:production:manual` (would perform a real production deploy)
  - GitHub Actions `Vercel Deploy` after the workflow edits

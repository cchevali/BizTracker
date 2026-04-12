# DEPLOYMENT

## Current Production Topology
- Standalone app project: `microflowops-biztracker` on Vercel
- Public URL: `https://microflowops.com/biztracker`
- Standalone Vercel URL: `https://microflowops-biztracker.vercel.app/biztracker`
- Production database: Neon Postgres managed through Vercel environment variables
- Public routing dependency: `C:\dev\OSHA_Leads\web\next.config.mjs` rewrites `/biztracker/*` to the standalone BizTracker deployment

## Git-Based Auto-Deploys
- Workflow file: `.github/workflows/vercel-deploy.yml`
- Production deploys run automatically on pushes to `main`
- Preview deploys run automatically for non-draft pull requests opened from branches in this repository
- Manual fallback runs are available through `workflow_dispatch`

## GitHub Repository Configuration
Configured in `cchevali/BizTracker`:
- Secret: `VERCEL_TOKEN`
- Variable: `VERCEL_ORG_ID`
- Variable: `VERCEL_PROJECT_ID`

These values let GitHub Actions deploy without relying on a local `.vercel` link.

## Workflow Behavior
Each deploy job:
1. Checks out the repo and installs dependencies with `npm install`
2. Runs `npm test`, `npm run lint`, and `npm run typecheck`
3. Validates `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` with `scripts/check-vercel-access.ts`
4. Pulls Vercel environment settings for the target environment with retry handling
5. Runs `npx prisma migrate deploy` with retry handling for transient Prisma advisory-lock contention
6. Verifies the expected production reconciliation state with `scripts/verify-biztracker-reconciliation.ts`
7. Deploys directly with `npx vercel deploy --format=json`

The workflow sets:
- `NEXT_PUBLIC_BASE_PATH=/biztracker`
- `NEXT_PUBLIC_SITE_URL=https://microflowops.com`

That keeps preview and production builds aligned with the app's base-path-aware config in `next.config.ts` and `src/lib/site.ts`.

## Important Notes
- The standalone deployment URL is the direct artifact target for GitHub Actions, but the human-facing production URL remains `https://microflowops.com/biztracker`.
- Changes to BizTracker code deploy automatically after merge to `main`.
- Changes to the public `/biztracker` rewrite still live in the external MicroFlowOps host repo and must be deployed from `C:\dev\OSHA_Leads\web`.
- Preview deploy secrets do not run for forked pull requests because GitHub does not expose repository secrets to untrusted forks.
- The workflow intentionally uses `npm install` instead of `npm ci` because the current lockfile is generated on Windows and GitHub's Ubuntu runner needs Linux-specific optional native packages that `npm ci` rejected.
- The workflow now retries Prisma migrations up to three times because Neon/Prisma advisory-lock acquisition can time out transiently even when the database is otherwise healthy.
- The workflow now retries `vercel pull` up to three times because auth/project lookup failures are otherwise hard to distinguish from transient CLI/network issues.
- The workflow verifies production data state, but it does not run the domain-specific reconciliation automatically; if production data is missing the baseline curated records or thesis cleanup pass, use `npm run reconcile:production`.
- GitHub Actions still needs a classic Vercel personal token in `VERCEL_TOKEN`; the repo can now validate that requirement early, but it cannot rotate the token automatically.

## Rotating Credentials
If `VERCEL_TOKEN` ever needs rotation:
1. Create or obtain a classic Vercel personal token with access to `microflowops-biztracker` from `https://vercel.com/account/tokens`
2. Update the GitHub secret:
   `gh secret set VERCEL_TOKEN --repo cchevali/BizTracker`
3. Keep `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` aligned with the current Vercel project
4. Re-run `npm run check:vercel-access` locally with those env vars or push a no-op branch to confirm GitHub Actions can authenticate cleanly

## Manual Fallback
If GitHub Actions is unavailable or the token needs rotation later, the repo-native manual production fallback is:
1. `npm run deploy:production:manual`

That command:
- pulls the production env locally
- confirms the linked Vercel project and production database target
- runs `npx prisma migrate deploy`
- verifies the expected production reconciliation state before deploying
- deploys directly with `vercel --prod --yes`
- smoke-checks the standalone alias, public `/biztracker` path, and workbook export

Use `npm run deploy:production:manual -- --skip-smoke-checks` only if you already have separate smoke coverage and need the fastest possible fallback.

Avoid using a local `vercel build --prod` + `vercel deploy --prebuilt` fallback on this Windows workstation; that path failed in-session with `Unable to find lambda for route: /businesses/new`, while the direct deploy path succeeded.
Also avoid treating the raw per-deployment Vercel URL as a required smoke target; this project can return `401` there even when the production alias and public app are healthy.

## Production Data Reconciliation
When the live schema/UI is deployed but the Neon production data is missing the expected BizTracker records or thesis cleanup pass:
1. `npm run verify:production-data`
2. `npm run reconcile:production`
3. `npm run verify:production-data`

`npm run reconcile:production` is idempotent. It:
- Confirms the local `.vercel` link targets `microflowops-biztracker`
- Uses `.vercel/.env.production.local` rather than local `.env`
- Runs `prisma migrate deploy`
- Restores the missing curated baseline businesses if production was never seeded
- Runs the thesis archive/add/backfill pass
- Verifies the expected production counts, benchmark presence, archive status, and thesis-field coverage

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
3. Pulls Vercel environment settings for the target environment
4. Runs `npx prisma migrate deploy`
5. Builds with `npx vercel build`
6. Deploys with `npx vercel deploy --prebuilt`

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

## Rotating Credentials
If `VERCEL_TOKEN` ever needs rotation:
1. Create or obtain a Vercel personal token with access to `microflowops-biztracker`
2. Update the GitHub secret:
   `gh secret set VERCEL_TOKEN --repo cchevali/BizTracker`
3. Keep `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` aligned with the current Vercel project

## Manual Fallback
If GitHub Actions is unavailable, the manual production fallback remains:
1. `npx vercel pull --yes --environment=production`
2. `npx prisma migrate deploy`
3. `npx vercel --prod --yes`

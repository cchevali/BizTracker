# Business Acquisition Tracker

Local-first, production-ready tracker for evaluating small businesses you may want to acquire. The app supports manual business entry, Codex chat links as source URLs, dashboard filtering and sorting, saved filter presets, editable detail pages, and durable notes/history.

Production URL: `https://microflowops.com/biztracker`

## Stack
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma 7
- PostgreSQL
- Vercel + Neon for production hosting

## Before You Change Anything
Read these files first:
1. `AGENTS.md`
2. `CONTEXT.md`
3. `ARCHITECTURE.md`
4. `DECISIONS.md`
5. `TASKS.md`
6. `SESSION_HANDOFF.md`

They are part of the product workflow, not optional documentation.

## Local Setup

### Prerequisites
- Node.js 24+
- Docker Desktop or another Docker engine

### Install
```bash
npm install
```

Create `.env` by copying `.env.example`.

```powershell
Copy-Item .env.example .env
```

### Start PostgreSQL
```bash
npm run db:start
```

The local Postgres container is exposed on port `5433` by default to avoid conflicts with machines already using `5432`.

### Apply the schema and seed data
```bash
npm run db:migrate -- --name init
npm run db:seed
```

### Start the app
```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Deployment
- Public app URL: `https://microflowops.com/biztracker`
- Standalone deployment URL: `https://microflowops-biztracker.vercel.app/biztracker`
- Production uses `NEXT_PUBLIC_BASE_PATH=/biztracker` and `NEXT_PUBLIC_SITE_URL=https://microflowops.com`
- Public path routing is handled by the existing MicroFlowOps host app rewrite in `C:\dev\OSHA_Leads\web\next.config.mjs`
- Production database is Neon Postgres managed through Vercel environment variables
- Git-based auto-deploys live in `.github/workflows/vercel-deploy.yml`
- Deployment workflow details and credential-rotation notes live in `DEPLOYMENT.md`

## Core Scripts
```bash
npm run dev
npm test
npm run test:watch
npm run lint
npm run typecheck
npm run build
npm run import:listings -- <input-json-path>
npm run normalize:listings -- <input-json-path> [output-json-path]
npm run db:start
npm run db:stop
npm run db:migrate -- --name <name>
npm run db:seed
npm run db:reset
npm run prisma:studio
```

## Product Scope
- Dashboard table view
- Dashboard card view
- Global search
- Filtering by state, category, price, SDE, score, status, and tags
- Sorting by newest, updated, ask price, SDE, score, and location
- Saved filter presets
- ChatGPT workbook export for the current tracker view
- Create and edit flows
- Detail page with quick status updates
- Notes and change history per business
- Realistic seed data

## ChatGPT Export
- Use the `Generate ChatGPT workbook` button in the dashboard toolbar to download the current tracker view as `.xlsx`.
- The workbook contains four sheets: `businesses`, `notes`, `history`, and `metadata`.
- Export scope follows the active URL filters, so clear filters first if you want a full-tracker export.

## Tests
- `npm test` runs the Vitest unit suite.
- Current coverage focuses on filter parsing, validation, scoring, import normalization, export shaping, and repository behavior.
- The next test layer to add is integration coverage against real Prisma-backed reads/writes.

## ChatGPT JSON Prep
- Run `npm run normalize:listings -- <input-json-path>` to clean a ChatGPT business-listing batch into an import-ready JSON file.
- By default the script writes a sibling file ending in `.normalized.json`.
- The normalizer fixes legacy 10-point `overallScore` values, keeps `ownerDependenceRating` on its native `1 low / 5 high` scale, and standardizes tags, deal status, and empty optional fields.
- Run `npm run import:listings -- <input-json-path>` to create businesses from a normalized or raw ChatGPT listing batch.
- The importer normalizes again for safety, creates missing businesses, and skips existing `sourceUrl` matches instead of overwriting them.

## Repo Notes
- Prisma 7 configuration lives in `prisma.config.ts`.
- Prisma client code is generated into `src/generated/prisma`.
- Dashboard state is URL-driven and should continue to round-trip through `src/features/businesses/domain/business.filters.ts`.
- Important repo memory is intentionally duplicated in the root markdown files so future Codex sessions can recover context quickly.

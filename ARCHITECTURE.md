# ARCHITECTURE

## System Structure
- App layer: Next.js App Router pages under `src/app`
- Feature UI: `src/features/businesses/components`
- Domain layer: `src/features/businesses/domain`
- Data layer: `src/features/businesses/data`
- Mutation layer: `src/features/businesses/actions`
- Feature utilities: `src/features/businesses/utils`
- Shared UI/utilities: `src/components/ui`, `src/lib`
- Persistence: Prisma schema, migrations, and seed under `prisma/`
- Deployment: standalone Vercel app `microflowops-biztracker`, Neon Postgres, and an external host-app rewrite from `microflowops.com/biztracker`
- Release automation: GitHub Actions workflow `.github/workflows/vercel-deploy.yml`

## Folder Layout
- `src/app/page.tsx`: dashboard
- `src/app/businesses/new/page.tsx`: create flow
- `src/app/businesses/[businessId]/page.tsx`: detail page
- `src/app/businesses/[businessId]/edit/page.tsx`: edit flow
- `src/features/businesses/domain/business.types.ts`: business-facing types and options
- `src/features/businesses/domain/business.filters.ts`: URL filter parsing/serialization
- `src/features/businesses/domain/business.schemas.ts`: server-side validation
- `src/features/businesses/domain/business-score.ts`: shared rating-to-score logic
- `src/features/businesses/domain/business-import-normalizer.ts`: ChatGPT JSON cleanup into import-ready records
- `src/features/businesses/domain/business-export.ts`: export dataset shaping for workbook downloads
- `src/features/businesses/data/business-repository.ts`: Prisma reads/writes
- `src/features/businesses/utils/business-export-workbook.ts`: Excel workbook generation
- `src/features/businesses/actions/business-actions.ts`: server actions
- `src/app/exports/businesses/route.ts`: workbook download endpoint for current tracker filters
- `scripts/normalize-chatgpt-listings.ts`: CLI normalizer for external ChatGPT listing batches
- `scripts/import-business-listings.ts`: CLI importer that creates businesses from normalized ChatGPT listing batches
- `src/lib/prisma.ts`: Prisma client singleton with Pg adapter
- `src/lib/site.ts`: base-path and site URL helpers for local vs production hosting
- `src/generated/prisma/*`: generated Prisma client output
- `tests/*`: Vitest unit coverage for filters, validation, scoring, import normalization, export shaping, and repository mutations

## Data Flow
1. Dashboard reads `searchParams`.
2. `business.filters.ts` parses URL state into typed filters.
3. `business-repository.ts` builds Prisma queries and returns mapped view models.
4. Server components render dashboard/detail pages.
5. Forms submit to server actions in `business-actions.ts`.
6. Actions validate input with Zod, call repository functions, then `redirect`, `refresh`, or `revalidatePath`.
7. Repository writes durable audit context via `BusinessHistoryEvent` and `BusinessNote`.
8. Workbook export reads the same filter query state, loads matching businesses plus notes/history, shapes rows in `business-export.ts`, and streams an `.xlsx` response from `src/app/exports/businesses/route.ts`.
9. External ChatGPT listing batches can be normalized offline through `scripts/normalize-chatgpt-listings.ts`, which standardizes score semantics before later import.
10. `scripts/import-business-listings.ts` imports normalized listing batches into PostgreSQL, keyed conservatively by `sourceUrl` when available so repeat runs skip existing records instead of overwriting them.
11. In production, `microflowops.com/biztracker` requests are rewritten by `C:\dev\OSHA_Leads\web\next.config.mjs` to the standalone BizTracker Vercel deployment, which serves the app with `NEXT_PUBLIC_BASE_PATH=/biztracker`.

## Database Model Summary
- `Business`: primary acquisition record with financials, qualitative assessment, ratings, score, status, notes, tags, timestamps
- `BusinessNote`: per-business note entries
- `BusinessHistoryEvent`: durable event log for create/update/status/note changes
- `FilterPreset`: saved dashboard query states

## API Boundaries
- There is no public REST API yet.
- Mutations use server actions.
- Reads are server-side Prisma queries from App Router pages/components.
- The only route handler is the workbook export endpoint because file download is a concrete integration need.
- Keep the API surface small unless a concrete integration requires route handlers later.

## Deployment Notes
- Production app URL: `https://microflowops.com/biztracker`
- Standalone Vercel deployment URL: `https://microflowops-biztracker.vercel.app/biztracker`
- Production database: Neon Postgres connected through Vercel-managed environment variables
- Public path routing depends on the external MicroFlowOps host repo at `C:\dev\OSHA_Leads\web`
- Git-based deploy automation is handled in-repo through `.github/workflows/vercel-deploy.yml` using GitHub secrets/variables rather than Vercel's native repo connection

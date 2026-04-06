# ARCHITECTURE

## System Structure
- App layer: Next.js App Router pages under `src/app`
- Feature UI: `src/features/businesses/components`
- Domain layer: `src/features/businesses/domain`
- Data layer: `src/features/businesses/data`
- Mutation layer: `src/features/businesses/actions`
- Shared UI/utilities: `src/components/ui`, `src/lib`
- Persistence: Prisma schema, migrations, and seed under `prisma/`

## Folder Layout
- `src/app/page.tsx`: dashboard
- `src/app/businesses/new/page.tsx`: create flow
- `src/app/businesses/[businessId]/page.tsx`: detail page
- `src/app/businesses/[businessId]/edit/page.tsx`: edit flow
- `src/features/businesses/domain/business.types.ts`: business-facing types and options
- `src/features/businesses/domain/business.filters.ts`: URL filter parsing/serialization
- `src/features/businesses/domain/business.schemas.ts`: server-side validation
- `src/features/businesses/data/business-repository.ts`: Prisma reads/writes
- `src/features/businesses/actions/business-actions.ts`: server actions
- `src/lib/prisma.ts`: Prisma client singleton with Pg adapter
- `src/generated/prisma/*`: generated Prisma client output
- `tests/*`: Vitest unit coverage for filters, validation, and repository mutations

## Data Flow
1. Dashboard reads `searchParams`.
2. `business.filters.ts` parses URL state into typed filters.
3. `business-repository.ts` builds Prisma queries and returns mapped view models.
4. Server components render dashboard/detail pages.
5. Forms submit to server actions in `business-actions.ts`.
6. Actions validate input with Zod, call repository functions, then `redirect`, `refresh`, or `revalidatePath`.
7. Repository writes durable audit context via `BusinessHistoryEvent` and `BusinessNote`.

## Database Model Summary
- `Business`: primary acquisition record with financials, qualitative assessment, ratings, score, status, notes, tags, timestamps
- `BusinessNote`: per-business note entries
- `BusinessHistoryEvent`: durable event log for create/update/status/note changes
- `FilterPreset`: saved dashboard query states

## API Boundaries
- There is no public REST API yet.
- Mutations use server actions.
- Reads are server-side Prisma queries from App Router pages/components.
- Keep the API surface small unless a concrete integration requires route handlers later.

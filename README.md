# Business Acquisition Tracker

Local-first, production-ready tracker for evaluating small businesses you may want to acquire. The app supports manual business entry, Codex chat links as source URLs, dashboard filtering and sorting, saved filter presets, editable detail pages, and durable notes/history.

## Stack
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma 7
- PostgreSQL

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

## Core Scripts
```bash
npm run dev
npm test
npm run test:watch
npm run lint
npm run typecheck
npm run build
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
- Create and edit flows
- Detail page with quick status updates
- Notes and change history per business
- Realistic seed data

## Tests
- `npm test` runs the Vitest unit suite.
- Current coverage focuses on filter parsing, validation, and repository mutation behavior.
- The next test layer to add is integration coverage against real Prisma-backed reads/writes.

## Repo Notes
- Prisma 7 configuration lives in `prisma.config.ts`.
- Prisma client code is generated into `src/generated/prisma`.
- Dashboard state is URL-driven and should continue to round-trip through `src/features/businesses/domain/business.filters.ts`.
- Important repo memory is intentionally duplicated in the root markdown files so future Codex sessions can recover context quickly.

# TASKS

## Completed
- Scaffolded a Next.js 16 App Router app with TypeScript and Tailwind
- Added PostgreSQL local development via `compose.yaml`
- Added Prisma 7 config, schema, generated client output, initial migration, and seed script
- Implemented dashboard search, filtering, sorting, table/cards views, and saved filter presets
- Implemented create, edit, and detail flows
- Implemented status updates, notes, and change history
- Added context-retention docs and human setup docs
- Added Vitest unit tests for filter parsing, validation, and repository mutations
- Verified typecheck, lint, build, migration, and seed

## In Progress
- None

## Next Recommended Tasks
- Add integration tests for Prisma-backed reads/writes and key user flows
- Add pagination and bulk actions once the dataset grows beyond a small local list
- Add optional structured source ingestion from pasted listing URLs or Codex links
- Add authentication if this ever becomes shared across users
- Consider Postgres full-text search if global search becomes a bottleneck

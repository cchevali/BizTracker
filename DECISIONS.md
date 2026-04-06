# DECISIONS

## 2026-04-05
Decision: Build as a single Next.js App Router monolith with feature folders.
Reason: The product is small, internal, and benefits more from obvious file boundaries than distributed services or separate packages.
Consequences: UI, domain, data access, and actions stay in one repo with low coordination overhead.

## 2026-04-05
Decision: Use server actions for mutations and server-rendered reads for the dashboard/detail pages.
Reason: This keeps the API surface minimal and makes the mutation flow easy for future sessions to trace.
Consequences: There is no public REST layer yet; future integrations may add route handlers only if needed.

## 2026-04-05
Decision: Use Prisma 7 with `prisma.config.ts`, generated client output in `src/generated/prisma`, and `@prisma/adapter-pg`.
Reason: Prisma 7 no longer supports datasource URLs in `schema.prisma`, and the current official setup expects config-based datasource wiring plus an adapter-backed client.
Consequences: Future changes must preserve `prisma.config.ts` and avoid reintroducing old Prisma patterns.

## 2026-04-05
Decision: Keep dashboard state in URL search params and store saved presets as serialized query state.
Reason: URL state is durable, sharable, and easy for future Codex sessions to reason about.
Consequences: Filter and sort behavior should continue to round-trip through `business.filters.ts`.

## 2026-04-05
Decision: Store tags directly on `Business` as a lowercase Postgres string array.
Reason: This is simpler than a normalized tag table for the current single-user scope.
Consequences: Tag analytics and global tag management are limited; a future normalization pass is possible if the product grows.

## 2026-04-05
Decision: Record notes and change history in dedicated tables instead of relying only on `updatedAt`.
Reason: Context continuity is a core product requirement, and audit-like history helps future sessions understand how a record evolved.
Consequences: Meaningful mutations should continue to create history entries.

## 2026-04-05
Decision: Add Vitest for focused unit tests and mock Prisma in repository mutation tests.
Reason: The highest-value coverage at this stage is fast feedback on filter parsing, form validation, and mutation contracts without requiring a separate test database harness.
Consequences: Repository tests verify Prisma call shapes and mutation behavior, but they do not replace future integration tests against a real database.

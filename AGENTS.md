# AGENTS

## Purpose
This repo is a local-first, production-ready acquisition tracker for evaluating small businesses to potentially buy. It stores listing facts, fit/risk analysis, notes, history, saved filter presets, and source URLs including Codex chat links.

## Read First
Before making changes, always read these files in order:
1. `AGENTS.md`
2. `CONTEXT.md`
3. `ARCHITECTURE.md`
4. `DECISIONS.md`
5. `TASKS.md`
6. `SESSION_HANDOFF.md`

Then read the feature-specific files you will touch.

## Stack
- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- Prisma ORM 7
- PostgreSQL
- Prisma Pg adapter via `@prisma/adapter-pg`

## Important Version Notes
- This repo uses Next 16, not older App Router behavior. If you are unsure about route props, forms, or server functions, read the local docs in `node_modules/next/dist/docs/01-app/`.
- This repo uses Prisma 7. Keep the database URL in `prisma.config.ts`, not in `prisma/schema.prisma`.
- Prisma client code is generated into `src/generated/prisma`. Do not hand-edit generated files.

## Architecture
- Single Next.js monolith.
- UI lives in `src/app` and `src/features/businesses/components`.
- Domain parsing/types live in `src/features/businesses/domain`.
- Data access lives in `src/features/businesses/data`.
- Mutations are handled with server actions in `src/features/businesses/actions/business-actions.ts`.
- Shared UI primitives live in `src/components/ui`.
- Prisma schema, migrations, and seed live in `prisma/`.

## Conventions
- Prefer boring, explicit code over abstractions.
- Keep URL search params as the source of truth for dashboard search/filter/sort/view state.
- Keep docs concise and current. If behavior changes, update docs in the same session.
- Store important audit context in the database via `BusinessHistoryEvent` and `BusinessNote`.
- Use `apply_patch` for manual file edits.
- Do not replace server actions with route handlers unless there is a clear need.

## Commands
- `npm install`
- `npm run dev`
- `npm test`
- `npm run test:watch`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run db:start`
- `npm run db:stop`
- `npm run db:migrate -- --name <name>`
- `npm run db:seed`
- `npm run db:reset`
- `npm run prisma:studio`

## Working Agreement For Future Codex Sessions
- Start by reading the six context files listed above.
- Check `TASKS.md` before choosing what to work on next.
- Add a decision entry to `DECISIONS.md` when you make a meaningful architectural or workflow choice.
- Update `TASKS.md` when task status changes.
- Update `SESSION_HANDOFF.md` at the end of any meaningful session.
- Keep `CHANGELOG.md` human-readable and high-signal.
- Verify meaningful changes with the narrowest relevant commands, then record anything you could not verify.

# AGENTS

## Purpose
This repo is a local-first, production-ready acquisition tracker for evaluating small businesses to potentially buy. It stores listing facts, fit/risk analysis, notes, history, saved filter presets, and source URLs including Codex chat links. The live production path is `https://microflowops.com/biztracker`.

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
- Feature-specific utilities such as workbook generation live in `src/features/businesses/utils`.
- Mutations are handled with server actions in `src/features/businesses/actions/business-actions.ts`.
- Shared UI primitives live in `src/components/ui`.
- Prisma schema, migrations, and seed live in `prisma/`.
- Production app hosting runs on Vercel project `microflowops-biztracker` with a Neon Postgres database.
- Public traffic for `microflowops.com/biztracker` is rewritten through the existing MicroFlowOps host app in `C:\dev\OSHA_Leads\web\next.config.mjs`.

## Conventions
- Prefer boring, explicit code over abstractions.
- Keep URL search params as the source of truth for dashboard search/filter/sort/view state.
- Keep docs concise and current. If behavior changes, update docs in the same session.
- Store important audit context in the database via `BusinessHistoryEvent` and `BusinessNote`.
- Preserve workbook export compatibility for ChatGPT by keeping `src/app/exports/businesses/route.ts` aligned with `src/features/businesses/domain/business-export.ts`.
- Preserve production base-path support by keeping `next.config.ts` and `src/lib/site.ts` aligned with `NEXT_PUBLIC_BASE_PATH`.
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
- `npm run import:listings -- <input-json-path>`
- `npm run reconcile:production`
- `npm run normalize:listings -- <input-json-path> [output-json-path]`
- `npm run verify:reconciliation`
- `npm run verify:production-data`
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
- For external ChatGPT listing batches, prefer normalizing them through `scripts/normalize-chatgpt-listings.ts` before import or manual entry.
- Use `scripts/import-business-listings.ts` for database import batches; it creates missing businesses and skips existing `sourceUrl` matches so reruns do not overwrite manual edits.
- If production data appears out of sync with the live schema/UI, use `npm run verify:production-data` first, then `npm run reconcile:production` against the pulled Vercel production env rather than editing rows manually.
- If the task affects public hosting, also inspect `next.config.ts`, `src/lib/site.ts`, and the external host rewrite in `C:\dev\OSHA_Leads\web\next.config.mjs`.
- If the task affects release automation, also inspect `DEPLOYMENT.md` and `.github/workflows/vercel-deploy.yml`.

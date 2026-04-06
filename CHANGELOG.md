# CHANGELOG

## 2026-04-05
- Created the initial Next.js 16 + Prisma 7 + PostgreSQL acquisition tracker.
- Added dashboard table/cards views, search, filters, sorting, and saved presets.
- Added create/edit/detail flows with validation.
- Added business notes, change history, and quick status updates.
- Added realistic seed data and the initial migration.
- Added context-retention and handoff documentation for future Codex sessions.
- Added Vitest unit tests for filter parsing, validation, and repository mutations.
- Fixed dark Link-based buttons that were rendering without visible labels.
- Added a `Generate ChatGPT workbook` dashboard action and `.xlsx` export route with `businesses`, `notes`, `history`, and `metadata` sheets.
- Added export-focused unit tests and chose `exceljs` for workbook generation after rejecting `xlsx` because of unresolved audit advisories.
- Fixed auto-derived overall scoring so owner dependence lowers the score instead of raising it.
- Added a reusable `normalize:listings` script for cleaning ChatGPT JSON batches into import-ready records.
- Added a reusable `import:listings` script for safely importing normalized ChatGPT listing batches into PostgreSQL.
- Imported the first 24-listing BizBuySell ChatGPT batch into the tracker database.
- Added production base-path support, deployed the app on Vercel + Neon, and published it at `https://microflowops.com/biztracker` through the existing MicroFlowOps host rewrite.
- Added a GitHub Actions workflow and deployment docs for Git-based preview and production deploys to the `microflowops-biztracker` Vercel project.

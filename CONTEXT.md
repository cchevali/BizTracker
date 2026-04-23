# CONTEXT

## Overview
This app tracks small businesses that may be acquisition targets. It supports manual record creation, Codex chat links as source URLs, dashboard filtering/sorting/search, saved filter presets, detail pages, editable records, and notes/history per business. It is live in production at `https://microflowops.com/biztracker`.

## Current Scope
- Single-user internal workflow with both local development and production hosting
- One Next.js app, no auth
- Dashboard with table and card views
- URL-driven search, filters, sorting, and view mode
- Mobile dashboard flow trimmed to global search, score filtering, and card-first results on smaller screens
- Saved filter presets stored in PostgreSQL
- Workbook export for ChatGPT comparison workflows, including `businesses`, `notes`, `history`, and `metadata` sheets
- Workbook import parsing for both the original workbook schema and the v2 appended-column schema
- ChatGPT JSON normalization script for import-prep and score cleanup
- ChatGPT JSON CLI import script for creating businesses from normalized batches
- Acquisition-screening v2 fields for thesis fit, financeability, operator dependence, freshness, downside, and operational structure
- Shared scenario math for cash-to-close, debt service, and post-brother cash outputs based on one assumptions module
- Detail page with quick status updates, notes, and change history
- Create and edit forms with validation
- Default active pipeline behavior that now centers on `pipelineBucket = ACTIVE`, with optional `WATCHLIST` browsing and hidden-by-default `COMP_ONLY`, `UNVERIFIED`, and `Passed` records
- Thesis cleanup/backfill CLI that archives low-fit deals, adds discussed public listings, and backfills active businesses
- Repo-managed public listing upsert batches keyed by normalized `sourceUrl`, then BizBuySell ad id, then normalized title + location for the serious 2026-04-11 candidates plus the 2026-04-12, 2026-04-14, 2026-04-15, 2026-04-15 requested, 2026-04-17 requested, and 2026-04-23 requested researched additions, including Wayne County MI, Clifton NJ, Tampa FL, and five retained national landscaping comparison rows in MA, TX, MO, AZ, and NY with full listing facts, skeptical assessment text, live-DB dedupe, and history coherence
- Conservative thesis realignment tooling that normalizes category casing, marks public-source verification, rebuckets rows into `ACTIVE` / `WATCHLIST` / `COMP_ONLY` / `UNVERIFIED`, and appends explicit note/history context for major ranking changes
- Production-safe reconciliation and verification scripts that compare the live Neon database against the expected thesis-cleanup state
- Repo-native Vercel access validation and a manual production deploy script with smoke checks for the standalone app, public path, and workbook export
- Realistic seed data
- Production deployment on Vercel with Neon Postgres and a `/biztracker` base path
- GitHub Actions-based auto-deploys for preview and production Vercel releases
- Live production currently verifies at `84 total / 33 active / 14 watchlist / 31 comp-only / 6 unverified / 29 passed` after the 2026-04-23 retained landscaping comp batch on top of the 2026-04-17 conservative thesis realignment

## Key Assumptions
- This is currently a personal/internal tool, not a multi-user SaaS app.
- `overall_score` is now the tracker's current thesis-weighted ranking signal rather than a preserved legacy average; the supporting acquisition-thesis fields and scenario math remain visible so future sessions can still inspect why the ranking moved.
- Deal scoring is editable, but if enough legacy ratings exist and no score is set, the app derives a score automatically.
- Tags are normalized to lowercase strings and stored as a Postgres string array.
- Saved presets are global because there is no user model yet.
- Derived cash scenario values are read-only and recomputed from asking price and SDE rather than trusted from imports.
- Production data reconciliation is explicit and idempotent; schema deploys do not silently run the thesis cleanup/backfill for you.
- Repo-managed public listing batches can intentionally upsert specific public listings when those facts and thesis notes are treated as canonical tracker data, and the dedupe matcher now falls back from normalized `sourceUrl` to BizBuySell ad id and normalized title + location to avoid duplicate public rows.
- When a user provides a tracker export workbook for a requested public-listing add batch, treat that workbook plus the live database as the dedupe baseline before creating any new managed rows.
- Requested public-listing adds should only be seeded when the exact requested URL is live, when an exact-title/location current relist is available, or when a direct individual mirror-marketplace page can be validated with matching title, location, and economics; do not substitute merely similar market listings for inaccessible requested URLs.
- Public listings that are live-marked as sale pending or LOI pending currently map into the existing `LETTER_OF_INTENT` tracker status plus pending-style tags because the schema does not yet have a dedicated generic pending enum.
- Nullable booleans such as seller financing, home-based status, and ops-manager presence still use `null` in the DB to mean unknown; the UI/export layer now renders and filters that explicitly as `Unknown`.
- `publicSourceVerified = true` only when `sourceUrl` points to a real public listing page rather than an internal chat link or placeholder source.
- Production requests come through the existing `microflowops.com` host app, which rewrites `/biztracker/*` to the standalone BizTracker Vercel deployment.

## Constraints
- Must stay maintainable for future Codex sessions with minimal memory.
- Must stay full-stack TypeScript with Next App Router + Prisma + PostgreSQL.
- Must avoid unnecessary dependencies.
- Must keep docs truthful to the actual repo state.

## Known Gaps
- No authentication or authorization
- No UI/integration tests yet
- No pagination or bulk actions
- No in-app import/parser flow from a source URL or workbook upload yet beyond manual paste and offline normalization/import scripts
- Public listing refresh is still CLI-driven; there is no in-app source-url refresh or review workflow yet
- Pipeline buckets are available in the UI and data model, but there is still no dedicated bulk rebucket/reclassify workflow beyond the CLI reconciliation path
- No direct marketplace ingestion or comparison workflow yet beyond exporting tracker data for ChatGPT
- Global search is simple field matching, not full-text indexing
- Thesis backfill judgments are intentionally manual and skeptical; they are reproducible through the CLI script, but they are not derived automatically from listing text
- Production drift can still happen if the database is migrated/deployed without running the reconciliation command; the verification script detects that state, but it does not auto-heal it inside the deploy job
- Direct Vercel GitHub-app repo connection is still unavailable; deploy automation currently uses GitHub Actions plus a Vercel token instead
- Vercel token rotation is still a manual ops step outside the repo; the new access check makes failures explicit, but it cannot mint or rotate the token for you
- There is still no in-repo workflow for tracking stale requested URLs versus live canonical relists beyond the managed batch files and handoff notes, so alternate-source normalization remains a manual research step

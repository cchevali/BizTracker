# CONTEXT

## Overview
This app tracks small businesses that may be acquisition targets. It supports manual record creation, Codex chat links as source URLs, dashboard filtering/sorting/search, saved filter presets, detail pages, editable records, and notes/history per business. It is live in production at `https://microflowops.com/biztracker`.

## Current Scope
- Single-user internal workflow with both local development and production hosting
- One Next.js app, no auth
- Dashboard with table and card views
- URL-driven search, filters, sorting, and view mode
- Saved filter presets stored in PostgreSQL
- Workbook export for ChatGPT comparison workflows, including businesses, notes, history, and metadata sheets
- ChatGPT JSON normalization script for import-prep and score cleanup
- ChatGPT JSON CLI import script for creating businesses from normalized batches
- Detail page with quick status updates, notes, and change history
- Create and edit forms with validation
- Realistic seed data
- Production deployment on Vercel with Neon Postgres and a `/biztracker` base path
- GitHub Actions-based auto-deploys for preview and production Vercel releases

## Key Assumptions
- This is currently a personal/internal tool, not a multi-user SaaS app.
- Deal scoring is editable, but if enough ratings exist and no score is set, the app derives a score automatically.
- Tags are normalized to lowercase strings and stored as a Postgres string array.
- Saved presets are global because there is no user model yet.
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
- No in-app import/parser flow from a source URL yet beyond manual paste and offline JSON normalization/import
- No direct marketplace ingestion or comparison workflow yet beyond exporting tracker data for ChatGPT
- Global search is simple field matching, not full-text indexing
- Direct Vercel GitHub-app repo connection is still unavailable; deploy automation currently uses GitHub Actions plus a Vercel token instead

# CONTEXT

## Overview
This app tracks small businesses that may be acquisition targets. It supports manual record creation, Codex chat links as source URLs, dashboard filtering/sorting/search, saved filter presets, detail pages, editable records, and notes/history per business.

## Current Scope
- Single-user local workflow
- One Next.js app, no auth
- Dashboard with table and card views
- URL-driven search, filters, sorting, and view mode
- Saved filter presets stored in PostgreSQL
- Detail page with quick status updates, notes, and change history
- Create and edit forms with validation
- Realistic seed data

## Key Assumptions
- This is currently a personal/internal tool, not a multi-user SaaS app.
- Deal scoring is editable, but if enough ratings exist and no score is set, the app derives a score automatically.
- Tags are normalized to lowercase strings and stored as a Postgres string array.
- Saved presets are global because there is no user model yet.

## Constraints
- Must stay maintainable for future Codex sessions with minimal memory.
- Must stay full-stack TypeScript with Next App Router + Prisma + PostgreSQL.
- Must avoid unnecessary dependencies.
- Must keep docs truthful to the actual repo state.

## Known Gaps
- No authentication or authorization
- No UI/integration tests yet
- No pagination or bulk actions
- No import/parser flow from a source URL yet beyond manual paste
- Global search is simple field matching, not full-text indexing

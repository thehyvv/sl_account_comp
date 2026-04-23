---
title: "feat: Build bank data layer — Drizzle + Cloud SQL + API routes"
type: feat
status: active
date: 2026-04-23
origin: docs/brainstorms/data-layer-requirements.md
---

# feat: Build Bank Data Layer

## Overview

Replace the hardcoded `lib/mock-data.ts` with a real PostgreSQL database on Cloud SQL. Install Drizzle ORM, define the schema, run migrations, seed all 24 CBSL-licensed banks, expose data via Next.js API routes, and wire the bank directory and detail pages to those routes.

---

## Problem Frame

The app is live on Cloud Run but serves mock data. The bank directory (`/banks`) and bank detail (`/banks/[slug]`) pages import directly from `lib/mock-data.ts`. Cloud SQL is already provisioned and the `DATABASE_URL` secret is in Secret Manager — the DB just has no schema or data yet.

---

## Requirements Trace

- R1. All 24 CBSL-licensed banks exist in the `bankcompare` database
- R2. `GET /api/banks` returns accurate bank data with correct types and ratings
- R3. Bank directory page renders from real DB data — no mock imports
- R4. Bank detail page renders from real DB data — no mock imports
- R5. Mock data file retained but no longer imported by bank-related pages
- R6. DB migrations are version-controlled and re-runnable

---

## Scope Boundaries

- Products, FD rates, savings data — deferred to next iteration
- Automated scraping — deferred; seed data is manually curated
- Admin UI for data management — deferred
- Live Fitch/Moody's scraping — deferred; ratings seeded from planning docs
- User auth, saved comparisons, rate alerts — deferred
- Pages that use product data (`/compare`, `/products`, `/best-fixed-deposit-rates`, `/expat-bank-accounts`, `FeaturedRates.tsx`) — remain on mock data; not touched in this plan

---

## Context & Research

### Relevant Code and Patterns

- `lib/mock-data.ts` — current data source; `getBanksByType()`, `getBankById()`, `mockBanks` are the functions being replaced
- `types/index.ts` — `Bank`, `BankTypeFilter` types; Drizzle schema must be compatible
- `app/banks/page.tsx` — `'use client'` page, calls `getBanksByType()` directly; needs to switch to `fetch('/api/banks')`
- `app/banks/[slug]/page.tsx` — `'use client'` page, calls `mockBanks.find()` directly; needs `fetch('/api/banks/[slug]')`
- `components/banks/BankDirectory.tsx` — `'use client'` component, calls `getBanksByType()` directly; needs to accept banks as props or fetch internally
- `app/page.tsx` — landing page; `BankDirectory` rendered here, will be prop-fed

### External References

- Drizzle ORM + `pg` driver: `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg`
- Cloud SQL Unix socket connection string format: `postgresql://user:pass@/dbname?host=/cloudsql/PROJECT:REGION:INSTANCE`
- Drizzle `drizzle-kit migrate` for applying migrations
- Next.js App Router API routes: `app/api/banks/route.ts`, `app/api/banks/[slug]/route.ts`

---

## Key Technical Decisions

- **Drizzle ORM over raw pg**: Type-safe schema, schema-as-code migrations, thin runtime overhead. Schema in `lib/db/schema.ts`, migrations in `lib/db/migrations/`.
- **DB client singleton**: Next.js dev mode hot-reloads modules — use a global singleton (`globalThis.__db`) to avoid exhausting connection pool.
- **Server-side data fetching for bank pages**: Both `app/banks/page.tsx` and `app/banks/[slug]/page.tsx` are currently `'use client'` pages that fetch synchronously from mock data. They will be converted to **Server Components** that call the DB directly (no HTTP round-trip) for the initial render. `BankDirectory` component stays client for interactive filtering.
- **`BankDirectory` becomes prop-fed**: Server page fetches all banks, passes them as props to the client `BankDirectory` component. Removes the need for `BankDirectory` to fetch internally.
- **Slug = `short_code.toLowerCase()`**: Consistent with existing mock implementation (`getBankBySlug` uses `shortCode.toLowerCase()`).
- **`GET /api/banks` stays for external use**: Even though the pages use direct DB calls, the API route is kept for future use (mobile clients, AI recommendation engine).
- **Local dev DB**: Developers set `DATABASE_URL` in `.env.local` pointing to a local Postgres instance. Cloud SQL Auth Proxy not required locally.

---

## Open Questions

### Resolved During Planning

- **Can Next.js Server Components call Drizzle directly?** Yes — server components run on Node.js and can import `lib/db/index.ts` directly. No HTTP round-trip needed.
- **Connection limit on db-f1-micro?** Max 50 connections set in Terraform. Drizzle `pg` pool defaults to 10 — safe for Cloud Run with min-instances=0.
- **`'use client'` pages**: `app/banks/page.tsx` and `app/banks/[slug]/page.tsx` are currently marked `'use client'`. They will be converted to Server Components. The interactive filtering logic moves into child client components (`BankDirectory` already is one).

### Deferred to Implementation

- Exact Drizzle `pgTable` column types for nullable ratings fields — implementer validates against Drizzle docs
- Whether `drizzle-kit push` or `drizzle-kit migrate` is used for the initial migration run against Cloud SQL

---

## Output Structure

    lib/
    ├── db/
    │   ├── index.ts              # Drizzle client singleton
    │   ├── schema.ts             # banks + bank_rating_history table definitions
    │   └── migrations/           # generated SQL migration files
    │       └── 0000_banks_init.sql
    app/
    └── api/
        └── banks/
            ├── route.ts          # GET /api/banks
            └── [slug]/
                ├── route.ts      # GET /api/banks/[slug]
                └── products/
                    └── route.ts  # GET /api/banks/[slug]/products
    scripts/
    └── seed.ts                   # seeds all 24 banks + initial rating history

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Request: GET /banks/[slug]
    ↓
app/banks/[slug]/page.tsx  (Server Component — no 'use client')
    ↓
lib/db/index.ts            (Drizzle client singleton)
    ↓
Cloud SQL (bankcompare DB) → banks table
    ↓
Returns Bank row → passed as props to child client components

Request: GET /api/banks?type=state
    ↓
app/api/banks/route.ts     (Next.js Route Handler)
    ↓
lib/db/index.ts            (same singleton)
    ↓
SELECT * FROM banks WHERE bank_type = 'state'
    ↓
JSON response → { banks: [...] }
```

---

## Implementation Units

- [ ] U1. **Install DB dependencies and configure Drizzle**

**Goal:** Add Drizzle ORM, `pg` driver, and `drizzle-kit` to the project. Create `drizzle.config.ts` pointing at the schema and migrations dir.

**Requirements:** R6

**Dependencies:** None

**Files:**
- Modify: `package.json`
- Create: `drizzle.config.ts`
- Modify: `.env.example`
- Modify: `.gitignore` (ensure `.env.local` is excluded)

**Approach:**
- Add `drizzle-orm`, `pg` to dependencies; `drizzle-kit`, `@types/pg` to devDependencies
- `drizzle.config.ts` references `lib/db/schema.ts` and `lib/db/migrations/`
- Add `db:generate` and `db:migrate` scripts to `package.json`
- Add `DATABASE_URL` to `.env.example` with the Cloud SQL socket format and a local dev example

**Test expectation:** none — dependency and config change only

**Verification:**
- `npm install` succeeds
- `npx drizzle-kit generate` runs without error (even before schema exists, confirms config is valid)

---

- [ ] U2. **Define Drizzle schema and generate migration**

**Goal:** Define `banks` and `bank_rating_history` tables as Drizzle pgTable definitions. Generate the initial SQL migration file.

**Requirements:** R1, R6

**Dependencies:** U1

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/migrations/0000_banks_init.sql` (generated by drizzle-kit)

**Approach:**
- `banks` table columns: `id` (serial pk), `name_en`, `short_code` (unique), `website_url`, `bank_type` (varchar enum: state/private_domestic/foreign), `cbsl_category`, `fitch_rating` (nullable), `fitch_outlook` (nullable), `moody_rating` (nullable), `cbsl_classification` (nullable), `risk_score` (numeric, nullable), `risk_tier` (varchar: low/moderate/elevated/high), `is_active` (boolean default true), `created_at`, `updated_at`
- `bank_rating_history` table columns: `id`, `bank_id` (FK → banks.id), `agency`, `rating_type`, `rating_value`, `outlook`, `rating_date`, `change_reason`, `created_at`
- Drizzle infers types from schema — `Bank` type exported from schema must align with `types/index.ts` `Bank` interface (or `types/index.ts` updated to re-export from schema)

**Test expectation:** none — schema definition; verified by migration generation succeeding

**Verification:**
- `npm run db:generate` produces `lib/db/migrations/0000_banks_init.sql` with correct CREATE TABLE statements
- Schema TypeScript compiles without errors

---

- [ ] U3. **Create Drizzle client singleton**

**Goal:** Establish a single DB connection pool shared across all server-side code. Handles both Cloud SQL socket (production) and standard TCP (local dev).

**Requirements:** R1, R2

**Dependencies:** U2

**Files:**
- Create: `lib/db/index.ts`

**Approach:**
- Use `globalThis.__db` pattern to prevent connection pool exhaustion during Next.js hot reload in dev
- Read `DATABASE_URL` from `process.env` — throws clearly if missing
- Export a `db` Drizzle instance and the raw `pool` for transactions if needed
- No branching on `NODE_ENV` — the socket vs TCP difference is entirely in the `DATABASE_URL` value

**Test scenarios:**
- Happy path: `db` is importable and returns a Drizzle instance when `DATABASE_URL` is set
- Error path: module throws a descriptive error when `DATABASE_URL` is undefined

**Verification:**
- TypeScript compiles; `db` is importable in a server component without runtime error when env is set

---

- [ ] U4. **Run migration and seed 24 banks**

**Goal:** Apply the schema migration against the Cloud SQL `bankcompare` database and insert all 24 CBSL-licensed commercial banks with ratings and initial rating history entries.

**Requirements:** R1

**Dependencies:** U2, U3

**Files:**
- Create: `scripts/seed.ts`

**Approach:**
- Migration run via `npm run db:migrate` (uses `drizzle-kit migrate` pointed at Cloud SQL via `DATABASE_URL`)
- Seed script uses `db.insert(banks).values([...])` with `onConflictDoNothing()` so it is safely re-runnable
- All 24 banks from the requirements doc seed table, with correct `bank_type`, `fitch_rating`, `risk_tier`, `website_url`
- For each bank with a Fitch rating, insert one `bank_rating_history` row with `agency='FITCH'`, `rating_date` = today, `change_reason='Initial seed'`
- Add `seed` script to `package.json`: `tsx scripts/seed.ts`

**Test scenarios:**
- Happy path: running seed twice does not duplicate records (idempotent via `onConflictDoNothing`)
- Happy path: after seeding, `SELECT COUNT(*) FROM banks` returns 24
- Happy path: all 24 banks have correct `bank_type` values (3 state, 11 private_domestic, 10 foreign)
- Edge case: banks without Fitch ratings have `fitch_rating = null`, `risk_tier = 'moderate'`

**Verification:**
- `SELECT name_en, fitch_rating, risk_tier FROM banks ORDER BY name_en` returns 24 rows with correct data
- `SELECT COUNT(*) FROM bank_rating_history` returns ≥ 14 (one per rated bank)

---

- [ ] U5. **Implement API routes**

**Goal:** Create the three Next.js Route Handlers that expose bank data as JSON.

**Requirements:** R2

**Dependencies:** U3, U4

**Files:**
- Create: `app/api/banks/route.ts`
- Create: `app/api/banks/[slug]/route.ts`
- Create: `app/api/banks/[slug]/products/route.ts`

**Approach:**
- `GET /api/banks`: query all active banks, support optional `?type=state|private_domestic|foreign` and `?limit=N` params; return `{ banks: Bank[] }`
- `GET /api/banks/[slug]`: look up by `short_code` (case-insensitive); return `{ bank: Bank }` or 404 JSON
- `GET /api/banks/[slug]/products`: returns `{ products: [] }` (empty until products are seeded); correct shape for forward compatibility
- All routes return `NextResponse.json(...)` with appropriate status codes
- No auth required — public routes

**Test scenarios:**
- Happy path: `GET /api/banks` returns 200 with array of 24 banks
- Happy path: `GET /api/banks?type=state` returns 3 banks
- Happy path: `GET /api/banks?limit=8` returns 8 banks
- Happy path: `GET /api/banks/samp` returns Sampath Bank data
- Happy path: `GET /api/banks/SAMP` (uppercase) returns same result (case-insensitive slug)
- Error path: `GET /api/banks/nonexistent` returns 404 `{ error: 'Bank not found' }`
- Happy path: `GET /api/banks/samp/products` returns 200 `{ products: [] }`

**Verification:**
- `curl https://bank-compare-ui-6xpl2wt3ma-as.a.run.app/api/banks` returns 24 banks after deploy
- `curl .../api/banks/boc` returns Bank of Ceylon with `fitch_rating: 'AA(lka)'`

---

- [ ] U6. **Convert bank pages to Server Components and wire to DB**

**Goal:** Remove `mock-data` imports from `app/banks/page.tsx`, `app/banks/[slug]/page.tsx`, and `components/banks/BankDirectory.tsx`. Pages fetch from DB directly; `BankDirectory` becomes prop-fed.

**Requirements:** R3, R4, R5

**Dependencies:** U3, U4, U5

**Files:**
- Modify: `app/banks/page.tsx`
- Modify: `app/banks/[slug]/page.tsx`
- Modify: `components/banks/BankDirectory.tsx`
- Modify: `app/page.tsx`

**Approach:**
- `app/banks/page.tsx`: remove `'use client'`; make it an async Server Component; query `db.select().from(banks)` directly; pass bank array as prop to `BankDirectory`
- `app/banks/[slug]/page.tsx`: remove `'use client'`; async Server Component; query by slug; render with real data or return `notFound()`
- `components/banks/BankDirectory.tsx`: remove `getBanksByType` import; accept `banks: Bank[]` prop; keep all interactive filtering logic client-side (filtering happens in component state over the prop data)
- `app/page.tsx`: pass initial banks prop to `BankDirectory` (fetched server-side, limited to 8)
- No mock-data imports remain in any of these four files

**Test scenarios:**
- Happy path: `/banks` renders all 24 banks with correct names and risk tiers
- Happy path: filtering by "State Banks" shows exactly BOC, People's Bank, and one other state bank
- Happy path: `/banks/samp` renders Sampath Bank detail page with `AA-(lka)` rating
- Error path: `/banks/nonexistent-slug` renders a not-found state (via `notFound()`)
- Edge path: banks with no Fitch rating display "Not Rated" or equivalent in the UI

**Verification:**
- No import of `mock-data` in `app/banks/page.tsx`, `app/banks/[slug]/page.tsx`, `components/banks/BankDirectory.tsx`, or `app/page.tsx`
- `/banks` page loads in browser and shows 24 banks
- `/banks/boc` loads and shows Bank of Ceylon

---

## System-Wide Impact

- **Unchanged pages**: `/compare`, `/products`, `/best-fixed-deposit-rates`, `/expat-bank-accounts`, `FeaturedRates.tsx`, `app/assistant/page.tsx` — all remain on mock data; not touched
- **`lib/mock-data.ts` retained**: still imported by product-related pages; do not delete
- **`types/index.ts` Bank interface**: Drizzle schema types must remain structurally compatible; if Drizzle infers slightly different nullability, update `types/index.ts` rather than the schema
- **Connection pool on Cloud Run**: Cloud Run scales to zero; each cold-start creates a new pool. The globalThis singleton is per-instance — this is correct behavior, not a bug
- **Build-time DB access**: Server Components call the DB at request time, not build time. `next build` will succeed without a DB connection. Drizzle imports are tree-shaken from client bundles

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Cloud SQL Auth Proxy socket not mounted in Cloud Run | Already configured in Terraform via `cloud_sql_instance` volume — confirmed working |
| `DATABASE_URL` missing at runtime | Client singleton throws with clear message; Secret Manager version confirmed in place |
| Drizzle type mismatch with existing `Bank` interface | Validate schema types against `types/index.ts` in U2; update interface if needed |
| Cold-start latency with new DB connection | Acceptable for MVP; Cloud Run min-instances can be set to 1 if latency becomes an issue |
| `db-f1-micro` connection limits under load | Max 50 connections set; Drizzle pool defaults to 10; safe for current scale |

---

## Documentation / Operational Notes

- Add `DATABASE_URL` to local `.env.local` for development (not committed — already in `.gitignore`)
- Migration must be run manually once against Cloud SQL before or alongside the first deploy that includes U6 — add a note in the handover doc
- To run migration against Cloud SQL locally: start Cloud SQL Auth Proxy, set `DATABASE_URL` to local socket, run `npm run db:migrate`
- Seed script is safe to re-run (`onConflictDoNothing`)

---

## Sources & References

- **Origin document:** [docs/brainstorms/data-layer-requirements.md](../brainstorms/data-layer-requirements.md)
- CBSL bank list: https://www.cbsl.gov.lk/en/authorized-financial-institutions/licensed-commercial-banks
- Existing mock data: `lib/mock-data.ts`
- Existing types: `types/index.ts`
- Terraform DB config: `terraform/main.tf`
- Planning schema reference: `planning/technical-architecture.md` lines 53–99

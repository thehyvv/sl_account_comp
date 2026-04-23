# Data Layer — Requirements Document

**Date:** 2026-04-23  
**Status:** Ready for planning  
**Scope:** Standard

---

## Problem

The frontend is live but running entirely on mock data (`lib/mock-data.ts` — 15 banks, 8 products). The bank directory, comparison tool, and product pages all serve hardcoded values. The data layer needs to be built so real data from the CBSL registry can be stored, queried, and served to the application.

---

## Goals

1. Replace mock data with a real PostgreSQL database on Cloud SQL
2. Seed all 24 CBSL-licensed commercial banks with accurate data
3. Expose bank data via Next.js API routes consumed by the existing frontend pages
4. Establish the schema foundation that products, rates, and AI queries will build on later

---

## Out of Scope

- Product/rate data (FDs, savings accounts, fees) — deferred to next iteration
- Automated scraping pipeline — deferred; seed data is manually curated
- Admin UI for data management — deferred
- Fitch/Moody's live scraping — ratings seeded from planning docs, updated manually for now
- User auth, saved comparisons, rate alerts

---

## Data Sources

### Bank List
- **Source:** https://www.cbsl.gov.lk/en/authorized-financial-institutions/licensed-commercial-banks
- **Format:** Numbered HTML table, 24 banks, includes name + website URL
- **As of:** December 2025 (CBSL last updated)
- **Gaps:** No ratings, no short codes, no risk scores on CBSL page

### Ratings & Risk Data
- **Source:** `planning/bank-data-schema.md` (manually researched)
- **Contains:** Fitch ratings for all 24 banks, bank type classification, risk tier
- **Note:** Some foreign banks (Deutsche, Indian Bank, IOB, SBI, MCB, Mashreq, Public Bank, Bank of China) have no Fitch rating — risk tier computed from CBSL classification + bank type

### Corrections vs Mock Data
The CBSL official list differs from the current mock data in two ways:
- **NDB (National Development Bank)** is in the official list but missing from mock data
- **National Savings Bank (NSB)** is in the mock data but is a *specialised bank*, not a licensed commercial bank — should be excluded from this table or flagged correctly
- **Bank of China** and **Public Bank Berhad** are official but absent from mock data

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data scope | Banks only (no products yet) | Unblocks bank directory; products need scraping strategy |
| ORM | Drizzle ORM | Type-safe, lightweight, schema-as-code migrations, Next.js native |
| Ratings source | Hardcoded from planning docs | Accurate for MVP; live scraping deferred |
| API location | Next.js API routes (`app/api/`) | Single codebase, already on Cloud Run |
| DB connection | Cloud SQL Auth Proxy socket | Already configured in Cloud Run via Terraform |

---

## Schema (Banks Layer)

Two tables in scope for this iteration:

**`banks`** — core institution data  
**`bank_rating_history`** — audit trail of rating changes (seed with current ratings as initial entry)

Full SQL definition in `planning/technical-architecture.md` lines 53–99.

Drizzle schema lives in `lib/db/schema.ts`. Migrations in `lib/db/migrations/`.

---

## API Routes

Three endpoints needed to replace mock data calls:

| Route | Replaces | Notes |
|-------|----------|-------|
| `GET /api/banks` | `mockBanks` array | Supports `?type=state\|private\|foreign` filter |
| `GET /api/banks/[slug]` | `getBankById()` | Slug derived from `short_code` lowercased |
| `GET /api/banks/[slug]/products` | `getProductsByBankId()` | Returns empty array until products are seeded |

---

## Seed Data — 24 Licensed Commercial Banks

All 24 banks from the CBSL December 2025 registry:

| # | Name | Short Code | Type | Fitch Rating | Risk Tier |
|---|------|-----------|------|--------------|-----------|
| 1 | Amana Bank PLC | AMANA | private_domestic | A(lka) | low |
| 2 | Bank of Ceylon | BOC | state | AA(lka) | low |
| 3 | Bank of China Ltd | BOC-CN | foreign | — | moderate |
| 4 | Cargills Bank PLC | CARG | private_domestic | BBB(lka) | moderate |
| 5 | Citibank N.A. | CITI | foreign | AA+(lka) | low |
| 6 | Commercial Bank of Ceylon PLC | COMB | private_domestic | AA-(lka) | low |
| 7 | Deutsche Bank AG | DB | foreign | — | moderate |
| 8 | DFCC Bank PLC | DFCC | private_domestic | A+(lka) | low |
| 9 | Habib Bank Ltd | HBL | foreign | — | moderate |
| 10 | Hatton National Bank PLC | HNB | private_domestic | AA-(lka) | low |
| 11 | Indian Bank | IB | foreign | — | moderate |
| 12 | Indian Overseas Bank | IOB | foreign | — | moderate |
| 13 | MCB Bank Ltd | MCB | foreign | — | moderate |
| 14 | National Development Bank PLC | NDB | private_domestic | — | moderate |
| 15 | Nations Trust Bank PLC | NTB | private_domestic | A(lka) | low |
| 16 | Pan Asia Banking Corporation PLC | PABC | private_domestic | BBB-(lka) | moderate |
| 17 | People's Bank | PB | state | AA(lka) | low |
| 18 | Public Bank Berhad | PBB | foreign | — | moderate |
| 19 | Sampath Bank PLC | SAMP | private_domestic | AA-(lka) | low |
| 20 | Seylan Bank PLC | SEYB | private_domestic | A-(lka) | low |
| 21 | Standard Chartered Bank | SCB | foreign | AA+(lka) | low |
| 22 | State Bank of India | SBI | foreign | — | moderate |
| 23 | HSBC | HSBC | foreign | AA(lka) | low |
| 24 | Union Bank of Colombo PLC | UB | private_domestic | BBB+(lka) | moderate |

---

## Frontend Integration

Existing pages that consume mock data and need to switch to API calls:

| Page | Current data source | After |
|------|--------------------|----|
| `app/banks/page.tsx` | `mockBanks` via `BankDirectory` component | `GET /api/banks` |
| `app/banks/[slug]/page.tsx` | `getBankById()` | `GET /api/banks/[slug]` |
| `app/page.tsx` (hero) | `mockBanks` via `BankDirectory` | `GET /api/banks?limit=8` |
| `components/banks/BankDirectory.tsx` | `mockBanks` directly | prop-fed or SWR fetch |

The compare and products pages use products data — they can remain on mock data until the next iteration.

---

## Success Criteria

- All 24 CBSL banks exist in the `bankcompare` database
- `GET /api/banks` returns accurate bank data with correct types and ratings
- Bank directory page (`/banks`) renders from real DB data with no mock imports
- Bank detail page (`/banks/[slug]`) renders from real DB data
- Existing mock data file retained but no longer imported by any page
- DB migrations are version-controlled and re-runnable

---

## Dependencies & Assumptions

- Cloud SQL instance `bank-compare-db` is already running (confirmed via Terraform)
- `DATABASE_URL` secret is set in Secret Manager (confirmed)
- Cloud Run service account has `cloudsql.client` role (confirmed via Terraform)
- Drizzle can connect to Cloud SQL via Unix socket (`/cloudsql/...`) in Cloud Run — standard pattern, verified in Drizzle docs
- For local development, Cloud SQL Auth Proxy must be running locally OR a `DATABASE_URL` pointing to a local postgres instance is used

---

*Requirements captured: 2026-04-23*

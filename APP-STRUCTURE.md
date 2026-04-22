# BankCompare SL - Complete UI Structure

## All Pages Built

### 1. Landing Page (`/`)
- Hero section with trust badges
- AI search with quick filters
- Featured rates showcase (4 best FDs)
- Bank directory preview (8 banks + "more")
- Dual audience cards (Residents vs Expats)
- How It Works section (3 steps)
- CTA section

### 2. Bank Directory (`/banks`)
- Full list of all banks (24)
- Filter by type: All, State, Private, Foreign
- Search by name
- Risk level legend
- Rating methodology explanation
- Shows: Bank name, type, Fitch rating, risk level, products count

### 3. Bank Detail (`/banks/[slug]`)
- Bank header with logo, name, rating
- Key stats: Fitch rating, Moody's rating, risk score, products count
- Product cards (FDs, savings, etc.)
- Sidebar: Bank info, rating history, disclaimer
- Features: Online banking, ATM card, foreign currency support

### 4. Product Comparison (`/compare`)
- Add/remove products (up to 4)
- Product selector dropdown
- Side-by-side comparison table
- Highlights differences (amber background)
- Shows: Interest rates, fees, features (yes/no)
- Comparison tips section

### 5. Product Listing (`/products`)
- All products from all banks
- Filter by category: All, Savings, Fixed Deposits, Foreign Currency, Remittance
- Search by product or bank name
- Sort by: Highest rate, lowest min deposit, bank name
- Shows: Bank, product name, interest rate, senior rate, min deposit, features

### 6. AI Assistant (`/assistant`)
- Natural language search
- Query summary with parsed parameters
- Top 3 recommendations with:
  - Match score (%)
  - Key benefits
  - Trade-offs/considerations
  - Explanation
- Follow-up questions to refine results
- Example queries section

## Backend Requirements Discovered

### API Endpoints Needed

```typescript
// Banks
GET /api/banks                     // List all banks
GET /api/banks/:id                 // Bank detail with products
GET /api/banks/:id/ratings         // Rating history

// Products
GET /api/products                  // List all products (with filters)
GET /api/products/best-rates       // Top rates by category
GET /api/products/compare          // Compare specific products

// AI
POST /api/recommend                // AI recommendation
POST /api/recommend/follow-up      // Answer follow-up question

// Scraping (internal)
POST /api/scrape/trigger           // Manual scrape trigger
GET /api/scrape/status             // Scraping status
```

### Database Queries Needed

1. **Bank listing with filters**
   - Filter by: bank_type, risk_tier
   - Sort by: name, risk_score
   - Search: name, short_code

2. **Products with bank info**
   - JOIN with banks table
   - Filter by: category, bank_id, min_balance range
   - Sort by: interest_rate, min_deposit
   - Pagination support

3. **Comparison query**
   - Fetch multiple products by ID
   - Normalize data for comparison
   - Calculate differences

4. **AI recommendation**
   - Filter by: category, tenure, target_audience
   - Sort by: interest_rate DESC, risk_score ASC
   - Weighted scoring based on user preferences

### Data Normalization Needed

From comparison page:
- All banks must have consistent `features` structure
- Numeric values need consistent formatting
- Missing data handling (N/A display)
- Risk tier calculation from ratings

## Component Structure

```
components/
├── ai/
│   └── AISearch.tsx           # Search input with filters
├── banks/
│   └── BankDirectory.tsx      # Bank grid with filters
├── comparison/
│   └── (not built yet)        # Could extract from compare/page.tsx
├── layout/
│   ├── Header.tsx             # Navigation
│   └── Footer.tsx             # Footer with disclaimer
├── rates/
│   └── FeaturedRates.tsx      # Best rates cards
└── sections/
    └── HowItWorks.tsx         # 3-step process
```

## Design System

### Colors
- Primary: Emerald (#10b981) - trust, finance
- Accent: Amber (#f59e0b) - CTAs, highlights
- Neutral: Stone scale (#fafaf9 to #1c1917)
- Risk: Green (low) → Amber (moderate) → Red (high)

### Typography
- Display: Playfair Display (headlines)
- Body: Plus Jakarta Sans (UI text)

### Components
- `card-base`: White bg, subtle border, hover shadow
- `btn-primary`: Emerald bg, white text
- `btn-secondary`: White bg, emerald border
- `badge`: Rounded pill with contextual colors
- `search-input`: Large rounded input with focus ring

## Next Steps for Backend

1. **Database Schema** - Based on `types/index.ts`
2. **API Routes** - Implement endpoints above
3. **Scraping System** - Collect bank data
4. **AI Integration** - Connect Claude API
5. **Authentication** (optional) - Save comparisons

## File Count

- **App pages**: 7
- **Components**: 8
- **Utils/Mock data**: 3
- **Config**: 5
- **Total**: 23 files

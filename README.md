# BankCompare SL - UI Prototype

This is the UI-first prototype for the Sri Lankan Bank Account Comparison application.

## Project Structure

```
bank-compare-ui/
├── app/
│   ├── globals.css          # Global styles with custom design system
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Main landing page
├── components/
│   ├── ai/
│   │   └── AISearch.tsx     # AI-powered search with quick filters
│   ├── banks/
│   │   └── BankDirectory.tsx # Bank directory with filters
│   ├── layout/
│   │   ├── Header.tsx       # Navigation header
│   │   └── Footer.tsx       # Footer with disclaimer
│   ├── rates/
│   │   └── FeaturedRates.tsx # Best rates showcase
│   └── sections/
│       └── HowItWorks.tsx  # 3-step process explanation
├── lib/
│   ├── mock-data.ts        # Mock data for 15 banks
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
└── ...config files
```

## UI Components Overview

### 1. Hero Section (`page.tsx`)
- Trust badges (24 banks, daily updates, etc.)
- Main headline with gradient text
- Dual audience cards (Residents vs Expats)

### 2. AI Search (`AISearch.tsx`)
- Natural language input
- Quick filter chips
- Example queries
- Search state management

### 3. Featured Rates (`FeaturedRates.tsx`)
- 4-card grid of best FD rates
- Risk badges
- Fitch ratings display
- Senior citizen rates

### 4. Bank Directory (`BankDirectory.tsx`)
- Filterable by bank type (State/Private/Foreign)
- 8-bank preview grid
- "+16 more" CTA card
- Rating display

### 5. How It Works (`HowItWorks.tsx`)
- 3-step visual process
- Animated cards
- Trust indicators

## Data Structure

The UI expects these TypeScript types:

```typescript
// Core Types
interface Bank {
  id: string;
  name: string;
  shortCode: string;
  bankType: 'state' | 'private_domestic' | 'foreign';
  fitchRating?: string;
  cbslCategory: string;
  riskScore: number;
  riskTier: 'low' | 'moderate' | 'elevated' | 'high';
}

interface Product {
  id: string;
  bankId: string;
  category: 'savings' | 'fixed_deposit' | 'foreign_currency';
  name: string;
  interestRateRegular: number;
  interestRateSenior?: number;
  minBalanceLkr?: number;
  minDepositLkr?: number;
  fdTenureMinMonths?: number;
  fdTenureMaxMonths?: number;
  features: ProductFeatures;
}
```

## Running the Project

```bash
npm install
npm run dev
```

## Design System

- **Primary**: Emerald green (#10b981) - trust, finance
- **Accent**: Amber/Gold (#f59e0b) - highlights, CTAs
- **Display Font**: Playfair Display (headlines)
- **Body Font**: Plus Jakarta Sans (UI text)
- **Cards**: White bg, subtle borders, hover shadows
- **Risk Colors**: Green (low) → Amber (moderate) → Red (high)

## Next Steps for Backend Integration

1. Replace mock data with real API calls
2. Implement AI recommendation API
3. Add rate history charts
4. Build product detail pages
5. Create comparison tool

## License

MIT

export interface Bank {
  id: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  shortCode: string;
  websiteUrl: string;
  logoUrl?: string;
  bankType: 'state' | 'private_domestic' | 'foreign' | 'regional';
  fitchRating?: string;
  moodyRating?: string;
  cbslCategory: string;
  riskScore: number;
  riskTier: 'low' | 'moderate' | 'elevated' | 'high';
  isActive: boolean;
}

export interface Product {
  id: string;
  bankId: string;
  bank?: Bank;
  category: 'savings' | 'fixed_deposit' | 'current' | 'remittance' | 'foreign_currency';
  subcategory?: string;
  name: string;
  description?: string;
  targetAudience: ('residents' | 'expats' | 'seniors' | 'students' | 'business')[];
  interestRateRegular: number;
  interestRateSenior?: number;
  interestCalculationMethod?: string;
  interestPaymentFrequency?: string;
  minBalanceLkr?: number;
  minBalanceUsd?: number;
  minDepositLkr?: number;
  minDepositUsd?: number;
  monthlyFeeLkr?: number;
  annualFeeLkr?: number;
  fdTenureMinMonths?: number;
  fdTenureMaxMonths?: number;
  fdAllowedTenures?: number[];
  features: ProductFeatures;
  isActive: boolean;
  lastVerifiedDate?: string;
}

export interface ProductFeatures {
  onlineBanking: boolean;
  mobileApp: boolean;
  atmCard?: string;
  chequeBook: boolean;
  standingOrders: boolean;
  smsAlerts: boolean;
  foreignCurrency: boolean;
  currencies?: string[];
  autoRenewal?: boolean;
  loanFacility?: boolean;
}

export interface RateDisplay {
  product: Product;
  bank: Bank;
  effectiveRate: number;
  tenureLabel?: string;
}

export interface ComparisonQuery {
  id?: string;
  naturalLanguageQuery: string;
  parsedIntent?: string;
  userType?: 'resident' | 'expat' | 'senior' | 'business';
  productCategory?: string;
  investmentAmountLkr?: number;
  investmentAmountUsd?: number;
  tenureMonths?: number;
  priorityCriteria?: string[];
  recommendations?: Recommendation[];
  followUpQuestions?: FollowUpQuestion[];
}

export interface Recommendation {
  rank: number;
  product: Product;
  bank: Bank;
  matchScore: number;
  keyBenefits: string[];
  tradeOffs?: string[];
  explanation: string;
}

export interface FollowUpQuestion {
  question: string;
  options?: string[];
  required: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export type BankTypeFilter = 'all' | 'state' | 'private' | 'foreign';
export type ProductCategoryFilter = 'all' | 'savings' | 'fixed_deposit' | 'current' | 'foreign_currency' | 'remittance';

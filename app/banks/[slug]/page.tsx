'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { mockBanks, mockProducts } from '@/lib/mock-data';
import { Bank, Product } from '@/types';
import {
  Building2, Globe, Phone, ExternalLink, Shield, TrendingUp, ChevronRight,
  Star, AlertCircle, Clock, CheckCircle, Info
} from 'lucide-react';
import { cn, formatPercentage, formatCurrency, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';

// Mock function to get bank by slug
function getBankBySlug(slug: string): Bank | undefined {
  return mockBanks.find(b => b.shortCode.toLowerCase() === slug.toLowerCase());
}

function getProductsByBankId(bankId: string): Product[] {
  return mockProducts.filter(p => p.bankId === bankId);
}

interface ProductCardProps {
  product: Product;
  bank: Bank;
}

function ProductCard({ product, bank }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-lg hover:border-emerald-300 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-stone-900">{product.name}</h3>
          <p className="text-sm text-stone-500 capitalize">{product.category.replace('_', ' ')}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-700">
            {formatPercentage(product.interestRateRegular)}
          </div>
          <p className="text-xs text-stone-500">p.a.</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {product.minDepositLkr && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Min Deposit</span>
            <span className="font-medium">{formatCurrency(product.minDepositLkr)}</span>
          </div>
        )}

        {product.minBalanceLkr && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Min Balance</span>
            <span className="font-medium">{formatCurrency(product.minBalanceLkr)}</span>
          </div>
        )}

        {product.fdTenureMinMonths && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Tenure</span>
            <span className="font-medium">{product.fdTenureMinMonths}-{product.fdTenureMaxMonths} months</span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.features.onlineBanking && (
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">Online Banking</span>
        )}
        {product.features.mobileApp && (
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">Mobile App</span>
        )}
        {product.features.foreignCurrency && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Foreign Currency</span>
        )}
      </div>

      <button className="w-full py-2.5 bg-stone-100 text-stone-700 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2">
        Compare This Product
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function BankDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const bank = getBankBySlug(slug);
  const products = bank ? getProductsByBankId(bank.id) : [];

  if (!bank) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="container-custom py-16 text-center">
          <Building2 className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Bank Not Found</h1>
          <p className="text-stone-600">The bank you&apos;re looking for doesn&apos;t exist in our directory.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero / Bank Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Bank Logo */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl font-bold text-white">{bank.shortCode}</span>
              </div>

              {/* Bank Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                    {bank.name}
                  </h1>
                  <span className={cn("badge", getRiskBadgeClass(bank.riskTier))}>
                    {getRiskLabel(bank.riskTier)}
                  </span>
                </div>
                <p className="text-stone-600">{bank.cbslCategory} • Licensed by Central Bank of Sri Lanka</p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={bank.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Compare Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Stats */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Fitch Rating */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <Shield className="w-4 h-4" />
                Fitch Rating
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {bank.fitchRating || 'Not Rated'}
              </div>
              {bank.fitchRating && (
                <p className="text-sm text-emerald-600 mt-1">Stable Outlook</p>
              )}
            </div>

            {/* Moody's Rating */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <Star className="w-4 h-4" />
                Moody&apos;s Rating
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {bank.moodyRating || 'Not Rated'}
              </div>
              {bank.moodyRating && (
                <p className="text-sm text-emerald-600 mt-1">Stable Outlook</p>
              )}
            </div>

            {/* Risk Score */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                Risk Score
              </div>
              <div className="text-2xl font-bold text-stone-900">{bank.riskScore}/100</div>
              <p className="text-sm text-stone-500 mt-1">Lower is better</p>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <CheckCircle className="w-4 h-4" />
                Products
              </div>
              <div className="text-2xl font-bold text-stone-900">{products.length}</div>
              <p className="text-sm text-stone-500 mt-1">Active accounts</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-900 font-display">Available Products</h2>
                <div className="flex gap-2">
                  {['All', 'Fixed Deposit', 'Savings'].map((filter) => (
                    <button
                      key={filter}
                      className="px-3 py-1.5 text-sm rounded-lg bg-white border border-stone-200 hover:border-emerald-300 transition-colors"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} bank={bank} />
                ))}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              {/* Bank Info */}
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-900 mb-4">Bank Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-stone-500">Type</p>
                    <p className="font-medium text-stone-900 capitalize">{bank.bankType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Short Code</p>
                    <p className="font-medium text-stone-900">{bank.shortCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">CBSL License</p>
                    <p className="font-medium text-stone-900">Active</p>
                  </div>
                </div>
              </div>

              {/* Rating History */}
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-900 mb-4">Rating History</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-stone-600">Current</span>
                    </div>
                    <span className="font-medium">{bank.fitchRating || 'N/A'}</span>
                  </div>
                </div>
                <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View Full History →
                </button>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    All information is sourced from public data. Rates and terms are subject to change.
                    Please verify directly with {bank.name} before making decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

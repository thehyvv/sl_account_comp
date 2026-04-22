'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProductsWithBanks } from '@/lib/mock-data';
import { Product, ProductCategoryFilter, Bank } from '@/types';
import {
  Package, Search, Filter, SlidersHorizontal, ChevronRight,
  TrendingUp, Building2, PiggyBank, Coins, ArrowRightLeft
} from 'lucide-react';
import { cn, formatPercentage, formatCurrency, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';

const categoryFilters: { value: ProductCategoryFilter; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Products', icon: <Package className="w-4 h-4" /> },
  { value: 'savings', label: 'Savings', icon: <PiggyBank className="w-4 h-4" /> },
  { value: 'fixed_deposit', label: 'Fixed Deposits', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'foreign_currency', label: 'Foreign Currency', icon: <Coins className="w-4 h-4" /> },
  { value: 'remittance', label: 'Remittance', icon: <ArrowRightLeft className="w-4 h-4" /> },
];

interface ProductListItemProps {
  product: Product & { bank: Bank };
}

function ProductListItem({ product }: ProductListItemProps) {
  return (
    <div className="group bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Bank & Product Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-700 font-bold text-xs shrink-0">
            {product.bank.shortCode}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-stone-600">{product.bank.name}</span>
              <span className="text-stone-300">•</span>
              <span className="text-sm text-stone-500 capitalize">{product.category.replace('_', ' ')}</span>
              <span className="text-stone-300">•</span>
              <span className={cn("badge text-xs", getRiskBadgeClass(product.bank.riskTier))}>
                {getRiskLabel(product.bank.riskTier)}
              </span>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="flex flex-wrap items-center gap-6 lg:w-auto">
          <div className="min-w-[100px]">
            <p className="text-xs text-stone-500 mb-1">Interest Rate</p>
            <div className="text-2xl font-bold text-emerald-700">
              {formatPercentage(product.interestRateRegular)}
            </div>
            <p className="text-xs text-stone-500">p.a.</p>
          </div>

          {product.interestRateSenior && (
            <div className="min-w-[100px]">
              <p className="text-xs text-stone-500 mb-1">Senior Rate</p>
              <div className="text-xl font-semibold text-amber-600">
                {formatPercentage(product.interestRateSenior)}
              </div>
              <p className="text-xs text-stone-500">55+ years</p>
            </div>
          )}

          {product.minDepositLkr && (
            <div className="min-w-[100px]">
              <p className="text-xs text-stone-500 mb-1">Min Deposit</p>
              <div className="text-lg font-semibold text-stone-900">
                {formatCurrency(product.minDepositLkr)}
              </div>
            </div>
          )}

          {product.minBalanceLkr && (
            <div className="min-w-[100px]">
              <p className="text-xs text-stone-500 mb-1">Min Balance</p>
              <div className="text-lg font-semibold text-stone-900">
                {formatCurrency(product.minBalanceLkr)}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-stone-100 text-stone-700 font-medium rounded-lg hover:bg-stone-200 transition-colors">
            Details
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            Compare
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Features Bar */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
        {product.features.onlineBanking && (
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">Online Banking</span>
        )}
        {product.features.mobileApp && (
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">Mobile App</span>
        )}
        {product.features.foreignCurrency && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Foreign Currency</span>
        )}
        {product.targetAudience.includes('expats') && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Expat Friendly</span>
        )}
        {product.targetAudience.includes('seniors') && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Senior Benefits</span>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rate' | 'bank' | 'min_deposit'>('rate');

  const allProducts = getProductsWithBanks();

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.bank.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'rate':
        return b.interestRateRegular - a.interestRateRegular;
      case 'bank':
        return a.bank.name.localeCompare(b.bank.name);
      case 'min_deposit':
        return (a.minDepositLkr || Infinity) - (b.minDepositLkr || Infinity);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero */}
        <div className="container-custom mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Package className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">All Products</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3 font-display">
              Browse All Banking Products
            </h1>
            <p className="text-stone-600">
              Filter and sort through savings accounts, fixed deposits, and foreign currency accounts from all 24 licensed banks.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="container-custom mb-8">
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveCategory(filter.value)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeCategory === filter.value
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-100">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or banks..."
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rate' | 'bank' | 'min_deposit')}
                  className="px-3 py-2.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="rate">Highest Rate</option>
                  <option value="min_deposit">Lowest Min Deposit</option>
                  <option value="bank">Bank Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="container-custom mb-6">
          <p className="text-sm text-stone-600">
            Showing <span className="font-medium text-stone-900">{sortedProducts.length}</span> products
            {activeCategory !== 'all' && (
              <> in <span className="font-medium text-stone-900 capitalize">{activeCategory.replace('_', ' ')}</span></>
            )}
          </p>
        </div>

        {/* Product List */}
        <div className="container-custom">
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-900 mb-2">No Products Found</h3>
              <p className="text-stone-600">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="container-custom mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/banks"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="font-medium text-stone-900">Browse by Bank</p>
                <p className="text-sm text-stone-500">View all 24 banks</p>
              </div>
            </a>

            <a
              href="/compare"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-emerald-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Filter className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="font-medium text-stone-900">Compare Products</p>
                <p className="text-sm text-stone-500">Side-by-side comparison</p>
              </div>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

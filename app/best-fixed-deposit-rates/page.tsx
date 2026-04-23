import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProductsWithBanks } from '@/lib/mock-data';
import { formatPercentage, formatCurrency, formatTenure, cn, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';
import { TrendingUp, Clock, Shield, AlertCircle, Calendar, ChevronRight, Info } from 'lucide-react';

export const metadata = {
  title: 'Best Fixed Deposit Rates Sri Lanka 2024 | Compare 24 Banks',
  description: 'Find the highest fixed deposit interest rates from all licensed Sri Lankan banks. Compare FD rates for 6 months, 1 year, 2 years, and 5 years. Updated daily.',
  keywords: 'fixed deposit rates sri lanka, best fd rates, highest interest rates, bank fd rates 2024',
};

export default function BestFixedDepositRatesPage() {
  const allProducts = getProductsWithBanks().filter(p => p.category === 'fixed_deposit');
  const bestRates = [...allProducts].sort((a, b) => b.interestRateRegular - a.interestRateRegular).slice(0, 10);

  const tenureOptions = [
    { months: 6, label: '6 Months' },
    { months: 12, label: '1 Year' },
    { months: 24, label: '2 Years' },
    { months: 36, label: '3 Years' },
    { months: 60, label: '5 Years' },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero Section */}
        <div className="container-custom mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Updated Daily
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4 font-display">
              Best Fixed Deposit Rates in Sri Lanka
            </h1>

            <p className="text-lg text-stone-600 mb-6">
              Compare the highest FD interest rates from all 24 licensed banks.
              Find the best returns for your savings with our daily updated comparison.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                CBSL Licensed Banks
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Rates Updated Daily
              </span>
              <span className="flex items-center gap-1">
                <Info className="w-4 h-4" />
                Free Comparison
              </span>
            </div>
          </div>
        </div>

        {/* Quick Filters by Tenure */}
        <div className="container-custom mb-8">
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-sm text-stone-600 mb-3">Filter by tenure:</p>
            <div className="flex flex-wrap gap-2">
              <a href="#all" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                All FDs
              </a>
              {tenureOptions.map((option) => (
                <a
                  key={option.months}
                  href={`#${option.months}-months`}
                  className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 rounded-lg text-sm font-medium transition-colors"
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Top 10 Rates Table */}
        <div className="container-custom mb-12">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-6 border-b border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Top 10 Fixed Deposit Rates</h2>
                  <p className="text-sm text-stone-500 mt-1">Sorted by highest interest rate</p>
                </div>
                <button className="btn-secondary">
                  Compare All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Rank</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Bank</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Product</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Interest Rate</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Min Deposit</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bestRates.map((product, index) => {
                    const bank = (product as { bank: { name: string; shortCode: string; riskTier: string; fitchRating?: string } }).bank;
                    return (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                            index === 0 ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-700"
                          )}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                              {bank.shortCode}
                            </div>
                            <div>
                              <p className="font-medium text-stone-900">{bank.name}</p>
                              {bank.fitchRating && (
                                <p className="text-xs text-stone-500">Fitch: {bank.fitchRating}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-stone-900">{product.name}</p>
                          <p className="text-xs text-stone-500">
                            {product.fdTenureMinMonths}-{product.fdTenureMaxMonths} months
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-2xl font-bold text-emerald-700">
                            {formatPercentage(product.interestRateRegular)}
                          </div>
                          <p className="text-xs text-stone-500">p.a.</p>
                          {product.interestRateSenior && (
                            <p className="text-xs text-amber-600 mt-1">
                              Seniors: {formatPercentage(product.interestRateSenior)}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-stone-900">
                            {product.minDepositLkr ? formatCurrency(product.minDepositLkr) : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn("badge text-xs", getRiskBadgeClass(bank.riskTier))}>
                            {getRiskLabel(bank.riskTier)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`/products/${product.id}`}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                          >
                            View →
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* What is FD */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Info className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-lg font-bold text-stone-900">What is a Fixed Deposit?</h2>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                A fixed deposit (FD) is a financial instrument where you deposit a lump sum amount
                with a bank for a fixed period at a predetermined interest rate. It offers higher
                returns than regular savings accounts in exchange for locking your money for the
                agreed tenure.
              </p>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Higher interest rates than savings accounts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Guaranteed returns (not market-linked)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  Flexible tenures from 1 month to 5 years
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">!</span>
                  Early withdrawal penalties apply
                </li>
              </ul>
            </div>

            {/* FD Tips */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-700" />
                </div>
                <h2 className="text-lg font-bold text-stone-900">How to Choose the Best FD</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-stone-900 text-sm">1. Compare Interest Rates</h3>
                  <p className="text-sm text-stone-600">
                    Even a 0.5% difference can mean significant returns on larger deposits over time.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 text-sm">2. Check Bank Stability</h3>
                  <p className="text-sm text-stone-600">
                    Look for Fitch or Moody&apos;s ratings. State banks and large private banks offer more security.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 text-sm">3. Consider Your Timeline</h3>
                  <p className="text-sm text-stone-600">
                    Longer tenures usually offer higher rates, but ensure you won&apos;t need the money early.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 text-sm">4. Senior Citizen Benefits</h3>
                  <p className="text-sm text-stone-600">
                    If you&apos;re 55+, you may qualify for 0.25-0.5% additional interest.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Interest rates are subject to change. Please verify current rates
                  directly with the bank before opening an FD. This page is for informational purposes only
                  and does not constitute financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

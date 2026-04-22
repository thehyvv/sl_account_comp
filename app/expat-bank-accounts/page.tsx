import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProductsWithBanks } from '@/lib/mock-data';
import { formatPercentage, formatCurrency, cn, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';
import { Globe, Plane, Shield, CheckCircle, AlertCircle, ChevronRight, Building2, Wallet } from 'lucide-react';

export const metadata = {
  title: 'Best Bank Accounts for Expats | Sri Lankans Living Abroad 2024',
  description: 'Compare bank accounts for Sri Lankans living abroad. Foreign currency accounts, NRFC accounts, and inward remittance services. Open from overseas.',
  keywords: 'expat bank account sri lanka, nRFC account, foreign currency account, sri lankans abroad, inward remittance',
};

export default function ExpatBankAccountsPage() {
  const expatProducts = getProductsWithBanks().filter(p =>
    p.targetAudience.includes('expats') || p.features.foreignCurrency
  );

  const fcProducts = expatProducts.filter(p => p.features.foreignCurrency);
  const nRFCProducts = expatProducts.filter(p => p.category === 'foreign_currency');

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero */}
        <div className="container-custom mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              For Sri Lankans Living Abroad
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4 font-display">
              Best Bank Accounts for Expats
            </h1>

            <p className="text-lg text-stone-600 mb-6">
              Compare accounts designed for Sri Lankans living overseas. Foreign currency accounts,
              NRFC facilities, and inward remittance services to manage your money from abroad.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                Open from Overseas
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                USD/GBP/EUR Accounts
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                CBSL Regulated
              </span>
            </div>
          </div>
        </div>

        {/* Account Types */}
        <div className="container-custom mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* NRFC */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-2">NRFC Account</h2>
              <p className="text-sm text-stone-600 mb-4">
                Non-Resident Foreign Currency account for Sri Lankans living abroad.
                Hold foreign currency in Sri Lanka.
              </p>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Hold USD, GBP, EUR, AUD
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Interest ~3-4% p.a.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Repatriable funds
                </li>
              </ul>
            </div>

            {/* RFC */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-2">RFC Account</h2>
              <p className="text-sm text-stone-600 mb-4">
                Resident Foreign Currency for returning Sri Lankans.
                Convert your foreign earnings to local currency.
              </p>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  For returning residents
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Tax benefits available
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Flexible conversion
                </li>
              </ul>
            </div>

            {/* Remittance */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-amber-700" />
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-2">Inward Remittance</h2>
              <p className="text-sm text-stone-600 mb-4">
                Send money to Sri Lanka from abroad. Compare rates and fees
                across banks and services.
              </p>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Competitive exchange rates
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Low transfer fees
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Online tracking
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Foreign Currency Accounts */}
        <div className="container-custom mb-12">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-6 border-b border-stone-200">
              <h2 className="text-xl font-bold text-stone-900">Foreign Currency Accounts</h2>
              <p className="text-sm text-stone-500 mt-1">Best rates for USD, GBP, EUR deposits</p>
            </div>

            <div className="divide-y divide-stone-100">
              {fcProducts.slice(0, 5).map((product) => {
                const bank = (product as { bank: { name: string; shortCode: string; riskTier: string } }).bank;
                return (
                  <div key={product.id} className="p-6 hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {bank.shortCode}
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900">{product.name}</h3>
                          <p className="text-sm text-stone-500">{bank.name}</p>
                          {product.features.currencies && (
                            <p className="text-xs text-stone-400 mt-1">
                              {product.features.currencies.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-stone-500">Interest Rate</p>
                          <p className="text-2xl font-bold text-emerald-700">
                            {formatPercentage(product.interestRateRegular)}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-stone-500">Min Balance</p>
                          <p className="text-sm font-medium text-stone-900">
                            {product.minBalanceUsd ? `$${product.minBalanceUsd}` : 'N/A'}
                          </p>
                        </div>

                        <span className={cn("badge", getRiskBadgeClass(bank.riskTier))}>
                          {getRiskLabel(bank.riskTier)}
                        </span>

                        <button className="btn-secondary">
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Documents */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Documents Required</h2>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">1.</span>
                  Valid passport with visa/work permit
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">2.</span>
                  Proof of overseas address (utility bill, bank statement)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">3.</span>
                  Sri Lankan NIC or passport
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">4.</span>
                  Employment verification or income proof
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">5.</span>
                  Initial deposit (varies by bank)
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Many banks now offer online account opening for expats.
                  Check individual bank websites for their digital onboarding process.
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Tips for Expats</h2>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Compare exchange rates across banks - small differences add up
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Consider splitting large transfers to get better rates
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Foreign currency accounts protect against LKR depreciation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Check for SWIFT fees and correspondent bank charges
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Some banks offer preferential rates for regular remitters
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Requirements may vary by bank and change based on
                  regulations. Please contact banks directly for the most current information on
                  expat account opening. Some accounts may require a visit to a branch in Sri Lanka.
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

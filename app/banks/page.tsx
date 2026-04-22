'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getBanksByType } from '@/lib/mock-data';
import { Bank, BankTypeFilter } from '@/types';
import { Building2, Search, Filter, Landmark, Store, Globe, ChevronRight, Shield } from 'lucide-react';
import { cn, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';

const bankTypeFilters: { value: BankTypeFilter; label: string; icon: React.ReactNode; count: number }[] = [
  { value: 'all', label: 'All Banks', icon: <Building2 className="w-4 h-4" />, count: 24 },
  { value: 'state', label: 'State Banks', icon: <Landmark className="w-4 h-4" />, count: 3 },
  { value: 'private', label: 'Private Domestic', icon: <Store className="w-4 h-4" />, count: 11 },
  { value: 'foreign', label: 'Foreign Banks', icon: <Globe className="w-4 h-4" />, count: 10 },
];

interface BankRowProps {
  bank: Bank;
  index: number;
}

function BankRow({ bank, index }: BankRowProps) {
  return (
    <div className="group bg-white rounded-xl border border-stone-200 p-5 transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Bank Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-700 font-bold text-sm shrink-0">
            {bank.shortCode}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
              {bank.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-stone-500 capitalize">{bank.bankType.replace('_', ' ')}</span>
              <span className="text-stone-300">•</span>
              <span className="text-sm text-stone-500">{bank.cbslCategory}</span>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-6 lg:w-auto">
          <div className="text-center min-w-[80px]">
            <p className="text-xs text-stone-500 mb-1">Risk Level</p>
            <span className={cn("badge", getRiskBadgeClass(bank.riskTier))}>
              {getRiskLabel(bank.riskTier)}
            </span>
          </div>

          <div className="text-center min-w-[80px]">
            <p className="text-xs text-stone-500 mb-1">Fitch Rating</p>
            <span className="text-sm font-semibold text-stone-700">
              {bank.fitchRating || 'N/A'}
            </span>
          </div>

          <div className="text-center min-w-[80px]">
            <p className="text-xs text-stone-500 mb-1">Products</p>
            <span className="text-sm font-semibold text-stone-700">12</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href={`/banks/${bank.shortCode.toLowerCase()}`}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-700 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition-colors lg:w-auto w-full"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function BanksPage() {
  const [activeFilter, setActiveFilter] = useState<BankTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const banks = getBanksByType(activeFilter);

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero */}
        <div className="container-custom mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Bank Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3 font-display">
              All Licensed Banks
            </h1>
            <p className="text-stone-600">
              Compare 24 banks regulated by the Central Bank of Sri Lanka. View ratings, risk assessments, and product offerings.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="container-custom mb-8">
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search banks..."
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {bankTypeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      activeFilter === filter.value
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    {filter.icon}
                    <span>{filter.label}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-xs",
                      activeFilter === filter.value ? "bg-emerald-700" : "bg-stone-200"
                    )}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="container-custom mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-stone-500">Risk Levels:</span>
            {[
              { label: 'Low', color: 'bg-emerald-100 text-emerald-800' },
              { label: 'Moderate', color: 'bg-amber-100 text-amber-800' },
              { label: 'Elevated', color: 'bg-red-100 text-red-800' },
            ].map((risk) => (
              <span key={risk.label} className={cn("badge", risk.color)}>
                {risk.label} Risk
              </span>
            ))}
          </div>
        </div>

        {/* Bank List */}
        <div className="container-custom">
          <div className="space-y-4">
            {filteredBanks.map((bank, index) => (
              <BankRow key={bank.id} bank={bank} index={index} />
            ))}
          </div>

          {filteredBanks.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-600">No banks found matching your search.</p>
            </div>
          )}
        </div>

        {/* Rating Methodology */}
        <div className="container-custom mt-12">
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-900 mb-1">Rating Methodology</h3>
                <p className="text-sm text-emerald-800">
                  Risk ratings combine Fitch/Moody's credit ratings with CBSL classifications. Banks with no international
                  rating are assessed based on CBSL data, years in operation, and asset size. Always verify current
                  ratings directly with rating agencies.
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

'use client';

import { useState } from 'react';
import { Building2, ArrowRight, Landmark, Globe, Store } from 'lucide-react';
import { Bank, BankTypeFilter } from '@/types';
import { getBanksByType } from '@/lib/mock-data';
import { cn, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';

const bankTypeFilters: { value: BankTypeFilter; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Banks', icon: <Building2 className="w-4 h-4" /> },
  { value: 'state', label: 'State Banks', icon: <Landmark className="w-4 h-4" /> },
  { value: 'private', label: 'Private', icon: <Store className="w-4 h-4" /> },
  { value: 'foreign', label: 'Foreign', icon: <Globe className="w-4 h-4" /> },
];

interface BankCardProps {
  bank: Bank;
}

function BankCard({ bank }: BankCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-stone-200 p-5 transition-all duration-300
                    hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200
                        flex items-center justify-center text-stone-700 font-bold text-sm shrink-0">
          {bank.shortCode}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-900 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
            {bank.name}
          </h3>
          <span className={cn("badge text-xs", getRiskBadgeClass(bank.riskTier))}>
            {getRiskLabel(bank.riskTier)}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-4">
        {bank.fitchRating && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500">Fitch:</span>
            <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
              {bank.fitchRating}
            </span>
          </div>
        )}
        {!bank.fitchRating && bank.cbslCategory && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500">CBSL:</span>
            <span className="text-xs font-medium text-stone-600">{bank.cbslCategory}</span>
          </div>
        )}
      </div>

      {/* Products Count */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <span className="text-sm text-stone-500">12 products</span>
        <button className="flex items-center gap-1 text-sm font-medium text-emerald-700
                         group-hover:text-emerald-800 transition-colors">
          Explore
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default function BankDirectory() {
  const [activeFilter, setActiveFilter] = useState<BankTypeFilter>('all');
  const banks = getBanksByType(activeFilter).slice(0, 8);
  const totalBanks = 24;
  const remainingBanks = totalBanks - banks.length;

  return (
    <section className="section-padding bg-stone-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Licensed Institutions</span>
          </div>
          <h2 className="section-title mb-3">All Licensed Banks</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Compare {totalBanks} authorized financial institutions regulated by the Central Bank of Sri Lanka.
            Check ratings, stability, and product offerings.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {bankTypeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                activeFilter === filter.value
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50"
              )}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Banks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {banks.map((bank) => (
            <BankCard key={bank.id} bank={bank} />
          ))}

          {/* "More Banks" Card */}
          <div className="group bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5
                          flex flex-col items-center justify-center text-center
                          hover:shadow-xl hover:shadow-emerald-600/20 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">+{remainingBanks}</span>
            </div>
            <p className="text-white/90 font-medium mb-2">More Banks</p>
            <p className="text-white/70 text-sm mb-4">View all {totalBanks} licensed institutions</p>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Licensed Banks', value: '24' },
            { label: 'With Fitch Ratings', value: '15' },
            { label: 'State Owned', value: '3' },
            { label: 'Foreign Banks', value: '10' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-white rounded-xl border border-stone-200">
              <div className="text-2xl font-bold text-emerald-700 mb-1">{stat.value}</div>
              <div className="text-sm text-stone-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

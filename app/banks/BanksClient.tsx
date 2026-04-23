'use client';

import { useState } from 'react';
import { Bank, BankTypeFilter } from '@/types';
import { Building2, Search, Landmark, Store, Globe, ChevronRight } from 'lucide-react';
import { cn, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';

const bankTypeFilters: { value: BankTypeFilter; label: string; icon: React.ReactNode; }[] = [
  { value: 'all', label: 'All Banks', icon: <Building2 className="w-4 h-4" /> },
  { value: 'state', label: 'State Banks', icon: <Landmark className="w-4 h-4" /> },
  { value: 'private', label: 'Private Domestic', icon: <Store className="w-4 h-4" /> },
  { value: 'foreign', label: 'Foreign Banks', icon: <Globe className="w-4 h-4" /> },
];

function BankRow({ bank }: { bank: Bank }) {
  return (
    <div className="group bg-white rounded-xl border border-stone-200 p-5 transition-all duration-300 hover:shadow-lg hover:border-emerald-300">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
        </div>

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

export default function BanksClient({ banks }: { banks: Bank[] }) {
  const [activeFilter, setActiveFilter] = useState<BankTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = banks
    .filter((b) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'private') return b.bankType === 'private_domestic';
      return b.bankType === activeFilter;
    })
    .filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const counts = {
    all: banks.length,
    state: banks.filter(b => b.bankType === 'state').length,
    private: banks.filter(b => b.bankType === 'private_domestic').length,
    foreign: banks.filter(b => b.bankType === 'foreign').length,
  };

  return (
    <>
      {/* Filters */}
      <div className="container-custom mb-8">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
                    {counts[filter.value]}
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
          {filtered.map((bank) => (
            <BankRow key={bank.id} bank={bank} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600">No banks found matching your search.</p>
          </div>
        )}
      </div>
    </>
  );
}

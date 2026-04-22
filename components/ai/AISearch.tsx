'use client';

import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const quickFilters = [
  { label: 'Fixed Deposits', value: 'fixed_deposit', icon: '🔒' },
  { label: 'Savings Accounts', value: 'savings', icon: '💰' },
  { label: 'For Expats', value: 'expats', icon: '🌍' },
  { label: 'Senior Citizens', value: 'seniors', icon: '👴' },
  { label: 'Foreign Currency', value: 'foreign_currency', icon: '💱' },
];

export default function AISearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  const handleFilterClick = (filterValue: string) => {
    setActiveFilter(activeFilter === filterValue ? null : filterValue);
    setQuery(`Best ${quickFilters.find(f => f.value === filterValue)?.label.toLowerCase() || ''}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* AI Badge */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Search</span>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything... like 'Best fixed deposit for 2 years' or 'Highest savings rate for expats'"
            className="w-full pl-14 pr-6 py-5 text-lg bg-white border-2 border-stone-200 rounded-2xl
                       placeholder:text-stone-400 placeholder:text-base
                       focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10
                       transition-all duration-200 shadow-lg shadow-stone-200/50"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200",
              isSearching || !query.trim()
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg"
            )}
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Ask AI'
            )}
          </button>
        </div>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {quickFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeFilter === filter.value
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50"
            )}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Example queries */}
      <div className="mt-8 text-center">
        <p className="text-sm text-stone-500 mb-3">Try asking:</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "Best FD for monthly income",
            "Savings account with no minimum balance",
            "Compare Sampath vs Commercial Bank rates",
            "Expat account for USD deposits",
          ].map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="text-sm text-emerald-700 hover:text-emerald-800 underline underline-offset-2
                         decoration-emerald-300 hover:decoration-emerald-600 transition-all"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

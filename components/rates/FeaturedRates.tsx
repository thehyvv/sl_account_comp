'use client';

import { TrendingUp, ArrowRight, Shield, Globe, Users } from 'lucide-react';
import { RateDisplay } from '@/types';
import { getBestRates, getBankById } from '@/lib/mock-data';
import { formatPercentage, getRiskBadgeClass, getRiskLabel, cn } from '@/lib/utils';

interface RateCardProps {
  rate: RateDisplay;
  rank: number;
}

function RateCard({ rate, rank }: RateCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border-2 p-6 transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        rank === 1
          ? "border-amber-300 shadow-lg shadow-amber-100"
          : "border-stone-200 hover:border-emerald-300"
      )}
    >
      {/* Rank Badge */}
      <div
        className={cn(
          "absolute -top-3 left-6 px-3 py-1 rounded-full text-sm font-bold",
          rank === 1
            ? "bg-amber-400 text-amber-900"
            : "bg-stone-200 text-stone-700"
        )}
      >
        #{rank} Best Rate
      </div>

      {/* Bank Logo Placeholder */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200
                        flex items-center justify-center text-emerald-700 font-bold text-lg">
          {rate.bank.shortCode}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-900 truncate">{rate.bank.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn("badge", getRiskBadgeClass(rate.bank.riskTier))}>
              {getRiskLabel(rate.bank.riskTier)}
            </span>
            {rate.bank.fitchRating && (
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {rate.bank.fitchRating}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-4">
        <p className="text-sm text-stone-600 line-clamp-2">{rate.product.name}</p>
        {rate.tenureLabel && (
          <p className="text-xs text-stone-500 mt-1">{rate.tenureLabel}</p>
        )}
      </div>

      {/* Rate Display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold text-emerald-700">
          {formatPercentage(rate.effectiveRate)}
        </span>
        <span className="text-sm text-stone-500">p.a.</span>
      </div>

      {/* Target Audience Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {rate.product.interestRateSenior && rate.product.interestRateSenior > rate.effectiveRate && (
          <div className="flex items-center gap-1.5 text-sm bg-amber-50 text-amber-700 px-2 py-1 rounded-lg"
               title="Senior citizen benefits available"
               role="img"
               aria-label="Senior benefits available">
            <Users className="w-3.5 h-3.5" />
            <span>Seniors: {formatPercentage(rate.product.interestRateSenior)}</span>
          </div>
        )}
        {rate.product.targetAudience.includes('expats') && (
          <div className="flex items-center gap-1.5 text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded-lg"
               title="Available for Sri Lankans living abroad"
               role="img"
               aria-label="Expat-friendly product">
            <Globe className="w-3.5 h-3.5" />
            <span>Expat Friendly</span>
          </div>
        )}
        {rate.product.features.foreignCurrency && (
          <div className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"
               title="Supports foreign currency deposits"
               role="img"
               aria-label="Foreign currency supported">
            <span>USD/GBP/EUR</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        className="w-full py-3 rounded-xl font-medium transition-all duration-200
                   bg-stone-100 text-stone-700 hover:bg-emerald-600 hover:text-white
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                   flex items-center justify-center gap-2 group"
        aria-label={`View details for ${rate.product.name} from ${rate.bank.name}`}
      >
        View Details
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function FeaturedRates() {
  const bestRates = getBestRates('fixed_deposit', 4);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Current Rates</span>
            </div>
            <h2 className="section-title mb-2">Best Rates Right Now</h2>
            <p className="text-stone-600 max-w-xl">
              Compare the highest interest rates from licensed Sri Lankan banks. Updated daily.
            </p>
          </div>

          <button className="btn-secondary self-start sm:self-auto">
            View All Rates
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Rate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestRates.map((rate, index) => (
            <RateCard key={rate.product.id} rate={rate} rank={index + 1} />
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center">
          <p className="text-sm text-stone-500">
            Rates last updated: April 15, 2024 |
            <span className="text-emerald-600 font-medium">Source: Bank websites</span>
          </p>
        </div>
      </div>
    </section>
  );
}

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AISearch from '@/components/ai/AISearch';
import FeaturedRates from '@/components/rates/FeaturedRates';
import BankDirectory from '@/components/banks/BankDirectory';
import HowItWorks from '@/components/sections/HowItWorks';
import { Shield, TrendingUp, Building2, Clock, Users, Globe, TrendingUp as TrendingUpIcon, BookOpen, ChevronRight } from 'lucide-react';

const trustBadges = [
  { icon: Building2, label: '24 Licensed Banks', sublabel: 'CBSL Authorized' },
  { icon: Shield, label: 'Risk Ratings', sublabel: 'Fitch & CBSL' },
  { icon: TrendingUp, label: 'Daily Updates', sublabel: 'Live Rate Tracking' },
  { icon: Clock, label: 'Save Time', sublabel: 'Compare in Seconds' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-stone-50 to-stone-50" />

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

          <div className="container-custom relative">
            <div className="text-center max-w-4xl mx-auto">
              {/* Trust badges row */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm
                             rounded-full border border-stone-200 shadow-sm"
                  >
                    <badge.icon className="w-4 h-4 text-emerald-600" />
                    <div className="text-left">
                      <span className="text-xs font-semibold text-stone-900 block leading-none">{badge.label}</span>
                      <span className="text-[10px] text-stone-500">{badge.sublabel}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight font-display">
                Find the Best
                <span className="text-gradient"> Bank Account </span>
                in Sri Lanka
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Compare 24 licensed banks, interest rates, and features. Whether you're a
                <span className="text-emerald-700 font-medium"> resident</span> or{' '}
                <span className="text-emerald-700 font-medium">expat</span>, find the perfect
                account for your needs.
              </p>

              {/* AI Search Component */}
              <AISearch />
            </div>
          </div>
        </section>

        {/* For Residents vs Expats Section */}
        <section className="py-12 bg-white border-y border-stone-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Residents Card */}
              <div className="group relative bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8
                            border border-emerald-200 hover:border-emerald-300 transition-all duration-300
                            hover:shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-1">For Residents</h3>
                    <p className="text-stone-600 text-sm">Living in Sri Lanka</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Compare savings & FD rates across all banks',
                    'Find low-fee accounts with best features',
                    'Senior citizen benefits and special rates',
                    'Digital banking features comparison',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-stone-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/residents"
                  className="inline-flex items-center gap-2 text-emerald-700 font-medium
                           hover:text-emerald-800 transition-colors"
                >
                  Explore for Residents →
                </a>
              </div>

              {/* Expats Card */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8
                            border border-blue-200 hover:border-blue-300 transition-all duration-300
                            hover:shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-1">For Expats</h3>
                    <p className="text-stone-600 text-sm">Sri Lankans living abroad</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Foreign currency (USD/GBP/EUR) accounts',
                    'NRFC accounts for non-residents',
                    'Inward remittance services & rates',
                    'RFC accounts for returning residents',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-stone-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/expats"
                  className="inline-flex items-center gap-2 text-blue-700 font-medium
                           hover:text-blue-800 transition-colors"
                >
                  Explore for Expats →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Rates Section */}
        <FeaturedRates />

        {/* Bank Directory Section */}
        <BankDirectory />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Resources Section */}
        <section className="py-16 lg:py-20 bg-white border-y border-stone-200">
          <div className="container-custom">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Resources</span>
              </div>
              <h2 className="section-title mb-3">Banking Guides & Resources</h2>
              <p className="text-stone-600 max-w-2xl mx-auto">
                Learn about different account types, find the best rates, and make informed decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best FD Rates Guide */}
              <a href="/best-fixed-deposit-rates"
                 className="group bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8
                          border border-emerald-200 hover:border-emerald-400 transition-all duration-300
                          hover:shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <TrendingUpIcon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      Best Fixed Deposit Rates
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">Updated daily</p>
                  </div>
                </div>
                <p className="text-stone-600 mb-4">
                  Compare the highest FD interest rates from all 24 licensed banks.
                  Find top rates for 6 months, 1 year, 2 years, and 5-year terms.
                </p>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  View Top 10 Rates <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              {/* Expat Guide */}
              <a href="/expat-bank-accounts"
                 className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8
                          border border-blue-200 hover:border-blue-400 transition-all duration-300
                          hover:shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-blue-700 transition-colors">
                      Bank Accounts for Expats
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">Sri Lankans abroad</p>
                  </div>
                </div>
                <p className="text-stone-600 mb-4">
                  Complete guide to NRFC accounts, foreign currency deposits, and inward remittance services
                  for Sri Lankans living overseas.
                </p>
                <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
                  Explore Expat Options <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-emerald-700">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
              Ready to Find Your Best Rate?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Sri Lankans making smarter banking decisions. Compare rates,
              check ratings, and choose with confidence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/compare"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700
                         font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Start Comparing Now
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white
                         font-semibold rounded-xl hover:bg-emerald-500 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

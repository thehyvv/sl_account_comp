'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AISearch from '@/components/ai/AISearch';
import { Sparkles, Bot, User, ChevronRight, Lightbulb, AlertCircle } from 'lucide-react';

// Mock recommendation result
const mockRecommendation = {
  query: "Best fixed deposit for 2 years with monthly interest payments",
  parsedIntent: {
    productCategory: 'fixed_deposit',
    userType: 'resident',
    tenureMonths: 24,
    priorityCriteria: ['highest_return', 'monthly_income'],
  },
  recommendations: [
    {
      rank: 1,
      bank: 'DFCC Bank',
      product: 'DFCC Fixed Deposit',
      rate: 14.0,
      seniorRate: 14.5,
      matchScore: 95,
      keyBenefits: [
        'Highest interest rate at 14% p.a.',
        'Monthly interest payment option available',
        'Low risk rating (A+)',
      ],
      tradeOffs: [
        'Minimum deposit of Rs. 10,000',
        'Early withdrawal penalties apply',
      ],
      explanation: 'DFCC offers the highest rate for 24-month FDs with the flexibility of monthly interest payments. Well-suited for regular income seekers.',
    },
    {
      rank: 2,
      bank: 'Sampath Bank',
      product: 'Sampath Fixed Deposit',
      rate: 13.5,
      seniorRate: 14.0,
      matchScore: 88,
      keyBenefits: [
        'Strong bank stability (AA- rating)',
        'Excellent digital banking platform',
        'Wide branch network',
      ],
      tradeOffs: [
        'Slightly lower rate than DFCC',
        'Monthly interest option has conditions',
      ],
      explanation: 'Sampath offers a strong combination of competitive rates and excellent service. A safe choice with slightly lower returns.',
    },
    {
      rank: 3,
      bank: 'Commercial Bank',
      product: 'Commercial Bank Fixed Deposit',
      rate: 13.25,
      seniorRate: 13.75,
      matchScore: 82,
      keyBenefits: [
        'Largest private bank in Sri Lanka',
        'Very stable (AA- rating)',
        'Good for conservative investors',
      ],
      tradeOffs: [
        'Lower interest rate',
        'Monthly interest only for larger deposits',
      ],
      explanation: 'Commercial Bank prioritizes stability over maximum returns. Good for conservative investors who value security.',
    },
  ],
  followUpQuestions: [
    {
      question: 'What is your investment amount?',
      options: ['Under Rs. 100,000', 'Rs. 100,000 - 500,000', 'Rs. 500,000 - 2,000,000', 'Above Rs. 2,000,000'],
    },
    {
      question: 'Is this for monthly income or wealth accumulation?',
      options: ['Monthly income', 'Wealth accumulation', 'Both equally'],
    },
  ],
};

export default function AssistantPage() {
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setHasSearched(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero */}
        <div className="container-custom mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">AI Assistant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3 font-display">
              AI-Powered Banking Advisor
            </h1>
            <p className="text-stone-600">
              Ask natural language questions and get personalized recommendations based on your situation.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="container-custom mb-12">
          <AISearch />
        </div>

        {hasSearched && (
          <>
            {/* Query Summary */}
            <div className="container-custom mb-8">
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 mb-1">You asked:</p>
                    <p className="text-lg font-medium text-emerald-900">{mockRecommendation.query}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-white text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">
                        {mockRecommendation.parsedIntent.productCategory.replace('_', ' ')}
                      </span>
                      <span className="text-xs bg-white text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">
                        {mockRecommendation.parsedIntent.tenureMonths} months
                      </span>
                      <span className="text-xs bg-white text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">
                        {mockRecommendation.parsedIntent.userType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="container-custom mb-12">
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Top Recommendations
              </h2>

              <div className="space-y-6">
                {mockRecommendation.recommendations.map((rec) => (
                  <div key={rec.rank} className="bg-white rounded-xl border-2 border-stone-200 p-6 hover:border-emerald-300 transition-colors">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                        #{rec.rank}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-stone-900">{rec.product}</h3>
                          <span className="badge badge-risk-low">{rec.bank}</span>
                          <span className="text-sm text-emerald-700 font-medium">{rec.matchScore}% Match</span>
                        </div>
                        <p className="text-stone-600 text-sm">{rec.explanation}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-700">{rec.rate}%</div>
                        <p className="text-sm text-stone-500">p.a.</p>
                        {rec.seniorRate && rec.seniorRate > rec.rate && (
                          <p className="text-xs text-amber-600 mt-1">Seniors: {rec.seniorRate}%</p>
                        )}
                      </div>
                    </div>

                    {/* Benefits & Trade-offs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-stone-900 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-1">
                          {rec.keyBenefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-stone-600 flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-stone-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          Considerations
                        </h4>
                        <ul className="space-y-1">
                          {rec.tradeOffs.map((tradeOff, idx) => (
                            <li key={idx} className="text-sm text-stone-600 flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">!</span>
                              {tradeOff}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap gap-3">
                      <button className="btn-primary">
                        View Full Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="btn-secondary">
                        Compare with Others
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Questions */}
            <div className="container-custom">
              <h2 className="text-xl font-bold text-stone-900 mb-6">
                Help Us Refine Your Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockRecommendation.followUpQuestions.map((q, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-stone-200 p-6">
                    <h3 className="font-medium text-stone-900 mb-4">{q.question}</h3>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((option) => (
                        <button
                          key={option}
                          className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium
                                   hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tips Section */}
        {!hasSearched && (
          <div className="container-custom">
            <div className="bg-white rounded-xl border border-stone-200 p-8">
              <h2 className="text-xl font-bold text-stone-900 mb-6">What You Can Ask</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { q: "Best savings account for expats", icon: "🌍" },
                  { q: "Highest FD rates for seniors", icon: "👴" },
                  { q: "Compare Sampath vs Commercial Bank", icon: "⚖️" },
                  { q: "Lowest fee current account", icon: "💳" },
                  { q: "USD account with best rates", icon: "💵" },
                  { q: "Best for monthly interest income", icon: "📈" },
                ].map((item) => (
                  <button
                    key={item.q}
                    className="text-left p-4 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                  >
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <span className="text-stone-700 font-medium">{item.q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { Search, Scale, CheckCircle, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Search',
    description: 'Ask in plain English what you\'re looking for. Our AI understands natural language queries.',
    icon: Search,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    number: '02',
    title: 'Compare',
    description: 'See side-by-side comparisons of interest rates, fees, features, and bank stability ratings.',
    icon: Scale,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    number: '03',
    title: 'Decide',
    description: 'Get AI-powered recommendations with clear reasoning. Choose with confidence.',
    icon: CheckCircle,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-stone-50 to-white opacity-50" />

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800
                          rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>How It Works</span>
          </div>

          <h2 className="section-title mb-4">Find the Best Account in 3 Steps</h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            No more spreadsheets or visiting multiple bank websites. Get personalized recommendations
            based on your specific needs.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-stone-200" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 border border-stone-200
                              transition-all duration-300 group-hover:shadow-xl group-hover:border-emerald-200
                              group-hover:-translate-y-1 relative z-10">
                {/* Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center
                                  transition-transform duration-300 group-hover:scale-110`}>
                    <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>
                  <span className="text-4xl font-bold text-stone-100 group-hover:text-emerald-100 transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
                <p className="text-stone-600 leading-relaxed">{step.description}</p>

                {/* Examples for Search step */}
                {index === 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      '"Best FD for 2 years"',
                      '"Savings with no minimum"',
                    ].map((example) => (
                      <span key={example} className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full">
                        {example}
                      </span>
                    ))}
                  </div>
                )}

                {/* Examples for Compare step */}
                {index === 1 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {[
                      { label: 'Interest Rate', color: 'bg-emerald-100 text-emerald-700' },
                      { label: 'Risk Rating', color: 'bg-blue-100 text-blue-700' },
                      { label: 'Fees', color: 'bg-amber-100 text-amber-700' },
                    ].map((tag) => (
                      <span key={tag.label} className={`text-xs px-3 py-1.5 rounded-full font-medium ${tag.color}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 text-xs font-bold">24</span>
            </div>
            <span>Licensed Banks</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 text-xs font-bold">AI</span>
            </div>
            <span>Smart Recommendations</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-700 text-xs font-bold">✓</span>
            </div>
            <span>Daily Updates</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-700 text-xs font-bold">$0</span>
            </div>
            <span>Free to Use</span>
          </div>
        </div>
      </div>
    </section>
  );
}

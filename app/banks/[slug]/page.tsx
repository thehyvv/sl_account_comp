export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { banks as banksTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Bank } from '@/types';
import {
  Building2, Globe, Shield, TrendingUp, ChevronRight,
  Star, AlertCircle, CheckCircle
} from 'lucide-react';
import { cn, getRiskBadgeClass, getRiskLabel } from '@/lib/utils';

async function getBankBySlug(slug: string): Promise<Bank | null> {
  const [row] = await db
    .select()
    .from(banksTable)
    .where(eq(banksTable.slug, slug))
    .limit(1);

  if (!row) return null;

  return {
    id: String(row.id),
    name: row.name,
    shortCode: row.shortCode,
    websiteUrl: row.website ?? '',
    logoUrl: row.logoUrl ?? undefined,
    bankType: row.type,
    fitchRating: row.fitchRating ?? undefined,
    cbslCategory: 'Licensed Commercial Bank',
    riskScore: row.riskTier === 'low' ? 30 : row.riskTier === 'moderate' ? 55 : 80,
    riskTier: row.riskTier as Bank['riskTier'],
    isActive: true,
  };
}

export default async function BankDetailPage({ params }: { params: { slug: string } }) {
  const bank = await getBankBySlug(params.slug);

  if (!bank) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero / Bank Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="container-custom py-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-2xl font-bold text-white">{bank.shortCode}</span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                    {bank.name}
                  </h1>
                  <span className={cn("badge", getRiskBadgeClass(bank.riskTier))}>
                    {getRiskLabel(bank.riskTier)}
                  </span>
                </div>
                <p className="text-stone-600">{bank.cbslCategory} • Licensed by Central Bank of Sri Lanka</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {bank.websiteUrl && (
                  <a
                    href={bank.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Compare Products
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Stats */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Fitch Rating */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <Shield className="w-4 h-4" />
                Fitch Rating
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {bank.fitchRating || 'Not Rated'}
              </div>
              {bank.fitchRating && (
                <p className="text-sm text-emerald-600 mt-1">Stable Outlook</p>
              )}
            </div>

            {/* Risk Tier */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                Risk Tier
              </div>
              <div className="text-2xl font-bold text-stone-900 capitalize">{bank.riskTier}</div>
              <p className="text-sm text-stone-500 mt-1">CBSL assessment</p>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <CheckCircle className="w-4 h-4" />
                Products
              </div>
              <div className="text-2xl font-bold text-stone-900">Coming soon</div>
              <p className="text-sm text-stone-500 mt-1">Rate data being added</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products placeholder */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-900 font-display">Available Products</h2>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
                <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-600 mb-2">Product data coming soon</p>
                <p className="text-sm text-stone-500">
                  We&apos;re gathering rate data for {bank.name}. Check back soon.
                </p>
                <a
                  href="/banks"
                  className="inline-flex items-center gap-2 mt-4 text-emerald-700 font-medium hover:text-emerald-800"
                >
                  Browse all banks
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-900 mb-4">Bank Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-stone-500">Type</p>
                    <p className="font-medium text-stone-900 capitalize">{bank.bankType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Short Code</p>
                    <p className="font-medium text-stone-900">{bank.shortCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">CBSL License</p>
                    <p className="font-medium text-stone-900">Active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-900 mb-4">Rating History</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-stone-600">Current</span>
                    </div>
                    <span className="font-medium">{bank.fitchRating || 'N/A'}</span>
                  </div>
                </div>
                <button className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View Full History →
                </button>
              </div>

              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    All information is sourced from public data. Rates and terms are subject to change.
                    Please verify directly with {bank.name} before making decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

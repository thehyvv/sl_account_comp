export const dynamic = 'force-dynamic';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { banks as banksTable } from '@/lib/db/schema';
import { Bank } from '@/types';
import { Building2, Shield } from 'lucide-react';
import BanksClient from './BanksClient';

async function getAllBanks(): Promise<Bank[]> {
  try {
    const rows = await db.select().from(banksTable).orderBy(banksTable.name);
    return rows.map((row) => ({
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
    }));
  } catch {
    return [];
  }
}

export default async function BanksPage() {
  const banks = await getAllBanks();

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
              Compare {banks.length} banks regulated by the Central Bank of Sri Lanka. View ratings, risk assessments, and product offerings.
            </p>
          </div>
        </div>

        <BanksClient banks={banks} />

        {/* Rating Methodology */}
        <div className="container-custom mt-12">
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-900 mb-1">Rating Methodology</h3>
                <p className="text-sm text-emerald-800">
                  Risk ratings combine Fitch/Moody&apos;s credit ratings with CBSL classifications. Banks with no international
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

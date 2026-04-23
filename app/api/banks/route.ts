import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { banks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { Bank } from '@/types';

function toApiBank(row: typeof banks.$inferSelect): Bank {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'state' | 'private_domestic' | 'foreign' | null;
    const limit = searchParams.get('limit');

    const rows = type
      ? await db.select().from(banks).where(eq(banks.type, type)).orderBy(banks.name)
      : await db.select().from(banks).orderBy(banks.name);

    let results = rows.map(toApiBank);

    if (limit) {
      results = results.slice(0, parseInt(limit, 10));
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET /api/banks error:', error);
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
}

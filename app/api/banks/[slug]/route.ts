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

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const [row] = await db
      .select()
      .from(banks)
      .where(eq(banks.slug, params.slug))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }

    return NextResponse.json(toApiBank(row));
  } catch (error) {
    console.error('GET /api/banks/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch bank' }, { status: 500 });
  }
}

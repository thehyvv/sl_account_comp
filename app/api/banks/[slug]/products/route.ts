import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Products not yet seeded — returns empty array until next iteration
  void params;
  return NextResponse.json([]);
}

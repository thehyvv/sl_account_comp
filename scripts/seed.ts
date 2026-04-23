import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { banks, bankRatingHistory } from '../lib/db/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const seedBanks = [
  { name: 'Amana Bank PLC', shortCode: 'AMANA', slug: 'amana', type: 'private_domestic' as const, fitchRating: 'A(lka)', riskTier: 'low' as const },
  { name: 'Bank of Ceylon', shortCode: 'BOC', slug: 'boc', type: 'state' as const, fitchRating: 'AA(lka)', riskTier: 'low' as const },
  { name: 'Bank of China Ltd', shortCode: 'BOC-CN', slug: 'boc-cn', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'Cargills Bank PLC', shortCode: 'CARG', slug: 'carg', type: 'private_domestic' as const, fitchRating: 'BBB(lka)', riskTier: 'moderate' as const },
  { name: 'Citibank N.A.', shortCode: 'CITI', slug: 'citi', type: 'foreign' as const, fitchRating: 'AA+(lka)', riskTier: 'low' as const },
  { name: 'Commercial Bank of Ceylon PLC', shortCode: 'COMB', slug: 'comb', type: 'private_domestic' as const, fitchRating: 'AA-(lka)', riskTier: 'low' as const },
  { name: 'Deutsche Bank AG', shortCode: 'DB', slug: 'db', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'DFCC Bank PLC', shortCode: 'DFCC', slug: 'dfcc', type: 'private_domestic' as const, fitchRating: 'A+(lka)', riskTier: 'low' as const },
  { name: 'Habib Bank Ltd', shortCode: 'HBL', slug: 'hbl', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'Hatton National Bank PLC', shortCode: 'HNB', slug: 'hnb', type: 'private_domestic' as const, fitchRating: 'AA-(lka)', riskTier: 'low' as const },
  { name: 'Indian Bank', shortCode: 'IB', slug: 'ib', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'Indian Overseas Bank', shortCode: 'IOB', slug: 'iob', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'MCB Bank Ltd', shortCode: 'MCB', slug: 'mcb', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'National Development Bank PLC', shortCode: 'NDB', slug: 'ndb', type: 'private_domestic' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'Nations Trust Bank PLC', shortCode: 'NTB', slug: 'ntb', type: 'private_domestic' as const, fitchRating: 'A(lka)', riskTier: 'low' as const },
  { name: 'Pan Asia Banking Corporation PLC', shortCode: 'PABC', slug: 'pabc', type: 'private_domestic' as const, fitchRating: 'BBB-(lka)', riskTier: 'moderate' as const },
  { name: "People's Bank", shortCode: 'PB', slug: 'pb', type: 'state' as const, fitchRating: 'AA(lka)', riskTier: 'low' as const },
  { name: 'Public Bank Berhad', shortCode: 'PBB', slug: 'pbb', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'Sampath Bank PLC', shortCode: 'SAMP', slug: 'samp', type: 'private_domestic' as const, fitchRating: 'AA-(lka)', riskTier: 'low' as const },
  { name: 'Seylan Bank PLC', shortCode: 'SEYB', slug: 'seyb', type: 'private_domestic' as const, fitchRating: 'A-(lka)', riskTier: 'low' as const },
  { name: 'Standard Chartered Bank', shortCode: 'SCB', slug: 'scb', type: 'foreign' as const, fitchRating: 'AA+(lka)', riskTier: 'low' as const },
  { name: 'State Bank of India', shortCode: 'SBI', slug: 'sbi', type: 'foreign' as const, fitchRating: null, riskTier: 'moderate' as const },
  { name: 'HSBC', shortCode: 'HSBC', slug: 'hsbc', type: 'foreign' as const, fitchRating: 'AA(lka)', riskTier: 'low' as const },
  { name: 'Union Bank of Colombo PLC', shortCode: 'UB', slug: 'ub', type: 'private_domestic' as const, fitchRating: 'BBB+(lka)', riskTier: 'moderate' as const },
];

async function seed() {
  console.log('Seeding 24 CBSL banks...');

  for (const bank of seedBanks) {
    const [inserted] = await db
      .insert(banks)
      .values(bank)
      .onConflictDoUpdate({
        target: banks.shortCode,
        set: {
          name: bank.name,
          fitchRating: bank.fitchRating,
          riskTier: bank.riskTier,
          updatedAt: new Date(),
        },
      })
      .returning();

    await db.insert(bankRatingHistory).values({
      bankId: inserted.id,
      fitchRating: bank.fitchRating,
      riskTier: bank.riskTier,
      source: 'CBSL registry + planning docs — initial seed',
    });

    console.log(`  ✓ ${bank.name}`);
  }

  console.log('Done.');
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

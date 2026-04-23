import {
  pgTable,
  serial,
  varchar,
  text,
  pgEnum,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

export const bankTypeEnum = pgEnum('bank_type', [
  'state',
  'private_domestic',
  'foreign',
]);

export const riskTierEnum = pgEnum('risk_tier', ['low', 'moderate', 'high']);

export const banks = pgTable('banks', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  shortCode: varchar('short_code', { length: 20 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  type: bankTypeEnum('type').notNull(),
  fitchRating: varchar('fitch_rating', { length: 20 }),
  riskTier: riskTierEnum('risk_tier').notNull(),
  website: text('website'),
  logoUrl: text('logo_url'),
  description: text('description'),
  established: integer('established'),
  headquarters: varchar('headquarters', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bankRatingHistory = pgTable('bank_rating_history', {
  id: serial('id').primaryKey(),
  bankId: integer('bank_id')
    .notNull()
    .references(() => banks.id),
  fitchRating: varchar('fitch_rating', { length: 20 }),
  riskTier: riskTierEnum('risk_tier').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
  source: varchar('source', { length: 255 }),
  notes: text('notes'),
});

export type Bank = typeof banks.$inferSelect;
export type NewBank = typeof banks.$inferInsert;
export type BankRatingHistory = typeof bankRatingHistory.$inferSelect;

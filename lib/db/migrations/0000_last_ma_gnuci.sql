CREATE TYPE "public"."bank_type" AS ENUM('state', 'private_domestic', 'foreign');--> statement-breakpoint
CREATE TYPE "public"."risk_tier" AS ENUM('low', 'moderate', 'high');--> statement-breakpoint
CREATE TABLE "bank_rating_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_id" integer NOT NULL,
	"fitch_rating" varchar(20),
	"risk_tier" "risk_tier" NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	"source" varchar(255),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "banks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_code" varchar(20) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" "bank_type" NOT NULL,
	"fitch_rating" varchar(20),
	"risk_tier" "risk_tier" NOT NULL,
	"website" text,
	"logo_url" text,
	"description" text,
	"established" integer,
	"headquarters" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banks_short_code_unique" UNIQUE("short_code"),
	CONSTRAINT "banks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "bank_rating_history" ADD CONSTRAINT "bank_rating_history_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE no action ON UPDATE no action;
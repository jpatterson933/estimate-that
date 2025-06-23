CREATE TYPE "public"."outcome" AS ENUM('EARLY', 'ON_TIME', 'LATE');--> statement-breakpoint
CREATE TYPE "public"."point" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TABLE "linear_issues" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"number" integer NOT NULL,
	"identifier" text NOT NULL,
	"url" text NOT NULL,
	"priority" integer NOT NULL,
	"assignee" jsonb NOT NULL,
	"team" jsonb NOT NULL,
	"state" jsonb NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"due_date" timestamp,
	"branch_name" text,
	"estimate_points" integer DEFAULT 0 NOT NULL,
	"estimated_due_date" timestamp,
	"estimate_correctly" boolean,
	"estimate_feedback" text,
	"review_started_at" timestamp,
	"review_duration_ms" integer,
	"date_last_modified" timestamp DEFAULT now() NOT NULL
);

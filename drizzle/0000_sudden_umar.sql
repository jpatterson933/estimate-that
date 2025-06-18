CREATE TYPE "public"."outcome" AS ENUM('EARLY', 'ON_TIME', 'LATE');--> statement-breakpoint
CREATE TYPE "public"."point" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"branch" text NOT NULL,
	"points" "point",
	"reminder_at" timestamp,
	"date_last_modified" timestamp DEFAULT now() NOT NULL
);

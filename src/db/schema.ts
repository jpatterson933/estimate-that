import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const outcomeEnum = pgEnum("outcome", ["EARLY", "ON_TIME", "LATE"]);

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  linearId: text("linear_id").unique(),
  title: text("title"),
  estimatePts: integer("estimate_pts"),
  reminderAt: timestamp("reminder_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  assigneeId: text("assignee_id"),
});

export const outcomes = pgTable("outcomes", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => tickets.id),
  outcome: outcomeEnum("outcome"),
  actualDays: numeric("actual_days", { precision: 4, scale: 1 }),
  notes: text("notes"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
});

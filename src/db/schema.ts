import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const outcomeEnum = pgEnum("outcome", ["EARLY", "ON_TIME", "LATE"]);
// Allowed story points
export const pointEnum = pgEnum("point", ["1", "2", "3", "4", "5"]); // TODO: Confirm whether we need to allow any other values?

export const linear_issues = pgTable("linear_issues", {
  // Linear UUID as primary key so we don't duplicate issues on repeated syncs
  id: text("id").primaryKey(),

  /* ---- Core Linear fields ---- */
  title: text("title").notNull(),
  number: integer("number").notNull(),
  identifier: text("identifier").notNull(),
  url: text("url").notNull(),
  priority: integer("priority").notNull(),

  assignee: jsonb("assignee").notNull(), // { id, name, email }
  team: jsonb("team").notNull(), // { id, name, key }
  state: jsonb("state").notNull(), // { id, name, type }

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"),
  branchName: text("branch_name"),

  /* ---- Estimation workflow fields ---- */
  estimatePoints: integer("estimate_points").notNull().default(0),
  estimatedDueDate: timestamp("estimated_due_date"),
  estimateCorrectly: boolean("estimate_correctly"),
  estimateFeedback: text("estimate_feedback"),

  /* ---- Review lead-time tracking ---- */
  reviewStartedAt: timestamp("review_started_at"),
  reviewDurationMs: integer("review_duration_ms"),

  /* ---- Metadata ---- */
  dateLastModified: timestamp("date_last_modified")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

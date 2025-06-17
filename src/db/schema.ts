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
// Allowed story points
export const pointEnum = pgEnum("point", ["1", "2", "3", "4", "5"]); // TODO: Confirm whether we need to allow any other values?

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title"),
  branch: text("branch"),
  points: pointEnum("points"),
  reminderAt: timestamp("reminder_at"), // setting the reiminder should trigger a workflow that calculates the time and point - like current time plus reminder time deivdied by points equals that many points
  dateLastModified: timestamp("date_last_modified")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

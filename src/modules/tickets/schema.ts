import { z } from "../../lib/zod";
import { tickets } from "../../db/schema";

// Inferred row type returned by Drizzle for the `tickets` table
export type TicketRow = typeof tickets.$inferSelect;

export const TicketSchema = z
  .object({
    id: z.number(),
    title: z.string().nullable(),
    branch: z.string().nullable(),
    points: z.number().nullable(),
    reminderAt: z.date().nullable(),
    dateLastModified: z.date().nullable(),
  })
  .openapi({ ref: "Ticket", description: "A ticket from the database" });

export type Ticket = z.infer<typeof TicketSchema>;

/**
 * Convert a raw database row into a validated `Ticket` object.
 *  - Casts the `points` enum string ("1"–"5") to a number.
 *  - Runs the result through `TicketSchema` to guarantee shape.
 */
export function synthesizeTicket(row: TicketRow): Ticket {
  const ticket: Ticket = {
    id: row.id,
    title: row.title,
    branch: row.branch,
    points: row.points ? Number(row.points) : null,
    reminderAt: row.reminderAt,
    dateLastModified: row.dateLastModified,
  };

  return TicketSchema.parse(ticket);
}

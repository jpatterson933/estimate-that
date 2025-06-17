import { db } from "../../db/client";
import { tickets } from "../../db/schema";
import { TicketSchema, Ticket } from "./schema";

// Fetch all tickets from DB and validate via Zod

export class TicketService {
  static async getAllTickets(): Promise<Ticket[]> {
    const rows = await db.select().from(tickets);

    return rows.map((row) =>
      TicketSchema.parse({
        id: row.id,
        title: row.title,
        branch: row.branch,
        points: row.points,
        reminderAt: row.reminderAt,
        dateLastModified: row.dateLastModified,
      })
    );
  }
}

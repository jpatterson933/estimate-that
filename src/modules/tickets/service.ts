import { db } from "../../db/client";
import { tickets } from "../../db/schema";
import { Ticket, synthesizeTicket } from "./schema";

// Fetch all tickets from DB and validate via Zod

export class TicketService {
  static async getAllTickets(): Promise<Ticket[]> {
    const rows = await db.select().from(tickets);

    return rows.map(synthesizeTicket);
  }
}

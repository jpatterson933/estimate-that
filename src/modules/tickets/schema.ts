import { z } from "zod";

export const TicketSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  branch: z.string().nullable(),
  points: z.number().nullable(),
  reminderAt: z.date().nullable(),
  dateLastModified: z.date().nullable(),
});

export type Ticket = z.infer<typeof TicketSchema>;

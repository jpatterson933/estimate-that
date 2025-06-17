import { Request, Response, NextFunction } from "express";
import { TicketService } from "./service";

export async function listTickets(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await TicketService.getAllTickets();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from "express";
import { TicketService } from "./service";
import { safeHandler } from "../../common/safeHandler";

export const listTickets = safeHandler(async (req, res) => {
  const data = await TicketService.getAllTickets();
  res.json(data);
});

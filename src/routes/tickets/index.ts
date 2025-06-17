import { Router, Request, Response, NextFunction } from "express";
import { listTickets } from "../../modules/tickets/controller";

export const router = Router();

// GET /tickets – return all tickets in DB
router.get(
  "/tickets",
  async (req: Request, res: Response, next: NextFunction) => {
    await listTickets(req, res, next);
  }
);

export default router;

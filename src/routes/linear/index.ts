import { Router, Request, Response, NextFunction } from "express";
import { getAllIssues } from "../../modules/linear/controller";

export const router = Router();

// GET /linear/tickets – Return list of issues from Linear
router.get(
  "/issues",
  async (req: Request, res: Response, next: NextFunction) => {
    await getAllIssues(req, res, next);
  }
);

export default router;

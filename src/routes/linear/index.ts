import { Router, Request, Response, NextFunction } from "express";
import { handleWebhook } from "../../modules/linear/controller";

export const router = Router();

// POST /linear/webhook – Handle Linear webhook events
router.post(
  "/webhook",
  async (req: Request, res: Response, next: NextFunction) => {
    await handleWebhook(req, res, next);
  }
);

export default router;

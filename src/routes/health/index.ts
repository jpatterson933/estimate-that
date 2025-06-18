import { Router, Request, Response } from "express";

export const router = Router();

// Basic health check – Railway pings /health by default if configured
router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export default router;

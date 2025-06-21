import { Request, Response, NextFunction } from "express";
import { LinearService } from "./service";
import { safeHandler } from "../../common/safeHandler";

export const handleWebhook = safeHandler(async (req, res) => {
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);
  await LinearService.processWebhook(
    rawBody,
    req.headers["linear-signature"] as string
  );
  res.status(200).json({ success: true });
});

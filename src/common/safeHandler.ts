import { NextFunction, Request, Response } from "express";

export function safeHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await handler(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

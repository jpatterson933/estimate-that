import { LinearService } from "./service";
import { safeHandler } from "../../common/safeHandler";

/**
 * GET /linear/tickets – Fetch all Linear issues (no filtering)
 */
export const getAllIssues = safeHandler(async (_req, res) => {
  const issues = await LinearService.getAllIssues();
  res.status(200).json({ issues });
});

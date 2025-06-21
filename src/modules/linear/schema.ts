import { z } from "zod";

// Linear webhook payload schemas with Zod validation
export const LinearUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const LinearTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
});

export const LinearStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
});

export const LinearIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  number: z.number(),
  identifier: z.string(),
  url: z.string().url(),
  priority: z.number(),
  estimate: z.number().optional(),
  assignee: LinearUserSchema.optional(),
  team: LinearTeamSchema,
  state: LinearStateSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  dueDate: z.string().optional(),
  branchName: z.string().optional(),
});

export const LinearWebhookPayloadSchema = z.object({
  action: z.enum(["create", "update", "remove"]),
  type: z.enum(["Issue", "Comment", "Project", "User"]),
  organizationId: z.string(),
  webhookTimestamp: z.number(),
  webhookId: z.string(),
  data: LinearIssueSchema,
  updatedFrom: LinearIssueSchema.partial().optional(),
});

// Exported types inferred from schemas
export type LinearUser = z.infer<typeof LinearUserSchema>;
export type LinearTeam = z.infer<typeof LinearTeamSchema>;
export type LinearState = z.infer<typeof LinearStateSchema>;
export type LinearIssue = z.infer<typeof LinearIssueSchema>;
export type LinearWebhookPayload = z.infer<typeof LinearWebhookPayloadSchema>;

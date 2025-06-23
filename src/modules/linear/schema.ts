import { z } from "zod";

export const LinearIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  number: z.number(),
  identifier: z.string(),
  url: z.string().url(),
  priority: z.number(),
  assignee: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  team: z.object({
    id: z.string(),
    name: z.string(),
    key: z.string(),
  }),
  state: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  dueDate: z.string().optional(),
  branchName: z.string().optional(),
});

export const LinearIssueDBSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  number: z.number(),
  identifier: z.string(),
  url: z.string().url(),
  priority: z.number(),
  assignee: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  team: z.object({
    id: z.string(),
    name: z.string(),
    key: z.string(),
  }),
  state: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  dueDate: z.string().optional(),
  branchName: z.string().optional(),
});

// Exported types inferred from schemas
export type LinearIssue = z.infer<typeof LinearIssueSchema>;
export type LinearIssueDB = z.infer<typeof LinearIssueDBSchema>;

export const serializeLinearIssue = (data: LinearIssueDB) => {
  // First, validate the core Linear fields (strict schema)
  const validatedLinear = LinearIssueSchema.parse(data);

  // Custom estimation fields – provide defaults when absent
  const estimatePoints = (data as any).estimatePoints ?? 0;
  const estimatedDueDate = (data as any).estimatedDueDate ?? null;
  const estimateCorrectly = (data as any).estimateCorrectly ?? null;
  const estimateFeedback = (data as any).estimateFeedback ?? null;

  // Review-tracking fields
  const reviewStartedAt = (data as any).reviewStartedAt ?? null;
  const reviewDurationMs =
    reviewStartedAt && data.completedAt
      ? Date.parse(data.completedAt) - Date.parse(reviewStartedAt as string)
      : null;

  // Return merged object (core validated fields + custom additions)
  return {
    ...validatedLinear,
    estimatePoints,
    estimatedDueDate,
    estimateCorrectly,
    estimateFeedback,
    reviewStartedAt,
    reviewDurationMs,
  } as const;
};

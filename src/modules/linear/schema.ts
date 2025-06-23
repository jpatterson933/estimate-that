import { z } from "zod";

export const LinearIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
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
  completedAt: z.string().nullable(),
  dueDate: z.string().nullable(),
  branchName: z.string().nullable(),
});

export const LinearIssueDBSchema = z.object({
  id: z.string(),
  title: z.string(),
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
  completedAt: z.string().nullable(),
  dueDate: z.string().nullable(),
  branchName: z.string().nullable(),
  estimatePoints: z.number(),
  estimatedDueDate: z.string().nullable(),
  estimateCorrectly: z.boolean().nullable(),
  estimateFeedback: z.string().nullable(),
  reviewStartedAt: z.string().nullable(),
  reviewDurationMs: z.number().nullable(),
});

// Exported types inferred from schemas
export type LinearIssue = z.infer<typeof LinearIssueSchema>;
export type LinearIssueDB = z.infer<typeof LinearIssueDBSchema>;

export const serializeLinearIssue = (data: any): LinearIssueDB => {
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
    reviewStartedAt && validatedLinear.completedAt
      ? Date.parse(validatedLinear.completedAt) -
        Date.parse(reviewStartedAt as string)
      : null;

  // Return merged object (core validated fields + custom additions)
  const result = {
    ...validatedLinear,
    estimatePoints,
    estimatedDueDate,
    estimateCorrectly,
    estimateFeedback,
    reviewStartedAt,
    reviewDurationMs,
  } as const;

  // Final validation against DB schema to ensure completeness
  return LinearIssueDBSchema.parse(result);
};

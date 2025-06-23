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
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullable(),
  dueDate: z.date().nullable(),
  branchName: z.string().nullable(),
  estimatePoints: z.number(),
  estimatedDueDate: z.date().nullable(),
  estimateCorrectly: z.boolean().nullable(),
  estimateFeedback: z.string().nullable(),
  reviewStartedAt: z.date().nullable(),
  reviewDurationMs: z.number().nullable(),
});

// Exported types inferred from schemas
export type LinearIssue = z.infer<typeof LinearIssueSchema>;
export type LinearIssueDB = z.infer<typeof LinearIssueDBSchema>;

export const serializeLinearIssue = (data: any): LinearIssueDB => {
  // Validate the raw Linear payload first
  const validated = LinearIssueSchema.parse(data);

  // Helper to convert ISO string or null to Date or null
  const toDate = (value: string | null | undefined): Date | null =>
    value ? new Date(value) : null;

  // Convert date strings to Date objects for DB insertion
  const convertedCore = {
    ...validated,
    createdAt: new Date(validated.createdAt),
    updatedAt: new Date(validated.updatedAt),
    completedAt: toDate(validated.completedAt),
    dueDate: toDate(validated.dueDate),
  } as const;

  // Custom estimation fields – defaults
  const estimatePoints = (data as any).estimatePoints ?? 0;
  const estimatedDueDate = toDate((data as any).estimatedDueDate ?? null);
  const estimateCorrectly = (data as any).estimateCorrectly ?? null;
  const estimateFeedback = (data as any).estimateFeedback ?? null;

  // Review tracking
  const reviewStartedAt = toDate((data as any).reviewStartedAt ?? null);
  const reviewDurationMs =
    reviewStartedAt && convertedCore.completedAt
      ? convertedCore.completedAt.getTime() - reviewStartedAt.getTime()
      : null;

  const result = {
    ...convertedCore,
    estimatePoints,
    estimatedDueDate,
    estimateCorrectly,
    estimateFeedback,
    reviewStartedAt,
    reviewDurationMs,
  } as const;

  return LinearIssueDBSchema.parse(result);
};

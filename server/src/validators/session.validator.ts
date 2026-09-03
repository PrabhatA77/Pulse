import { z } from "zod";

export const DURATION_OPTIONS = [15, 30, 45, 60] as const;

export const startSessionSchema = z.object({
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  tag: z.string().trim().min(1).optional(),
  problemId: z.string().trim().min(1).optional(),
  durationMinutes: z
    .number()
    .int()
    .refine(
      (v): v is (typeof DURATION_OPTIONS)[number] => DURATION_OPTIONS.includes(v as never),
      "durationMinutes must be one of 15, 30, 45, 60",
    ),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
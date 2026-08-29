import { z } from "zod";

export const saveDraftSchema = z.object({
  language: z.string().trim().min(1),
  code: z.string(),
});

export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
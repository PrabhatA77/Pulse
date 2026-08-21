import { z } from "zod";

export const createTopicSchema = z.object({
  name: z.string().trim().min(1, "Topic name is required").max(50, "Topic name is too long"),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
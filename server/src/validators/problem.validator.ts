import { z } from "zod";
import { PARAM_TYPES } from "../models/problem.model.js";

const paramTypeEnum = z.enum(PARAM_TYPES);
const difficultyEnum = z.enum(["Easy", "Medium", "Hard"]);
const topicEnum = z.string().trim().min(1, "Topic is required")

const functionParamSchema = z.object({
  name: z.string().trim().min(1, "Parameter name is required"),
  type: paramTypeEnum,
});

const testCaseValueSchema = z.union([
  z.number(),
  z.string(),
  z.boolean(),
  z.array(z.number()),
  z.array(z.string()),
  z.array(z.boolean()),
]);

const testCaseSchema = z.object({
  input: z.record(z.string(), testCaseValueSchema),
  expectedOutput: testCaseValueSchema,
  isHidden: z.boolean().default(true),
  explanation: z.string().optional(),
});

export const createProblemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  difficulty: difficultyEnum,
  topic: topicEnum,
  description: z.string().trim().min(1, "Description is required"),
  constraints: z.array(z.string()).default([]),
  functionName: z.string().trim().min(1, "Function name is required"),
  parameters: z.array(functionParamSchema).min(1, "At least one parameter is required"),
  returnType: paramTypeEnum,
  testCases: z.array(testCaseSchema).min(1, "At least one test case is required"),
  expectedTimeComplexity: z.string().trim().min(1, "Expected time complexity is required"),
  expectedSpaceComplexity: z.string().trim().min(1, "Expected space complexity is required"),
});

// PUT allows updating just some fields (e.g. only fixing test cases).
export const updateProblemSchema = createProblemSchema.partial();

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type UpdateProblemInput = z.infer<typeof updateProblemSchema>;

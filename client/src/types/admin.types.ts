export const TOPICS = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stacks & Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion & Backtracking",
  "Sorting & Searching",
  "Greedy",
  "Binary Search",
] as const;
export type Topic = (typeof TOPICS)[number];

export const PARAM_TYPES = [
  "int",
  "float",
  "string",
  "boolean",
  "int[]",
  "float[]",
  "string[]",
  "boolean[]",
] as const;
export type ParamType = (typeof PARAM_TYPES)[number];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface AdminFunctionParam {
  name: string;
  type: ParamType;
}

export interface AdminTestCase {
  input: Record<string, unknown>;
  expectedOutput: unknown;
  isHidden: boolean;
  explanation?: string;
}

// Summary row for the admin problems table.
export interface AdminProblemSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: Topic;
  testCaseCount: number;
  createdAt: string;
}

// Full problem detail, used to populate the edit form.
export interface AdminProblemDetail {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: Topic;
  description: string;
  constraints: string[];
  functionName: string;
  parameters: AdminFunctionParam[];
  returnType: ParamType;
  testCases: AdminTestCase[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  createdAt: string;
  updatedAt: string;
}

// Shape the create/update endpoints expect in the request body.
export interface ProblemFormPayload {
  title: string;
  difficulty: Difficulty;
  topic: Topic;
  description: string;
  constraints: string[];
  functionName: string;
  parameters: AdminFunctionParam[];
  returnType: ParamType;
  testCases: AdminTestCase[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
}
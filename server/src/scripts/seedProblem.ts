import { env } from "../config/env.js";
import mongoose from "mongoose";
import { Problem } from "../models/problem.model.js";
import type { ProblemDocument } from "../models/problem.model.js";

type SeedProblem = Pick<
  ProblemDocument,
  | "title"
  | "difficulty"
  | "tags"
  | "description"
  | "constraints"
  | "functionName"
  | "parameters"
  | "returnType"
  | "testCases"
  | "expectedTimeComplexity"
  | "expectedSpaceComplexity"
>;

const problems: SeedProblem[] = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays"],
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Assume exactly one solution exists, and the same element can't be used twice.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Exactly one valid answer exists",
    ],
    functionName: "twoSum",
    parameters: [
      { name: "nums", type: "int[]" },
      { name: "target", type: "int" },
    ],
    returnType: "int[]",
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1],
        isHidden: false,
        explanation: "nums[0] + nums[1] == 9",
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expectedOutput: [1, 2],
        isHidden: false,
      },
      {
        input: { nums: [3, 3], target: 6 },
        expectedOutput: [0, 1],
        isHidden: true,
      },
      {
        input: { nums: [1, 5, 3, 9, 2], target: 11 },
        expectedOutput: [3, 4],
        isHidden: true,
      },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stacks & Queues"],
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists only of bracket characters",
    ],
    functionName: "isValid",
    parameters: [{ name: "s", type: "string" }],
    returnType: "boolean",
    testCases: [
      { input: { s: "()[]{}" }, expectedOutput: true, isHidden: false },
      { input: { s: "(]" }, expectedOutput: false, isHidden: false },
      { input: { s: "([)]" }, expectedOutput: false, isHidden: true },
      { input: { s: "{[]}" }, expectedOutput: true, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Dynamic Programming"],
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum, and return that sum.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    functionName: "maxSubArray",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "int",
    testCases: [
      {
        input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
        expectedOutput: 6,
        isHidden: false,
        explanation: "[4,-1,2,1] has the largest sum = 6",
      },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [5, 4, -1, 7, 8] }, expectedOutput: 23, isHidden: true },
      { input: { nums: [-1, -2, -3] }, expectedOutput: -1, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
];

async function seed() {
  const uri = env.mongoUri;
  if (!uri) {
    throw new Error("MONGODB_URI is not set — add it to your .env file");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Upsert by title, same pattern as seedTopics.ts — reruns update
  // existing problems in place instead of wiping and recreating them,
  // so admin-managed problems and their _ids survive a reseed.
  for (const problem of problems) {
    await Problem.findOneAndUpdate({ title: problem.title }, problem, {
      upsert: true,
      new: true,
      runValidators: true,
    });
  }
  console.log(`Seeded ${problems.length} problems`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

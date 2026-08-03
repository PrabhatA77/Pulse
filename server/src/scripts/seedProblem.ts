import { env } from "../config/env.js";
import mongoose from "mongoose";
import { Problem } from "../models/problem.model.js";
import type { ProblemDocument } from "../models/problem.model.js";

type SeedProblem = Pick<
  ProblemDocument,
  | "title"
  | "difficulty"
  | "topic"
  | "description"
  | "constraints"
  | "testCases"
  | "expectedTimeComplexity"
  | "expectedSpaceComplexity"
>;

const problems: SeedProblem[] = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Assume exactly one solution exists, and the same element can't be used twice.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one valid answer exists"],
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false, explanation: "nums[0] + nums[1] == 9" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
      { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true },
      { input: "[1,5,3,9,2]\n11", expectedOutput: "[1,3]", isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stacks & Queues",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.",
    constraints: ["1 <= s.length <= 10^4", "s consists only of bracket characters"],
    testCases: [
      { input: "()[]{}", expectedOutput: "true", isHidden: false },
      { input: "(]", expectedOutput: "false", isHidden: false },
      { input: "([)]", expectedOutput: "false", isHidden: true },
      { input: "{[]}", expectedOutput: "true", isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description: "Given an integer array nums, find the contiguous subarray with the largest sum, and return that sum.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false, explanation: "[4,-1,2,1] has the largest sum = 6" },
      { input: "[1]", expectedOutput: "1", isHidden: false },
      { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: true },
      { input: "[-1,-2,-3]", expectedOutput: "-1", isHidden: true },
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

  await Problem.deleteMany({});
  console.log("Cleared existing problems");

  await Problem.insertMany(problems);
  console.log(`Seeded ${problems.length} problems`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
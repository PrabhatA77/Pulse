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
  // ---------------------------------------------------------------------
  // Arrays
  // ---------------------------------------------------------------------
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Arrays"],
    description:
      "You are given an array prices where prices[i] is the price of a stock on day i. Choose a single day to buy and a later day to sell to maximize profit. Return the maximum profit, or 0 if no profit is possible.",
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    functionName: "maxProfit",
    parameters: [{ name: "prices", type: "int[]" }],
    returnType: "int",
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expectedOutput: 5, isHidden: false, explanation: "Buy at 1, sell at 6." },
      { input: { prices: [7, 6, 4, 3, 1] }, expectedOutput: 0, isHidden: false, explanation: "Prices only fall — no profit possible." },
      { input: { prices: [1, 2] }, expectedOutput: 1, isHidden: true },
      { input: { prices: [2, 4, 1] }, expectedOutput: 2, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    tags: ["Arrays"],
    description: "Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.",
    constraints: ["1 <= nums.length <= 10^5"],
    functionName: "containsDuplicate",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "boolean",
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: true, isHidden: false },
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: false, isHidden: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expectedOutput: true, isHidden: true },
      { input: { nums: [5] }, expectedOutput: false, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Move Zeroes",
    difficulty: "Easy",
    tags: ["Arrays"],
    description:
      "Given an integer array nums, move all 0's to the end while maintaining the relative order of the non-zero elements. Return the resulting array.",
    constraints: ["1 <= nums.length <= 10^4"],
    functionName: "moveZeroes",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "int[]",
    testCases: [
      { input: { nums: [0, 1, 0, 3, 12] }, expectedOutput: [1, 3, 12, 0, 0], isHidden: false },
      { input: { nums: [0] }, expectedOutput: [0], isHidden: false },
      { input: { nums: [1, 0, 2, 0, 3] }, expectedOutput: [1, 2, 3, 0, 0], isHidden: true },
      { input: { nums: [4, 5, 6] }, expectedOutput: [4, 5, 6], isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },

  // ---------------------------------------------------------------------
  // Strings
  // ---------------------------------------------------------------------
  {
    title: "Reverse String",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Given a string s, return it reversed.",
    constraints: ["0 <= s.length <= 10^4"],
    functionName: "reverseString",
    parameters: [{ name: "s", type: "string" }],
    returnType: "string",
    testCases: [
      { input: { s: "hello" }, expectedOutput: "olleh", isHidden: false },
      { input: { s: "Java" }, expectedOutput: "avaJ", isHidden: false },
      { input: { s: "a" }, expectedOutput: "a", isHidden: true },
      { input: { s: "" }, expectedOutput: "", isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Valid Palindrome (Simple)",
    difficulty: "Easy",
    tags: ["Strings"],
    description:
      "Given a string s consisting only of lowercase letters and digits, return true if it reads the same forwards and backwards.",
    constraints: ["1 <= s.length <= 10^4"],
    functionName: "isPalindrome",
    parameters: [{ name: "s", type: "string" }],
    returnType: "boolean",
    testCases: [
      { input: { s: "racecar" }, expectedOutput: true, isHidden: false },
      { input: { s: "hello" }, expectedOutput: false, isHidden: false },
      { input: { s: "a" }, expectedOutput: true, isHidden: true },
      { input: { s: "ab" }, expectedOutput: false, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "First Unique Character",
    difficulty: "Easy",
    tags: ["Strings"],
    description:
      "Given a lowercase string s, return the index of the first character that appears exactly once. If none exists, return -1.",
    constraints: ["1 <= s.length <= 10^5"],
    functionName: "firstUniqChar",
    parameters: [{ name: "s", type: "string" }],
    returnType: "int",
    testCases: [
      { input: { s: "leetcode" }, expectedOutput: 0, isHidden: false },
      { input: { s: "loveleetcode" }, expectedOutput: 2, isHidden: false },
      { input: { s: "aabb" }, expectedOutput: -1, isHidden: true },
      { input: { s: "z" }, expectedOutput: 0, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Longest Common Prefix",
    difficulty: "Easy",
    tags: ["Strings"],
    description: "Given an array of strings, return the longest common prefix among them. Return an empty string if there is none.",
    constraints: ["1 <= strs.length <= 200"],
    functionName: "longestCommonPrefix",
    parameters: [{ name: "strs", type: "string[]" }],
    returnType: "string",
    testCases: [
      { input: { strs: ["flower", "flow", "flight"] }, expectedOutput: "fl", isHidden: false },
      { input: { strs: ["dog", "racecar", "car"] }, expectedOutput: "", isHidden: false },
      { input: { strs: ["interspecies", "interstellar", "interstate"] }, expectedOutput: "inters", isHidden: true },
      { input: { strs: ["throne"] }, expectedOutput: "throne", isHidden: true },
    ],
    expectedTimeComplexity: "O(n*m)",
    expectedSpaceComplexity: "O(1)",
  },

  // ---------------------------------------------------------------------
  // Linked List (represented as an int[] of node values, in order)
  // ---------------------------------------------------------------------
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    description:
      "A linked list is represented here as an array of its node values, in order. Return the values in reverse order, as if the list itself had been reversed.",
    constraints: ["0 <= values.length <= 5000"],
    functionName: "reverseList",
    parameters: [{ name: "values", type: "int[]" }],
    returnType: "int[]",
    testCases: [
      { input: { values: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1], isHidden: false },
      { input: { values: [1, 2] }, expectedOutput: [2, 1], isHidden: false },
      { input: { values: [] }, expectedOutput: [], isHidden: true },
      { input: { values: [7] }, expectedOutput: [7], isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List"],
    description:
      "Two sorted linked lists are each represented as an array of node values. Merge them into a single sorted array (as if splicing the two lists together).",
    constraints: ["0 <= list1.length, list2.length <= 50"],
    functionName: "mergeTwoLists",
    parameters: [
      { name: "list1", type: "int[]" },
      { name: "list2", type: "int[]" },
    ],
    returnType: "int[]",
    testCases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expectedOutput: [1, 1, 2, 3, 4, 4], isHidden: false },
      { input: { list1: [], list2: [] }, expectedOutput: [], isHidden: false },
      { input: { list1: [], list2: [0] }, expectedOutput: [0], isHidden: true },
      { input: { list1: [2, 6], list2: [1, 5] }, expectedOutput: [1, 2, 5, 6], isHidden: true },
    ],
    expectedTimeComplexity: "O(n + m)",
    expectedSpaceComplexity: "O(n + m)",
  },
  {
    title: "Remove Duplicates from Sorted List",
    difficulty: "Easy",
    tags: ["Linked List"],
    description:
      "A sorted linked list is given as an array of node values. Remove consecutive duplicate values so each value appears only once, and return the resulting array.",
    constraints: ["0 <= values.length <= 300"],
    functionName: "deleteDuplicates",
    parameters: [{ name: "values", type: "int[]" }],
    returnType: "int[]",
    testCases: [
      { input: { values: [1, 1, 2] }, expectedOutput: [1, 2], isHidden: false },
      { input: { values: [1, 1, 2, 3, 3] }, expectedOutput: [1, 2, 3], isHidden: false },
      { input: { values: [] }, expectedOutput: [], isHidden: true },
      { input: { values: [1, 1, 1] }, expectedOutput: [1], isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Middle of the Linked List",
    difficulty: "Easy",
    tags: ["Linked List"],
    description:
      "A linked list is given as an array of node values. Return the value of the middle node. If there are two middle nodes, return the second one.",
    constraints: ["1 <= values.length <= 100"],
    functionName: "middleNode",
    parameters: [{ name: "values", type: "int[]" }],
    returnType: "int",
    testCases: [
      { input: { values: [1, 2, 3, 4, 5] }, expectedOutput: 3, isHidden: false },
      { input: { values: [1, 2, 3, 4, 5, 6] }, expectedOutput: 4, isHidden: false },
      { input: { values: [1] }, expectedOutput: 1, isHidden: true },
      { input: { values: [1, 2] }, expectedOutput: 2, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },

  // ---------------------------------------------------------------------
  // Stacks & Queues
  // ---------------------------------------------------------------------
  {
    title: "Daily Temperatures",
    difficulty: "Medium",
    tags: ["Stacks & Queues"],
    description:
      "Given an array of daily temperatures, return an array where answer[i] is the number of days you'd have to wait after day i for a warmer temperature. If there is none, put 0.",
    constraints: ["1 <= temperatures.length <= 10^5"],
    functionName: "dailyTemperatures",
    parameters: [{ name: "temperatures", type: "int[]" }],
    returnType: "int[]",
    testCases: [
      {
        input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] },
        expectedOutput: [1, 1, 4, 2, 1, 1, 0, 0],
        isHidden: false,
      },
      { input: { temperatures: [30, 40, 50, 60] }, expectedOutput: [1, 1, 1, 0], isHidden: false },
      { input: { temperatures: [30, 60, 90] }, expectedOutput: [1, 1, 0], isHidden: true },
      { input: { temperatures: [90, 60, 30] }, expectedOutput: [0, 0, 0], isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Next Greater Element",
    difficulty: "Medium",
    tags: ["Stacks & Queues"],
    description:
      "Given an integer array nums, for each element find the next element to its right that is strictly greater. If none exists, use -1. Return the results as an array.",
    constraints: ["1 <= nums.length <= 10^4"],
    functionName: "nextGreaterElement",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "int[]",
    testCases: [
      { input: { nums: [2, 1, 2, 4, 3] }, expectedOutput: [4, 2, 4, -1, -1], isHidden: false },
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: [2, 3, 4, -1], isHidden: false },
      { input: { nums: [4, 3, 2, 1] }, expectedOutput: [-1, -1, -1, -1], isHidden: true },
      { input: { nums: [1] }, expectedOutput: [-1], isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Baseball Game",
    difficulty: "Easy",
    tags: ["Stacks & Queues"],
    description:
      "You keep score with a stack of past round scores from a list of operations: a number string records that score; \"C\" cancels/removes the previous score; \"D\" records a new score double the previous one; \"+\" records a new score equal to the sum of the previous two. Return the total sum of all recorded scores.",
    constraints: ["1 <= ops.length <= 1000"],
    functionName: "calPoints",
    parameters: [{ name: "ops", type: "string[]" }],
    returnType: "int",
    testCases: [
      { input: { ops: ["5", "2", "C", "D", "+"] }, expectedOutput: 30, isHidden: false },
      { input: { ops: ["5", "-2", "4", "C", "D", "9", "+", "+"] }, expectedOutput: 27, isHidden: false },
      { input: { ops: ["1"] }, expectedOutput: 1, isHidden: true },
      { input: { ops: ["1", "C"] }, expectedOutput: 0, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },

  // ---------------------------------------------------------------------
  // Trees (level-order array; children of index i are at 2i+1 and 2i+2;
  // -1 or an out-of-bounds index means "no node there")
  // ---------------------------------------------------------------------
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    tags: ["Trees"],
    description:
      "A binary tree is given as a level-order array: the node at index i has its left child at index 2*i+1 and right child at index 2*i+2. A value of -1, or an index past the end of the array, means there is no node there. Return the tree's maximum depth.",
    constraints: ["1 <= tree.length <= 1000"],
    functionName: "maxDepth",
    parameters: [{ name: "tree", type: "int[]" }],
    returnType: "int",
    testCases: [
      { input: { tree: [3, 9, 20, -1, -1, 15, 7] }, expectedOutput: 3, isHidden: false },
      { input: { tree: [1, 2, -1] }, expectedOutput: 2, isHidden: false, explanation: "Root has only a left child." },
      { input: { tree: [1] }, expectedOutput: 1, isHidden: true },
      { input: { tree: [1, 2, 3, 4, 5, 6, 7] }, expectedOutput: 3, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(h)",
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    tags: ["Trees"],
    description:
      "A binary tree is given as a level-order array (index i's children are at 2*i+1 and 2*i+2, fully populated for these test cases). Invert the tree — swap every node's left and right children — and return the resulting array in the same level-order format.",
    constraints: ["1 <= tree.length <= 100"],
    functionName: "invertTree",
    parameters: [{ name: "tree", type: "int[]" }],
    returnType: "int[]",
    testCases: [
      { input: { tree: [4, 2, 7, 1, 3, 6, 9] }, expectedOutput: [4, 7, 2, 9, 6, 3, 1], isHidden: false },
      { input: { tree: [2, 1, 3] }, expectedOutput: [2, 3, 1], isHidden: false },
      { input: { tree: [1, 2, 3] }, expectedOutput: [1, 3, 2], isHidden: true },
      { input: { tree: [1] }, expectedOutput: [1], isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Same Tree",
    difficulty: "Easy",
    tags: ["Trees"],
    description:
      "Two binary trees are each given as level-order arrays (-1 or a missing index means no node). Return true if the trees are structurally identical with the same node values.",
    constraints: ["0 <= tree1.length, tree2.length <= 100"],
    functionName: "isSameTree",
    parameters: [
      { name: "tree1", type: "int[]" },
      { name: "tree2", type: "int[]" },
    ],
    returnType: "boolean",
    testCases: [
      { input: { tree1: [1, 2, 3], tree2: [1, 2, 3] }, expectedOutput: true, isHidden: false },
      { input: { tree1: [1, 2, -1], tree2: [1, -1, 2] }, expectedOutput: false, isHidden: false },
      { input: { tree1: [1], tree2: [1] }, expectedOutput: true, isHidden: true },
      { input: { tree1: [1, 2], tree2: [1, 2, 3] }, expectedOutput: false, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(h)",
  },

  // ---------------------------------------------------------------------
  // Graphs (n = vertex count, edges/matrix flattened into a single int[])
  // ---------------------------------------------------------------------
  {
    title: "Find if Path Exists in Graph",
    difficulty: "Easy",
    tags: ["Graphs"],
    description:
      "A graph has n vertices (0 to n-1). Edges are given as a flattened array of pairs — [u1, v1, u2, v2, ...] — each pair an undirected edge. Return true if a path exists between source and destination.",
    constraints: ["1 <= n <= 200", "edges.length is even"],
    functionName: "validPath",
    parameters: [
      { name: "n", type: "int" },
      { name: "edges", type: "int[]" },
      { name: "source", type: "int" },
      { name: "destination", type: "int" },
    ],
    returnType: "boolean",
    testCases: [
      { input: { n: 3, edges: [0, 1, 1, 2], source: 0, destination: 2 }, expectedOutput: true, isHidden: false },
      {
        input: { n: 6, edges: [0, 1, 0, 2, 3, 5, 5, 4, 4, 3], source: 0, destination: 5 },
        expectedOutput: false,
        isHidden: false,
      },
      { input: { n: 2, edges: [0, 1], source: 0, destination: 1 }, expectedOutput: true, isHidden: true },
      { input: { n: 4, edges: [0, 1, 2, 3], source: 0, destination: 3 }, expectedOutput: false, isHidden: true },
    ],
    expectedTimeComplexity: "O(V + E)",
    expectedSpaceComplexity: "O(V + E)",
  },
  {
    title: "Number of Provinces",
    difficulty: "Medium",
    tags: ["Graphs"],
    description:
      "There are n cities. isConnected is an n*n adjacency matrix flattened row-by-row into a single array, where a 1 means the two cities are directly connected. A province is a group of cities connected directly or indirectly. Return the total number of provinces.",
    constraints: ["1 <= n <= 200", "isConnected.length == n*n"],
    functionName: "findCircleNum",
    parameters: [
      { name: "n", type: "int" },
      { name: "isConnected", type: "int[]" },
    ],
    returnType: "int",
    testCases: [
      { input: { n: 3, isConnected: [1, 1, 0, 1, 1, 0, 0, 0, 1] }, expectedOutput: 2, isHidden: false },
      { input: { n: 3, isConnected: [1, 0, 0, 0, 1, 0, 0, 0, 1] }, expectedOutput: 3, isHidden: false },
      {
        input: { n: 4, isConnected: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1] },
        expectedOutput: 2,
        isHidden: true,
      },
      { input: { n: 1, isConnected: [1] }, expectedOutput: 1, isHidden: true },
    ],
    expectedTimeComplexity: "O(n^2)",
    expectedSpaceComplexity: "O(n)",
  },
  {
    title: "Find the Town Judge",
    difficulty: "Easy",
    tags: ["Graphs"],
    description:
      "In a town of n people (1 to n), trust is a flattened array of pairs [a1, b1, a2, b2, ...] meaning person a trusts person b. The town judge trusts nobody but is trusted by everyone else. Return the judge's label, or -1 if there is none.",
    constraints: ["1 <= n <= 1000", "trust.length is even"],
    functionName: "findJudge",
    parameters: [
      { name: "n", type: "int" },
      { name: "trust", type: "int[]" },
    ],
    returnType: "int",
    testCases: [
      { input: { n: 2, trust: [1, 2] }, expectedOutput: 2, isHidden: false },
      { input: { n: 3, trust: [1, 3, 2, 3] }, expectedOutput: 3, isHidden: false },
      { input: { n: 3, trust: [1, 3, 2, 3, 3, 1] }, expectedOutput: -1, isHidden: true },
      { input: { n: 1, trust: [] }, expectedOutput: 1, isHidden: true },
    ],
    expectedTimeComplexity: "O(n + trust.length)",
    expectedSpaceComplexity: "O(n)",
  },

  // ---------------------------------------------------------------------
  // Recursion & Backtracking
  // ---------------------------------------------------------------------
  {
    title: "Fibonacci Number",
    difficulty: "Easy",
    tags: ["Recursion & Backtracking"],
    description: "Given n, return the nth Fibonacci number, where fib(0) = 0, fib(1) = 1, and fib(n) = fib(n-1) + fib(n-2).",
    constraints: ["0 <= n <= 30"],
    functionName: "fib",
    parameters: [{ name: "n", type: "int" }],
    returnType: "int",
    testCases: [
      { input: { n: 2 }, expectedOutput: 1, isHidden: false },
      { input: { n: 4 }, expectedOutput: 3, isHidden: false },
      { input: { n: 0 }, expectedOutput: 0, isHidden: true },
      { input: { n: 10 }, expectedOutput: 55, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Recursion & Backtracking"],
    description:
      "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. Return the number of distinct ways to reach the top.",
    constraints: ["1 <= n <= 45"],
    functionName: "climbStairs",
    parameters: [{ name: "n", type: "int" }],
    returnType: "int",
    testCases: [
      { input: { n: 2 }, expectedOutput: 2, isHidden: false },
      { input: { n: 3 }, expectedOutput: 3, isHidden: false },
      { input: { n: 4 }, expectedOutput: 5, isHidden: true },
      { input: { n: 5 }, expectedOutput: 8, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Digit Sum",
    difficulty: "Easy",
    tags: ["Recursion & Backtracking"],
    description: "Given a non-negative integer n, return the sum of its digits.",
    constraints: ["0 <= n <= 10^9"],
    functionName: "digitSum",
    parameters: [{ name: "n", type: "int" }],
    returnType: "int",
    testCases: [
      { input: { n: 1234 }, expectedOutput: 10, isHidden: false },
      { input: { n: 99 }, expectedOutput: 18, isHidden: false },
      { input: { n: 0 }, expectedOutput: 0, isHidden: true },
      { input: { n: 5 }, expectedOutput: 5, isHidden: true },
    ],
    expectedTimeComplexity: "O(log n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Is Power of Three",
    difficulty: "Easy",
    tags: ["Recursion & Backtracking"],
    description: "Given an integer n, return true if it is a power of three (3^k for some non-negative integer k).",
    constraints: ["-2^31 <= n <= 2^31 - 1"],
    functionName: "isPowerOfThree",
    parameters: [{ name: "n", type: "int" }],
    returnType: "boolean",
    testCases: [
      { input: { n: 27 }, expectedOutput: true, isHidden: false },
      { input: { n: 0 }, expectedOutput: false, isHidden: false },
      { input: { n: 9 }, expectedOutput: true, isHidden: true },
      { input: { n: 45 }, expectedOutput: false, isHidden: true },
    ],
    expectedTimeComplexity: "O(log n)",
    expectedSpaceComplexity: "O(1)",
  },

  // ---------------------------------------------------------------------
  // Sorting & Searching
  // ---------------------------------------------------------------------
  {
    title: "Merge Sorted Arrays",
    difficulty: "Easy",
    tags: ["Sorting & Searching"],
    description: "Given two arrays already sorted in ascending order, merge them into a single sorted array.",
    constraints: ["0 <= nums1.length, nums2.length <= 200"],
    functionName: "mergeSortedArrays",
    parameters: [
      { name: "nums1", type: "int[]" },
      { name: "nums2", type: "int[]" },
    ],
    returnType: "int[]",
    testCases: [
      { input: { nums1: [1, 2, 3], nums2: [2, 5, 6] }, expectedOutput: [1, 2, 2, 3, 5, 6], isHidden: false },
      { input: { nums1: [1], nums2: [] }, expectedOutput: [1], isHidden: false },
      { input: { nums1: [], nums2: [1] }, expectedOutput: [1], isHidden: true },
      { input: { nums1: [4, 9], nums2: [1, 3] }, expectedOutput: [1, 3, 4, 9], isHidden: true },
    ],
    expectedTimeComplexity: "O(n + m)",
    expectedSpaceComplexity: "O(n + m)",
  },
  {
    title: "Kth Largest Element",
    difficulty: "Medium",
    tags: ["Sorting & Searching"],
    description: "Given an integer array nums and an integer k, return the kth largest element (not the kth distinct element).",
    constraints: ["1 <= k <= nums.length <= 10^4"],
    functionName: "findKthLargest",
    parameters: [
      { name: "nums", type: "int[]" },
      { name: "k", type: "int" },
    ],
    returnType: "int",
    testCases: [
      { input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, expectedOutput: 5, isHidden: false },
      { input: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 }, expectedOutput: 4, isHidden: false },
      { input: { nums: [1], k: 1 }, expectedOutput: 1, isHidden: true },
      { input: { nums: [7, 6, 5, 4, 3, 2, 1], k: 3 }, expectedOutput: 5, isHidden: true },
    ],
    expectedTimeComplexity: "O(n log n)",
    expectedSpaceComplexity: "O(log n)",
  },
  {
    title: "Sort Colors",
    difficulty: "Medium",
    tags: ["Sorting & Searching"],
    description: "Given an array containing only 0s, 1s, and 2s, return it sorted in ascending order (0s, then 1s, then 2s).",
    constraints: ["1 <= nums.length <= 300"],
    functionName: "sortColors",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "int[]",
    testCases: [
      { input: { nums: [2, 0, 2, 1, 1, 0] }, expectedOutput: [0, 0, 1, 1, 2, 2], isHidden: false },
      { input: { nums: [2, 0, 1] }, expectedOutput: [0, 1, 2], isHidden: false },
      { input: { nums: [0] }, expectedOutput: [0], isHidden: true },
      { input: { nums: [1, 2, 0] }, expectedOutput: [0, 1, 2], isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },

  // ---------------------------------------------------------------------
  // Greedy
  // ---------------------------------------------------------------------
  {
    title: "Jump Game",
    difficulty: "Medium",
    tags: ["Greedy"],
    description:
      "Given an array nums where nums[i] is the maximum jump length from position i, return true if you can reach the last index starting from index 0.",
    constraints: ["1 <= nums.length <= 10^4"],
    functionName: "canJump",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "boolean",
    testCases: [
      { input: { nums: [2, 3, 1, 1, 4] }, expectedOutput: true, isHidden: false },
      { input: { nums: [3, 2, 1, 0, 4] }, expectedOutput: false, isHidden: false },
      { input: { nums: [0] }, expectedOutput: true, isHidden: true },
      { input: { nums: [1, 0, 1, 0] }, expectedOutput: false, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Medium",
    tags: ["Greedy"],
    description:
      "Given daily stock prices, you may complete as many buy-sell transactions as you like (but must sell before buying again). Return the maximum total profit achievable.",
    constraints: ["1 <= prices.length <= 3*10^4"],
    functionName: "maxProfitII",
    parameters: [{ name: "prices", type: "int[]" }],
    returnType: "int",
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expectedOutput: 7, isHidden: false },
      { input: { prices: [1, 2, 3, 4, 5] }, expectedOutput: 4, isHidden: false },
      { input: { prices: [7, 6, 4, 3, 1] }, expectedOutput: 0, isHidden: true },
      { input: { prices: [1, 2] }, expectedOutput: 1, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Assign Cookies",
    difficulty: "Easy",
    tags: ["Greedy"],
    description:
      "Each child i has a greed factor g[i] (the minimum cookie size that will content them). Each cookie j has a size s[j]. A cookie can satisfy a child only if its size is >= the child's greed. Return the maximum number of children you can content.",
    constraints: ["1 <= g.length, s.length <= 3*10^4"],
    functionName: "findContentChildren",
    parameters: [
      { name: "g", type: "int[]" },
      { name: "s", type: "int[]" },
    ],
    returnType: "int",
    testCases: [
      { input: { g: [1, 2, 3], s: [1, 1] }, expectedOutput: 1, isHidden: false },
      { input: { g: [1, 2], s: [1, 2, 3] }, expectedOutput: 2, isHidden: false },
      { input: { g: [10, 9, 8, 7], s: [5, 6, 7, 8] }, expectedOutput: 2, isHidden: true },
      { input: { g: [1], s: [] }, expectedOutput: 0, isHidden: true },
    ],
    expectedTimeComplexity: "O(n log n)",
    expectedSpaceComplexity: "O(1)",
  },

  // ---------------------------------------------------------------------
  // Binary Search
  // ---------------------------------------------------------------------
  {
    title: "Binary Search",
    difficulty: "Easy",
    tags: ["Binary Search"],
    description: "Given a sorted array of distinct integers nums and a target value, return the index of target, or -1 if it isn't present.",
    constraints: ["1 <= nums.length <= 10^4"],
    functionName: "search",
    parameters: [
      { name: "nums", type: "int[]" },
      { name: "target", type: "int" },
    ],
    returnType: "int",
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expectedOutput: 4, isHidden: false },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expectedOutput: -1, isHidden: false },
      { input: { nums: [5], target: 5 }, expectedOutput: 0, isHidden: true },
      { input: { nums: [2, 5], target: 5 }, expectedOutput: 1, isHidden: true },
    ],
    expectedTimeComplexity: "O(log n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Search Insert Position",
    difficulty: "Easy",
    tags: ["Binary Search"],
    description: "Given a sorted array of distinct integers and a target, return the index where target is found, or where it would be inserted in order.",
    constraints: ["1 <= nums.length <= 10^4"],
    functionName: "searchInsert",
    parameters: [
      { name: "nums", type: "int[]" },
      { name: "target", type: "int" },
    ],
    returnType: "int",
    testCases: [
      { input: { nums: [1, 3, 5, 6], target: 5 }, expectedOutput: 2, isHidden: false },
      { input: { nums: [1, 3, 5, 6], target: 2 }, expectedOutput: 1, isHidden: false },
      { input: { nums: [1, 3, 5, 6], target: 7 }, expectedOutput: 4, isHidden: true },
      { input: { nums: [1, 3, 5, 6], target: 0 }, expectedOutput: 0, isHidden: true },
    ],
    expectedTimeComplexity: "O(log n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Find First and Last Position",
    difficulty: "Medium",
    tags: ["Binary Search"],
    description:
      "Given a sorted array of integers and a target, return the starting and ending index of target as a 2-element array [start, end]. If target isn't found, return [-1, -1].",
    constraints: ["0 <= nums.length <= 10^5"],
    functionName: "searchRange",
    parameters: [
      { name: "nums", type: "int[]" },
      { name: "target", type: "int" },
    ],
    returnType: "int[]",
    testCases: [
      { input: { nums: [5, 7, 7, 8, 8, 10], target: 8 }, expectedOutput: [3, 4], isHidden: false },
      { input: { nums: [5, 7, 7, 8, 8, 10], target: 6 }, expectedOutput: [-1, -1], isHidden: false },
      { input: { nums: [], target: 0 }, expectedOutput: [-1, -1], isHidden: true },
      { input: { nums: [1], target: 1 }, expectedOutput: [0, 0], isHidden: true },
    ],
    expectedTimeComplexity: "O(log n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Sqrt(x)",
    difficulty: "Easy",
    tags: ["Binary Search"],
    description: "Given a non-negative integer x, return the square root of x rounded down to the nearest integer.",
    constraints: ["0 <= x <= 2^31 - 1"],
    functionName: "mySqrt",
    parameters: [{ name: "x", type: "int" }],
    returnType: "int",
    testCases: [
      { input: { x: 4 }, expectedOutput: 2, isHidden: false },
      { input: { x: 8 }, expectedOutput: 2, isHidden: false },
      { input: { x: 0 }, expectedOutput: 0, isHidden: true },
      { input: { x: 1 }, expectedOutput: 1, isHidden: true },
    ],
    expectedTimeComplexity: "O(log n)",
    expectedSpaceComplexity: "O(1)",
  },

  // ---------------------------------------------------------------------
  // Dynamic Programming (additions — Maximum Subarray already exists above)
  // ---------------------------------------------------------------------
  {
    title: "House Robber",
    difficulty: "Medium",
    tags: ["Dynamic Programming"],
    description:
      "Given an array of non-negative integers representing money in houses along a street, return the maximum amount you can rob without robbing two adjacent houses.",
    constraints: ["1 <= nums.length <= 100"],
    functionName: "rob",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "int",
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [2, 7, 9, 3, 1] }, expectedOutput: 12, isHidden: false },
      { input: { nums: [2, 1, 1, 2] }, expectedOutput: 4, isHidden: true },
      { input: { nums: [5] }, expectedOutput: 5, isHidden: true },
    ],
    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["Dynamic Programming"],
    description:
      "Given coin denominations and a target amount, return the fewest number of coins needed to make up that amount, or -1 if it can't be made.",
    constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
    functionName: "coinChange",
    parameters: [
      { name: "coins", type: "int[]" },
      { name: "amount", type: "int" },
    ],
    returnType: "int",
    testCases: [
      { input: { coins: [1, 2, 5], amount: 11 }, expectedOutput: 3, isHidden: false },
      { input: { coins: [2], amount: 3 }, expectedOutput: -1, isHidden: false },
      { input: { coins: [1], amount: 0 }, expectedOutput: 0, isHidden: true },
      { input: { coins: [1, 3, 4, 5], amount: 7 }, expectedOutput: 2, isHidden: true },
    ],
    expectedTimeComplexity: "O(amount * coins.length)",
    expectedSpaceComplexity: "O(amount)",
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    tags: ["Dynamic Programming"],
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    constraints: ["1 <= nums.length <= 2500"],
    functionName: "lengthOfLIS",
    parameters: [{ name: "nums", type: "int[]" }],
    returnType: "int",
    testCases: [
      { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [0, 1, 0, 3, 2, 3] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [7, 7, 7, 7] }, expectedOutput: 1, isHidden: true },
      { input: { nums: [4, 10, 4, 3, 8, 9] }, expectedOutput: 3, isHidden: true },
    ],
    expectedTimeComplexity: "O(n log n)",
    expectedSpaceComplexity: "O(n)",
  },
  // ---------------------------------------------------------------------
// Bit Manipulation
// ---------------------------------------------------------------------
{
  title: "Number of 1 Bits",
  difficulty: "Easy",
  tags: ["Bit Manipulation"],
  description:
    "Given a positive integer n, return the number of set bits (1s) in its binary representation.",
  constraints: ["1 <= n <= 2^31 - 1"],
  functionName: "hammingWeight",
  parameters: [{ name: "n", type: "int" }],
  returnType: "int",
  testCases: [
    {
      input: { n: 11 },
      expectedOutput: 3,
      isHidden: false,
      explanation: "11 in binary is 1011, which contains three 1 bits.",
    },
    { input: { n: 128 }, expectedOutput: 1, isHidden: false },
    { input: { n: 1 }, expectedOutput: 1, isHidden: true },
    {
      input: { n: 2147483647 },
      expectedOutput: 31,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(log n)",
  expectedSpaceComplexity: "O(1)",
},

{
  title: "Counting Bits",
  difficulty: "Easy",
  tags: ["Bit Manipulation"],
  description:
    "Given an integer n, return an array ans of length n + 1 where ans[i] is the number of 1 bits in the binary representation of i.",
  constraints: ["0 <= n <= 10^5"],
  functionName: "countBits",
  parameters: [{ name: "n", type: "int" }],
  returnType: "int[]",
  testCases: [
    {
      input: { n: 2 },
      expectedOutput: [0, 1, 1],
      isHidden: false,
    },
    {
      input: { n: 5 },
      expectedOutput: [0, 1, 1, 2, 1, 2],
      isHidden: false,
    },
    {
      input: { n: 0 },
      expectedOutput: [0],
      isHidden: true,
    },
    {
      input: { n: 8 },
      expectedOutput: [0, 1, 1, 2, 1, 2, 2, 3, 1],
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(n)",
},

{
  title: "Single Number",
  difficulty: "Easy",
  tags: ["Bit Manipulation"],
  description:
    "Given a non-empty array of integers where every element appears twice except for one element that appears exactly once, return the element that appears once.",
  constraints: [
    "1 <= nums.length <= 10^5",
    "nums.length is odd",
    "-10^9 <= nums[i] <= 10^9",
  ],
  functionName: "singleNumber",
  parameters: [{ name: "nums", type: "int[]" }],
  returnType: "int",
  testCases: [
    {
      input: { nums: [2, 2, 1] },
      expectedOutput: 1,
      isHidden: false,
    },
    {
      input: { nums: [4, 1, 2, 1, 2] },
      expectedOutput: 4,
      isHidden: false,
    },
    {
      input: { nums: [1] },
      expectedOutput: 1,
      isHidden: true,
    },
    {
      input: { nums: [-1, 2, 2, -1, 7] },
      expectedOutput: 7,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(1)",
},

{
  title: "Missing Number",
  difficulty: "Easy",
  tags: ["Bit Manipulation"],
  description:
    "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
  constraints: [
    "1 <= nums.length <= 10^5",
    "All values in nums are unique",
    "0 <= nums[i] <= nums.length",
  ],
  functionName: "missingNumber",
  parameters: [{ name: "nums", type: "int[]" }],
  returnType: "int",
  testCases: [
    {
      input: { nums: [3, 0, 1] },
      expectedOutput: 2,
      isHidden: false,
    },
    {
      input: { nums: [0, 1] },
      expectedOutput: 2,
      isHidden: false,
    },
    {
      input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] },
      expectedOutput: 8,
      isHidden: true,
    },
    {
      input: { nums: [0] },
      expectedOutput: 1,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(1)",
},

// ---------------------------------------------------------------------
// Sliding Window
// ---------------------------------------------------------------------
{
  title: "Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  tags: ["Sliding Window"],
  description:
    "Given a string s, find the length of the longest substring without repeating characters.",
  constraints: [
    "0 <= s.length <= 5*10^4",
    "s consists of English letters, digits, symbols and spaces",
  ],
  functionName: "lengthOfLongestSubstring",
  parameters: [{ name: "s", type: "string" }],
  returnType: "int",
  testCases: [
    {
      input: { s: "abcabcbb" },
      expectedOutput: 3,
      isHidden: false,
      explanation:
        'The longest substring without repeated characters is "abc".',
    },
    {
      input: { s: "bbbbb" },
      expectedOutput: 1,
      isHidden: false,
    },
    {
      input: { s: "pwwkew" },
      expectedOutput: 3,
      isHidden: true,
    },
    {
      input: { s: "" },
      expectedOutput: 0,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(min(n, character set size))",
},

{
  title: "Minimum Size Subarray Sum",
  difficulty: "Medium",
  tags: ["Sliding Window"],
  description:
    "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray whose sum is greater than or equal to target. Return 0 if no such subarray exists.",
  constraints: [
    "1 <= target <= 10^9",
    "1 <= nums.length <= 10^5",
    "1 <= nums[i] <= 10^4",
  ],
  functionName: "minSubArrayLen",
  parameters: [
    { name: "target", type: "int" },
    { name: "nums", type: "int[]" },
  ],
  returnType: "int",
  testCases: [
    {
      input: { target: 7, nums: [2, 3, 1, 2, 4, 3] },
      expectedOutput: 2,
      isHidden: false,
    },
    {
      input: { target: 4, nums: [1, 4, 4] },
      expectedOutput: 1,
      isHidden: false,
    },
    {
      input: { target: 11, nums: [1, 1, 1, 1, 1, 1, 1, 1] },
      expectedOutput: 0,
      isHidden: true,
    },
    {
      input: { target: 15, nums: [1, 2, 3, 4, 5] },
      expectedOutput: 5,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(1)",
},

{
  title: "Permutation in String",
  difficulty: "Medium",
  tags: ["Sliding Window"],
  description:
    "Given two strings s1 and s2, return true if s2 contains a permutation of s1 as a substring. A permutation uses the same characters with the same frequencies.",
  constraints: [
    "1 <= s1.length, s2.length <= 10^4",
    "s1 and s2 consist of lowercase English letters",
  ],
  functionName: "checkInclusion",
  parameters: [
    { name: "s1", type: "string" },
    { name: "s2", type: "string" },
  ],
  returnType: "boolean",
  testCases: [
    {
      input: { s1: "ab", s2: "eidbaooo" },
      expectedOutput: true,
      isHidden: false,
    },
    {
      input: { s1: "ab", s2: "eidboaoo" },
      expectedOutput: false,
      isHidden: false,
    },
    {
      input: { s1: "adc", s2: "dcda" },
      expectedOutput: true,
      isHidden: true,
    },
    {
      input: { s1: "a", s2: "a" },
      expectedOutput: true,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(1)",
},

// ---------------------------------------------------------------------
// Hard Problems
// ---------------------------------------------------------------------

{
  title: "Trapping Rain Water",
  difficulty: "Hard",
  tags: ["Arrays"],
  description:
    "Given an array height representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
  constraints: [
    "1 <= height.length <= 2*10^5",
    "0 <= height[i] <= 10^5",
  ],
  functionName: "trap",
  parameters: [{ name: "height", type: "int[]" }],
  returnType: "int",
  testCases: [
    {
      input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] },
      expectedOutput: 6,
      isHidden: false,
    },
    {
      input: { height: [4, 2, 0, 3, 2, 5] },
      expectedOutput: 9,
      isHidden: false,
    },
    {
      input: { height: [1, 2, 3, 4] },
      expectedOutput: 0,
      isHidden: true,
    },
    {
      input: { height: [3, 0, 2, 0, 4] },
      expectedOutput: 9,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(1)",
},

{
  title: "Minimum Window Substring",
  difficulty: "Hard",
  tags: ["Sliding Window"],
  description:
    "Given strings s and t, return the shortest substring of s that contains every character in t including duplicate characters. If no such substring exists, return an empty string.",
  constraints: [
    "1 <= s.length, t.length <= 10^5",
    "s and t consist of uppercase and lowercase English letters",
  ],
  functionName: "minWindow",
  parameters: [
    { name: "s", type: "string" },
    { name: "t", type: "string" },
  ],
  returnType: "string",
  testCases: [
    {
      input: { s: "ADOBECODEBANC", t: "ABC" },
      expectedOutput: "BANC",
      isHidden: false,
    },
    {
      input: { s: "a", t: "a" },
      expectedOutput: "a",
      isHidden: false,
    },
    {
      input: { s: "a", t: "aa" },
      expectedOutput: "",
      isHidden: true,
    },
    {
      input: { s: "ab", t: "b" },
      expectedOutput: "b",
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(k)",
},

{
  title: "Word Ladder",
  difficulty: "Hard",
  tags: ["Graphs"],
  description:
    "Given two words beginWord and endWord and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord. Only one letter may be changed at a time, and every transformed word must exist in wordList.",
  constraints: [
    "1 <= beginWord.length <= 10",
    "endWord.length == beginWord.length",
    "1 <= wordList.length <= 5000",
    "All words consist of lowercase English letters",
  ],
  functionName: "ladderLength",
  parameters: [
    { name: "beginWord", type: "string" },
    { name: "endWord", type: "string" },
    { name: "wordList", type: "string[]" },
  ],
  returnType: "int",
  testCases: [
    {
      input: {
        beginWord: "hit",
        endWord: "cog",
        wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
      },
      expectedOutput: 5,
      isHidden: false,
    },
    {
      input: {
        beginWord: "hit",
        endWord: "cog",
        wordList: ["hot", "dot", "dog", "lot", "log"],
      },
      expectedOutput: 0,
      isHidden: false,
    },
    {
      input: {
        beginWord: "a",
        endWord: "c",
        wordList: ["a", "b", "c"],
      },
      expectedOutput: 2,
      isHidden: true,
    },
    {
      input: {
        beginWord: "lost",
        endWord: "cost",
        wordList: ["most", "fost", "lost", "cost", "fish"],
      },
      expectedOutput: 2,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(M^2 * N)",
  expectedSpaceComplexity: "O(M * N)",
},

{
  title: "Longest Valid Parentheses",
  difficulty: "Hard",
  tags: ["Stacks & Queues"],
  description:
    "Given a string containing only '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
  constraints: [
    "0 <= s.length <= 3*10^4",
    "s consists only of '(' and ')'",
  ],
  functionName: "longestValidParentheses",
  parameters: [{ name: "s", type: "string" }],
  returnType: "int",
  testCases: [
    {
      input: { s: "(()" },
      expectedOutput: 2,
      isHidden: false,
    },
    {
      input: { s: ")()())" },
      expectedOutput: 4,
      isHidden: false,
    },
    {
      input: { s: "" },
      expectedOutput: 0,
      isHidden: true,
    },
    {
      input: { s: "()(()" },
      expectedOutput: 2,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(n)",
},

{
  title: "Edit Distance",
  difficulty: "Hard",
  tags: ["Dynamic Programming"],
  description:
    "Given two strings word1 and word2, return the minimum number of operations required to convert word1 into word2. You may insert, delete, or replace one character in a single operation.",
  constraints: [
    "0 <= word1.length, word2.length <= 500",
    "word1 and word2 consist of lowercase English letters",
  ],
  functionName: "minDistance",
  parameters: [
    { name: "word1", type: "string" },
    { name: "word2", type: "string" },
  ],
  returnType: "int",
  testCases: [
    {
      input: { word1: "horse", word2: "ros" },
      expectedOutput: 3,
      isHidden: false,
    },
    {
      input: { word1: "intention", word2: "execution" },
      expectedOutput: 5,
      isHidden: false,
    },
    {
      input: { word1: "", word2: "abc" },
      expectedOutput: 3,
      isHidden: true,
    },
    {
      input: { word1: "abc", word2: "abc" },
      expectedOutput: 0,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(m * n)",
  expectedSpaceComplexity: "O(m * n)",
},

{
  title: "N-Queens",
  difficulty: "Hard",
  tags: ["Recursion & Backtracking"],
  description:
    "Given an integer n, place n queens on an n x n chessboard so that no two queens attack each other. Return the number of distinct valid arrangements.",
  constraints: [
    "1 <= n <= 9",
  ],
  functionName: "totalNQueens",
  parameters: [{ name: "n", type: "int" }],
  returnType: "int",
  testCases: [
    {
      input: { n: 4 },
      expectedOutput: 2,
      isHidden: false,
    },
    {
      input: { n: 1 },
      expectedOutput: 1,
      isHidden: false,
    },
    {
      input: { n: 5 },
      expectedOutput: 10,
      isHidden: true,
    },
    {
      input: { n: 8 },
      expectedOutput: 92,
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n!)",
  expectedSpaceComplexity: "O(n)",
},

{
  title: "Serialize and Deserialize Binary Tree",
  difficulty: "Hard",
  tags: ["Trees"],
  description:
    "Given a binary tree represented as a level-order array, serialize its structure and values into a string, then deserialize it back and return the resulting level-order representation. A value of -1 represents a missing node.",
  constraints: [
    "0 <= tree.length <= 1000",
    "Node values are between -10^4 and 10^4",
    "-1 represents a missing node",
  ],
  functionName: "serializeDeserialize",
  parameters: [{ name: "tree", type: "int[]" }],
  returnType: "int[]",
  testCases: [
    {
      input: { tree: [1, 2, 3, -1, -1, 4, 5] },
      expectedOutput: [1, 2, 3, -1, -1, 4, 5],
      isHidden: false,
    },
    {
      input: { tree: [1, 2, -1] },
      expectedOutput: [1, 2, -1],
      isHidden: false,
    },
    {
      input: { tree: [1] },
      expectedOutput: [1],
      isHidden: true,
    },
    {
      input: { tree: [] },
      expectedOutput: [],
      isHidden: true,
    },
  ],
  expectedTimeComplexity: "O(n)",
  expectedSpaceComplexity: "O(n)",
},

{
  title: "Gas Station",
  difficulty: "Medium",
  tags: ["Greedy"],
  description:
    "There are n gas stations arranged in a circle. Given arrays gas and cost, return the starting gas station index from which you can travel around the circuit once, or -1 if it is impossible.",
  constraints: [
    "1 <= gas.length, cost.length <= 10^5",
    "gas.length == cost.length",
    "0 <= gas[i], cost[i] <= 10^4",
  ],
  functionName: "canCompleteCircuit",
  parameters: [
    { name: "gas", type: "int[]" },
    { name: "cost", type: "int[]" },
  ],
  returnType: "int",
  testCases: [
    {
      input: { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] },
      expectedOutput: 3,
      isHidden: false,
    },
    {
      input: { gas: [2, 3, 4], cost: [3, 4, 3] },
      expectedOutput: -1,
      isHidden: false,
    },
    {
      input: { gas: [5], cost: [4] },
      expectedOutput: 0,
      isHidden: true,
    },
    {
      input: { gas: [2, 3, 4], cost: [3, 2, 3] },
      expectedOutput: -1,
      isHidden: true,
    },
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

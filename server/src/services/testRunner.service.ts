import type { TestCase, TestCaseValue } from "../models/problem.model.js";
import type { Signature, SupportedLanguage } from "./driverGenerator.service.js";
import { generateHarness, SUPPORTED_LANGUAGES } from "./driverGenerator.service.js";
import { runCode } from "./piston.service.js";

export interface TestCaseResult {
  passed: boolean;
  isHidden: boolean;
  input?: Record<string, TestCaseValue>;
  expectedOutput?: TestCaseValue;
  // unknown, not TestCaseValue — this is either a successfully-parsed
  // result or raw (possibly garbage) stdout text when JSON.parse fails,
  // e.g. because the user's code crashed instead of returning normally.
  actualOutput?: unknown;
  stderr?: string;
}

export interface TestRunSummary {
  results: TestCaseResult[];
  compileError?: string;
}

function isSupportedLanguage(language: string): language is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(language);
}

// Scoped to TestCaseValue's shape (numbers/strings/booleans and flat arrays
// of those) — not a general-purpose deep-equal, doesn't need to be one.
function deepEqual(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => deepEqual(item, b[i]));
  }
  return a === b;
}

export async function runTestCases(
  language: string,
  userCode: string,
  signature: Signature,
  testCases: TestCase[],
): Promise<TestRunSummary> {
  if (!isSupportedLanguage(language)) {
    return { results: [], compileError: `Unsupported language: ${language}` };
  }

  const results: TestCaseResult[] = [];

  for (const testCase of testCases) {
    const harness = generateHarness(language, userCode, signature, testCase.input);
    // No stdin anymore — the harness has the test case's values baked in
    // as literals, nothing left for the program to read.
    const result = await runCode(language, harness, "");

    if (result.compileError) {
      return { results, compileError: result.compileError };
    }

    let actualOutput: unknown;
    let unparseable: string | undefined;
    try {
      actualOutput = JSON.parse(result.stdout);
    } catch {
      // The program ran but didn't print valid JSON — most likely it
      // crashed partway through, or the user's code never returns.
      // Treat as a failed test case rather than blowing up the request.
      unparseable = result.stdout.trim() || "(no output)";
    }

    const passed = unparseable === undefined && deepEqual(actualOutput, testCase.expectedOutput);

    results.push(
      testCase.isHidden
        ? { passed, isHidden: true }
        : {
            passed,
            isHidden: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: unparseable ?? actualOutput,
            stderr: result.stderr,
          },
    );
  }

  return { results };
}
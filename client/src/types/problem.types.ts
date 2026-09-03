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

export interface FunctionParam {
  name: string;
  type: ParamType;
}


export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topic:string;
  tags: string[];
  functionName: string;
  parameters: FunctionParam[];
  returnType: ParamType;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
}

export interface InterviewFeedback {
  correctnessSummary: string;
  observedTimeComplexity: string;
  observedSpaceComplexity: string;
  complexityMatchesExpected: boolean;
  codeQualityNotes: string;
  strengths: string[];
  areasToImprove: string[];
  followUpQuestion: string;
}

export interface TestCaseResult {
  passed: boolean;
  isHidden: boolean;
  // Killed by the sandbox before it finished — a timeout or a memory
  // limit breach (the backend can't reliably tell which, so both show
  // up this way).
  timedOut?: boolean;
  input?: Record<string, unknown>;
  expectedOutput?: unknown;
  actualOutput?: unknown;
  stderr?: string;
}

// What the "Run" button returns — full per-test-case breakdown.
export interface TestRunResult {
  compileError?: string;
  results: TestCaseResult[];
}

export type ExecuteResponse = TestRunResult;

export interface CustomTestResponse {
  compileError?: string;
  result: TestCaseResult | null;
}

export type SubmissionStatus =
  | "compile_error"
  | "time_limit_exceeded"
  | "wrong_answer"
  | "accepted";

// What "Submit" returns immediately — just the verdict, no AI feedback yet.
export interface SubmitResult {
  interviewId: string;
  compileError?: string;
  status: SubmissionStatus;
  passedTestCases: number;
  totalTestCases: number;
}

// What POST /interviews/:id/analyze returns.
export interface AnalyzeResult {
  feedback: InterviewFeedback;
}

// A single row in a problem's submission history — GET
// /interviews/problem/:problemId.
export interface SubmissionHistoryItem {
  id: string;
  language: string;
  status: SubmissionStatus;
  passedTestCases: number;
  totalTestCases: number;
  allPassed: boolean;
  createdAt: string;
}

export interface SubmissionDetail extends SubmissionHistoryItem {
  code: string;
  feedback: InterviewFeedback | null;
}

export interface ProblemTopic {
  id: string;
  name: string;
}

export interface ProblemSummary {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
}

export type TestCaseValue = string | number | boolean | TestCaseValue[];
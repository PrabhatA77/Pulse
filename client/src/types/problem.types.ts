export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  functionName: string;
  parameters: Array<{ name: string; type: string }>;
  returnType: string;
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

export interface ProblemTopic {
  id: string;
  name: string;
}

export interface ProblemSummary {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
}
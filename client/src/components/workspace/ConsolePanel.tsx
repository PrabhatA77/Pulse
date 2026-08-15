import { CheckCircle2, XCircle, Clock, Loader2, Sparkles } from "lucide-react";
import type {
  TestRunResult,
  SubmitResult,
  InterviewFeedback,
  SubmissionStatus,
} from "../../types/problem.types";
import AIFeedbackPanel from "./Aifeedbackpanel";

interface ConsolePanelProps {
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
  submitting: boolean;
  result: TestRunResult | null;
  submitResult: SubmitResult | null;
  feedback: InterviewFeedback | null;
  analyzing: boolean;
  onAnalyze: () => void;
}

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  accepted: {
    label: "Accepted",
    className:
      "border-green-200 bg-green-500/10 text-green-600 dark:border-green-900 dark:text-green-400",
    Icon: CheckCircle2,
  },
  wrong_answer: {
    label: "Wrong Answer",
    className:
      "border-red-200 bg-red-500/10 text-red-600 dark:border-red-900 dark:text-red-400",
    Icon: XCircle,
  },
  compile_error: {
    label: "Compile Error",
    className:
      "border-red-200 bg-red-500/10 text-red-600 dark:border-red-900 dark:text-red-400",
    Icon: XCircle,
  },
  time_limit_exceeded: {
    label: "Time/Memory Limit Exceeded",
    className:
      "border-amber-200 bg-amber-500/10 text-amber-600 dark:border-amber-900 dark:text-amber-400",
    Icon: Clock,
  },
};

const ConsolePanel = ({
  onRun,
  onSubmit,
  running,
  submitting,
  result,
  submitResult,
  feedback,
  analyzing,
  onAnalyze,
}: ConsolePanelProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex shrink-0 items-center justify-end gap-2 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <button
          onClick={onRun}
          disabled={running || submitting}
          className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          {running && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Run
        </button>
        <button
          onClick={onSubmit}
          disabled={running || submitting}
          className="flex items-center gap-2 rounded-lg bg-[#1a3a5c] px-3 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Submit
        </button>
      </div>

      {/* themed-scrollbar: see the CSS snippet — add it to your global stylesheet */}
      <div className="themed-scrollbar min-h-0 flex-1 overflow-auto p-4">
        {submitResult ? (
          <div className="flex flex-col gap-4">
            <div
              className={`flex items-center justify-between rounded-xl border p-3 ${STATUS_CONFIG[submitResult.status].className}`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                {(() => {
                  const { Icon } = STATUS_CONFIG[submitResult.status];
                  return <Icon className="h-4 w-4 shrink-0" />;
                })()}
                {STATUS_CONFIG[submitResult.status].label}
              </div>
              {submitResult.status !== "compile_error" && (
                <span className="text-sm font-bold">
                  {submitResult.passedTestCases}/{submitResult.totalTestCases} passed
                </span>
              )}
            </div>

            {submitResult.compileError && (
              <pre className="whitespace-pre-wrap text-sm text-red-500">
                {submitResult.compileError}
              </pre>
            )}

            {submitResult.status !== "compile_error" && !feedback && (
              <button
                onClick={onAnalyze}
                disabled={analyzing}
                className="flex w-fit items-center gap-2 rounded-lg bg-[#1a3a5c] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
              >
                {analyzing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {analyzing ? "Analyzing…" : "Analyze with AI"}
              </button>
            )}

            {feedback && <AIFeedbackPanel feedback={feedback} />}
          </div>
        ) : !result ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Run your code to see results here.</p>
        ) : result.compileError ? (
          <pre className="whitespace-pre-wrap text-sm text-red-500">{result.compileError}</pre>
        ) : (
          <div className="flex flex-col gap-3">
            {result.results.map((testCase, index) => (
              <div
                key={index}
                className={`rounded-xl border p-3 ${
                  testCase.passed
                    ? "border-green-200 bg-green-500/5 dark:border-green-900"
                    : "border-red-200 bg-red-500/5 dark:border-red-900"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
                  {testCase.passed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                  )}
                  Test case {index + 1}
                  {testCase.isHidden && <span className="text-xs font-normal text-zinc-400">(hidden)</span>}
                  {testCase.timedOut && (
                    <span className="text-xs font-normal text-amber-500">(time/memory limit exceeded)</span>
                  )}
                </div>

                {!testCase.isHidden && !testCase.timedOut && (
                  <div className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <div>Input: <code className="text-zinc-900 dark:text-white">{JSON.stringify(testCase.input)}</code></div>
                    <div>Expected: <code className="text-zinc-900 dark:text-white">{JSON.stringify(testCase.expectedOutput)}</code></div>
                    <div>Got: <code className="text-zinc-900 dark:text-white">{JSON.stringify(testCase.actualOutput)}</code></div>
                  </div>
                )}

                {testCase.stderr && <pre className="mt-2 whitespace-pre-wrap text-xs text-red-500">{testCase.stderr}</pre>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsolePanel;
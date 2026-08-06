import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { ExecuteResponse } from "../../types/problem.types";

interface ConsolePanelProps {
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
  submitting: boolean;
  result: ExecuteResponse | null;
}

const ConsolePanel = ({ onRun, onSubmit, running, submitting, result }: ConsolePanelProps) => {
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

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {!result ? (
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
                </div>

                {!testCase.isHidden && (
                  <div className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <div>Input: <code className="text-zinc-900 dark:text-white">{testCase.input}</code></div>
                    <div>Expected: <code className="text-zinc-900 dark:text-white">{testCase.expectedOutput}</code></div>
                    <div>Got: <code className="text-zinc-900 dark:text-white">{testCase.actualOutput}</code></div>
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
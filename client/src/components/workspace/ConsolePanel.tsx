import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";
import type {
  TestRunResult,
  SubmitResult,
  InterviewFeedback,
  Problem,
  TestCaseValue,
  CustomTestResponse,
} from "../../types/problem.types";
import AIFeedbackPanel from "./Aifeedbackpanel";
import { STATUS_CONFIG } from "../../utils/submissionStatus";
import ConfettiBurst from "../common/ConfettiBurst";
import { defaultCustomInputs, parseCustomInputs, customFieldHint } from "../../utils/parseCustomTestInput";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { shortcutLabel } from "../../utils/platform";

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
  problem: Problem;
  onRunCustomTest: (input: Record<string, TestCaseValue>) => Promise<CustomTestResponse>;
}

type ConsoleTab = "console" | "custom";

const tabButtonClass = (active: boolean) =>
  `rounded-md px-2.5 py-1 text-xs font-semibold transition-colors duration-150 ${
    active
      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
  }`;

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
  problem,
  onRunCustomTest,
}: ConsolePanelProps) => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("console");

  // Custom test scratchpad state — pre-filled from the problem's first
  // example (if any) so the person sees a known-good, correctly-formatted
  // value per field instead of guessing the expected format from blank.
  const [customValues, setCustomValues] = useState<Record<string, string>>(() =>
    defaultCustomInputs(problem.parameters, problem.examples[0]?.input),
  );
  const [customRunning, setCustomRunning] = useState(false);
  const [customResponse, setCustomResponse] = useState<CustomTestResponse | null>(null);
  const [customFormError, setCustomFormError] = useState<string | null>(null);

  useEffect(() => {
    setCustomValues(defaultCustomInputs(problem.parameters, problem.examples[0]?.input));
    setCustomResponse(null);
    setCustomFormError(null);
  }, [problem.id]);

  // Fires a confetti burst the moment a submission first reads "accepted"
  // — tracked via a counter (not a boolean) so submitting another
  // accepted solution retriggers it instead of no-op'ing on an unchanged value.
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const prevStatusRef = useRef<string | null>(null);
  useEffect(() => {
    if (submitResult?.status === "accepted" && prevStatusRef.current !== "accepted") {
      setConfettiTrigger((n) => n + 1);
    }
    prevStatusRef.current = submitResult?.status ?? null;
  }, [submitResult?.status]);

  const handleRunCustom = async () => {
    setCustomFormError(null);

    let parsedInput: Record<string, TestCaseValue>;
    try {
      parsedInput = parseCustomInputs(customValues, problem.parameters);
    } catch (err) {
      setCustomFormError(err instanceof Error ? err.message : "Invalid input");
      return;
    }

    setCustomRunning(true);
    setCustomResponse(null);
    try {
      const response = await onRunCustomTest(parsedInput);
      setCustomResponse(response);
    } catch (err) {
      setCustomFormError(getErrorMessage(err, "Couldn't run custom test"));
    } finally {
      setCustomRunning(false);
    }
  };

  const handleResetCustom = () => {
    setCustomValues(defaultCustomInputs(problem.parameters, problem.examples[0]?.input));
    setCustomResponse(null);
    setCustomFormError(null);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800/60">
          <button type="button" onClick={() => setActiveTab("console")} className={tabButtonClass(activeTab === "console")}>
            Console
          </button>
          <button type="button" onClick={() => setActiveTab("custom")} className={tabButtonClass(activeTab === "custom")}>
            Custom Test
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-zinc-400 dark:text-zinc-500 sm:inline">
            {shortcutLabel("run")} run · {shortcutLabel("submit")} submit
          </span>
          <button
            onClick={onRun}
            disabled={running || submitting}
            title={`Run (${shortcutLabel("run")})`}
            className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            {running && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Run
          </button>
          <button
            onClick={onSubmit}
            disabled={running || submitting}
            title={`Submit (${shortcutLabel("submit")})`}
            className="flex items-center gap-2 rounded-lg bg-[#1a3a5c] px-3 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Submit
          </button>
        </div>
      </div>

      {/* themed-scrollbar: see the CSS snippet — add it to your global stylesheet */}
      <div className="themed-scrollbar min-h-0 flex-1 overflow-auto p-4">
        {activeTab === "console" ? (
          submitResult ? (
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
          )
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Try your own input against the current code — this doesn't get graded or saved, it's just a scratchpad.
              Pre-filled with the problem's first example; edit any field below.
            </p>

            <div className="flex flex-col gap-4">
              {problem.parameters.map((param) => {
                const hint = customFieldHint(param.type);
                return (
                  <div key={param.name} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <label
                        htmlFor={`custom-${param.name}`}
                        className="font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        {param.name} =
                      </label>
                      <span className="text-[10px] uppercase tracking-wide text-zinc-400">{param.type}</span>
                    </div>

                    {param.type === "boolean" ? (
                      <select
                        id={`custom-${param.name}`}
                        value={customValues[param.name] ?? "false"}
                        onChange={(e) =>
                          setCustomValues((prev) => ({ ...prev, [param.name]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none focus:border-[#1a3a5c] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#019bf0]"
                      >
                        <option value="false">false</option>
                        <option value="true">true</option>
                      </select>
                    ) : (
                      <input
                        id={`custom-${param.name}`}
                        value={customValues[param.name] ?? ""}
                        onChange={(e) =>
                          setCustomValues((prev) => ({ ...prev, [param.name]: e.target.value }))
                        }
                        className={`w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none focus:border-[#1a3a5c] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#019bf0] ${
                          param.type.endsWith("[]") ? "font-mono text-xs" : ""
                        }`}
                      />
                    )}

                    {hint && <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{hint}</span>}
                  </div>
                );
              })}
            </div>

            {customFormError && <p className="text-xs text-red-500">{customFormError}</p>}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRunCustom}
                disabled={customRunning}
                className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                {customRunning && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Run custom test
              </button>
              <button
                type="button"
                onClick={handleResetCustom}
                className="text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Reset to example
              </button>
            </div>

            {customResponse && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
                {customResponse.compileError ? (
                  <pre className="whitespace-pre-wrap text-red-500">{customResponse.compileError}</pre>
                ) : customResponse.result ? (
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="font-semibold text-zinc-500 dark:text-zinc-400">Input</p>
                      <code className="mt-0.5 block text-zinc-700 dark:text-zinc-300">
                        {JSON.stringify(customResponse.result.input)}
                      </code>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">Output</p>
                      <code className="mt-0.5 block text-zinc-700 dark:text-zinc-300">
                        {JSON.stringify(customResponse.result.actualOutput)}
                      </code>
                    </div>
                    {customResponse.result.timedOut && (
                      <p className="text-amber-500">Timed out — check for infinite loops.</p>
                    )}
                    {customResponse.result.stderr && (
                      <pre className="whitespace-pre-wrap text-red-500">{customResponse.result.stderr}</pre>
                    )}
                  </div>
                ) : (
                  <p className="text-zinc-500 dark:text-zinc-400">No output.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfettiBurst triggerKey={confettiTrigger} />
    </div>
  );
};

export default ConsolePanel;
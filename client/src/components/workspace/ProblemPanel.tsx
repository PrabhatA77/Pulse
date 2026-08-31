import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Lightbulb,
  Layers,
  ChevronDown,
} from "lucide-react";
import type { Problem } from "../../types/problem.types";
import type { SubmissionHistoryItem } from "../../types/problem.types";
import { interviewService } from "../../services/interview.service";
import { getErrorMessage } from "../../utils/getErrorMessage";
import toast from "react-hot-toast";
import SubmissionDetailModal from "./SubmissionDetailModal";
import { problemService } from "../../services/problem.service";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  Hard: "text-red-500 bg-red-500/10",
};

const STATUS_ICON: Record<
  SubmissionHistoryItem["status"],
  typeof CheckCircle2
> = {
  accepted: CheckCircle2,
  wrong_answer: XCircle,
  compile_error: XCircle,
  time_limit_exceeded: Clock,
};

const STATUS_COLOR: Record<SubmissionHistoryItem["status"], string> = {
  accepted: "text-green-500",
  wrong_answer: "text-red-500",
  compile_error: "text-red-500",
  time_limit_exceeded: "text-amber-500",
};

const STATUS_LABEL: Record<SubmissionHistoryItem["status"], string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  compile_error: "Compile Error",
  time_limit_exceeded: "Time/Memory Limit Exceeded",
};
interface ProblemPanelProps {
  problem: Problem;
  onLoadInEditor?: (language: string, code: string) => void;
}

const ProblemPanel = ({ problem, onLoadInEditor }: ProblemPanelProps) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "description" | "history" | "hints"
  >("description");
  const [hints, setHints] = useState<string[]>([]);
  const [hintsLoading, setHintsLoading] = useState(false);
  const [history, setHistory] = useState<SubmissionHistoryItem[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);
  const [tagsOpen, setTagsOpen] = useState(false);

  const handleShowHistory = async () => {
    setActiveTab("history");
    if (history !== null) return; // already fetched — tabs don't refetch on every click
    setHistoryLoading(true);
    try {
      const { data } = await interviewService.getSubmissionHistory(problem.id);
      setHistory(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't load submission history"));
      setActiveTab("description");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRevealHint = async () => {
    const nextLevel = hints.length + 1;
    if (nextLevel > 3) return;
    setHintsLoading(true);
    try {
      const { data } = await problemService.getHint(problem.id, nextLevel);
      setHints(data.hints);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't load a hint"));
    } finally {
      setHintsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-3 flex items-center gap-1.5 self-start text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to dashboard
      </button>

      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {problem.title}
      </h2>

            <div className="mt-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>

        <button
          type="button"
          onClick={() => setTagsOpen((prev) => !prev)}
          aria-expanded={tagsOpen}
          className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          <Layers className="h-3 w-3" />
          Topics ({problem.tags.length})
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${tagsOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          tagsOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1.5">
            {problem.tags.map((t) => (
              <span
                key={t}
                className="rounded-lg bg-zinc-100 px-2 py-1 text-center text-xs font-medium leading-snug text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mt-4 flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
            activeTab === "description"
              ? "border-b-2 border-[#1a3a5c] text-[#1a3a5c] dark:border-[#019bf0] dark:text-[#019bf0]"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          Description
        </button>
        <button
          onClick={handleShowHistory}
          className={`px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
            activeTab === "history"
              ? "border-b-2 border-[#1a3a5c] text-[#1a3a5c] dark:border-[#019bf0] dark:text-[#019bf0]"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          My Submissions
        </button>

        <button
          onClick={() => setActiveTab("hints")}
          className={`px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
            activeTab === "hints"
              ? "border-b-2 border-[#1a3a5c] text-[#1a3a5c] dark:border-[#019bf0] dark:text-[#019bf0]"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          Hints
        </button>
      </div>

      {activeTab === "description" ? (
        <>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {problem.description}
          </p>

          {problem.examples.map((example, index) => (
            <div
              key={index}
              className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm dark:bg-zinc-900"
            >
              <p className="font-semibold text-zinc-900 dark:text-white">
                Example {index + 1}
              </p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                Input:{" "}
                <code className="text-zinc-900 dark:text-white">
                  {JSON.stringify(example.input)}
                </code>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Output:{" "}
                <code className="text-zinc-900 dark:text-white">
                  {JSON.stringify(example.output)}
                </code>
              </p>
              {example.explanation && (
                <p className="mt-1 text-zinc-500 dark:text-zinc-500">
                  {example.explanation}
                </p>
              )}
            </div>
          ))}

          {problem.constraints.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-zinc-900 dark:text-white">
                Constraints
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>
                    <code>{constraint}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : activeTab === "hints" ? (
          <div className="mt-4 flex flex-col gap-3">
            {hints.map((hint,index)=>(
              <div 
                key={index}
                className="rounded-xl border border-amber-200 bg-amber-500/5 p-3 text-sm text-zinc-700 dark:border-amber-900/50 dark:text-zinc-300"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Hint {index + 1}
                  </p>
                  {hint}
              </div>
            ))}

            {hints.length < 3 ? (
              <button
                onClick={handleRevealHint}
                disabled={hintsLoading}
                className="flex w-fit items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-600 transition-all duration-300 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-amber-400"
              >
                {hintsLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                ):(
                  <Lightbulb className="h-3.5 w-3.5"/>
                )}
                {hintsLoading ? "Thinking..." : hints.length === 0 ? "Show a hint" : "Show another hint"}
              </button>
            ) : (
              <p className="text-xs text-zinc-400">That's all the hints for this problem.</p>
            )}

          </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {historyLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-zinc-500 dark:text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your submissions…
            </div>
          ) : history && history.length > 0 ? (
            history.map((item) => {
              const Icon = STATUS_ICON[item.status];
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedSubmissionId(item.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200 px-3 py-2.5 text-left text-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${STATUS_COLOR[item.status]}`}
                    />
                    <div>
                      <p className={`font-medium ${STATUS_COLOR[item.status]}`}>
                        {STATUS_LABEL[item.status]}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {item.language} ·{" "}
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {item.status !== "compile_error" && (
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {item.passedTestCases}/{item.totalTestCases}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No submissions yet for this problem.
            </p>
          )}
        </div>
      )}

      {selectedSubmissionId && (
        <SubmissionDetailModal
          interviewId={selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
          onLoadInEditor={onLoadInEditor}
        />
      )}
    </div>
  );
};

export default ProblemPanel;

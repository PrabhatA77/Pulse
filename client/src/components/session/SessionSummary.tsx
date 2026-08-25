import { Loader2, Sparkles, Clock, Trophy, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SubmissionDetail } from "../../types/problem.types";
import type { InterviewSession } from "../../types/session.types";
import { STATUS_CONFIG } from "../../utils/submissionStatus";
import { formatTime } from "../../utils/formatTime";
import AIFeedbackPanel from "../workspace/Aifeedbackpanel";

interface SessionSummaryProps {
  session: InterviewSession;
  detail: SubmissionDetail;
  analyzing: boolean;
  onAnalyze: () => void;
}

const SessionSummary = ({ session, detail, analyzing, onAnalyze }: SessionSummaryProps) => {
  const navigate = useNavigate();

  const totalMs = session.durationMinutes * 60 * 1000;
  const usedMs = Math.max(
    0,
    Math.min(totalMs, new Date(detail.createdAt).getTime() - new Date(session.startedAt).getTime()),
  );
  const wasLate = session.status === "expired";
  const { Icon: StatusIcon } = STATUS_CONFIG[detail.status];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 overflow-y-auto p-1">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {wasLate ? (
            <>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-amber-500">Session expired — submitted late</span>
            </>
          ) : (
            <>
              <Trophy className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">Session completed</span>
            </>
          )}
        </div>
        <h1 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
          {session.problem?.title ?? "Mock interview"}
        </h1>

        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <Clock className="h-4 w-4" />
          Used {formatTime(usedMs)} of {session.durationMinutes}:00 allotted
        </div>
      </div>

      {/* Verdict */}
      <div className={`flex items-center justify-between rounded-2xl border p-4 ${STATUS_CONFIG[detail.status].className}`}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <StatusIcon className="h-4 w-4 shrink-0" />
          {STATUS_CONFIG[detail.status].label}
        </div>
        {detail.status !== "compile_error" && (
          <span className="text-sm font-bold">
            {detail.passedTestCases}/{detail.totalTestCases} passed
          </span>
        )}
      </div>

      {/* Submitted code */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Your submission ({detail.language})
        </p>
        <pre className="max-h-72 overflow-auto rounded-xl bg-zinc-50 p-3 text-xs text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          <code>{detail.code}</code>
        </pre>
      </div>

      {/* AI feedback */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        {detail.status === "compile_error" ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            AI feedback isn't available for submissions that failed to compile.
          </p>
        ) : detail.feedback ? (
          <AIFeedbackPanel feedback={detail.feedback} />
        ) : (
          <button
            onClick={onAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 rounded-lg bg-[#1a3a5c] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
          >
            {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {analyzing ? "Analyzing…" : "Analyze with AI"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pb-2">
        <button
          onClick={() => navigate("/session/new")}
          className="rounded-xl bg-[#1a3a5c] px-4 py-2.5 text-sm font-semibold text-white shadow transition-all duration-300 hover:opacity-90 dark:bg-[#019bf0]"
        >
          Start another mock interview
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
};

export default SessionSummary;
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { RecentInterview } from "../../types/dashboard.types";
import FeedbackModal from "../workspace/FeedbackModal";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  Hard: "text-red-500 bg-red-500/10",
};

function testCaseColor(passed: number, total: number): string {
  if (total === 0) return "text-red-500";
  if (passed === total) return "text-green-500";
  if (passed > 0) return "text-amber-500";
  return "text-red-500";
}

const TABS: { id: "practice" | "session"; label: string }[] = [
  { id: "practice", label: "Practice" },
  { id: "session", label: "Timed Sessions" },
];

interface RecentInterviewsProps {
  interviews: RecentInterview[];
}

const RecentInterviews = ({ interviews }: RecentInterviewsProps) => {
  const [selected, setSelected] = useState<RecentInterview | null>(null);
  const [tab, setTab] = useState<"practice" | "session">("practice");

  const filtered = interviews.filter((i) => i.source === tab);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Interviews</h2>

        <div className="relative flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative z-10 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                tab === t.id ? "text-white" : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="recent-interviews-tab"
                  transition={{ type: "spring", duration: 0.4 }}
                  className="absolute inset-0 -z-10 rounded-full bg-[#1a3a5c] dark:bg-[#019bf0]"
                />
              )}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          {tab === "practice"
            ? "No practice submissions yet — solve a problem to see it here."
            : "No timed session submissions yet — start a mock interview to see it here."}
        </p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
          {filtered.map((interview) => (
            <div key={interview.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{interview.problemTitle}</p>
                <div className="mt-1 flex items-center gap-2">
                  {interview.difficulty && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[interview.difficulty]}`}>
                      {interview.difficulty}
                    </span>
                  )}
                  <span className="text-xs text-zinc-400">{new Date(interview.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {interview.allPassed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-bold ${testCaseColor(interview.passedTestCases, interview.totalTestCases)}`}>
                  {interview.passedTestCases}/{interview.totalTestCases}
                </span>
                {interview.feedback ? (
                  <button
                    onClick={() => setSelected(interview)}
                    className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-semibold text-zinc-900 transition-all duration-300 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                  >
                    Review
                  </button>
                ) : (
                  <span className="text-xs text-zinc-400">Not analyzed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected?.feedback && (
        <FeedbackModal
          feedback={selected.feedback}
          passedTestCases={selected.passedTestCases}
          totalTestCases={selected.totalTestCases}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default RecentInterviews;
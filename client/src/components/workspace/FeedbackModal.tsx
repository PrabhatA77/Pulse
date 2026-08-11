import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle } from "lucide-react";
import type { InterviewFeedback } from "../../types/problem.types";

interface FeedbackModalProps {
  feedback: InterviewFeedback;
  onClose: () => void;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
}

const FeedbackModal = ({ feedback, onClose }: FeedbackModalProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Interview complete</p>
              <p className={`text-4xl font-bold ${scoreColor(feedback.score)}`}>
                {feedback.score}
                <span className="text-lg text-zinc-400">/100</span>
              </p>
            </div>
            <button onClick={onClose} className="text-zinc-400 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{feedback.correctnessSummary}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Time complexity</p>
              <p className="mt-1 font-semibold text-zinc-900 dark:text-white">{feedback.observedTimeComplexity}</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Space complexity</p>
              <p className="mt-1 font-semibold text-zinc-900 dark:text-white">{feedback.observedSpaceComplexity}</p>
            </div>
          </div>

          <div className={`mt-3 flex items-center gap-2 rounded-xl p-3 text-sm ${feedback.complexityMatchesExpected ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"}`}>
            {feedback.complexityMatchesExpected ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
            {feedback.complexityMatchesExpected ? "Matches the expected complexity for this problem." : "Doesn't match the optimal complexity for this problem."}
          </div>

          <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{feedback.codeQualityNotes}</p>

          {feedback.strengths.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Strengths</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {feedback.areasToImprove.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Areas to improve</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {feedback.areasToImprove.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-4 rounded-xl bg-[#1a3a5c]/5 p-3 dark:bg-[#019bf0]/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1a3a5c] dark:text-[#019bf0]">Follow-up question</p>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{feedback.followUpQuestion}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
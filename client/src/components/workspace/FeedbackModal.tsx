import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { InterviewFeedback } from "../../types/problem.types";
import AIFeedbackPanel from "./Aifeedbackpanel";

interface FeedbackModalProps {
  feedback: InterviewFeedback;
  passedTestCases: number;
  totalTestCases: number;
  onClose: () => void;
}

function testCaseColor(passed: number, total: number): string {
  if (total === 0) return "text-red-500";
  if (passed === total) return "text-green-500";
  if (passed > 0) return "text-amber-500";
  return "text-red-500";
}

const FeedbackModal = ({ feedback, passedTestCases, totalTestCases, onClose }: FeedbackModalProps) => {
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
          className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex shrink-0 items-start justify-between p-6 pb-0">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Test Cases Passed</p>
              <p className={`text-4xl font-bold ${testCaseColor(passedTestCases, totalTestCases)}`}>
                {passedTestCases}
                <span className="text-lg text-zinc-400">/{totalTestCases}</span>
              </p>
            </div>
            <button onClick={onClose} className="text-zinc-400 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* themed-scrollbar: see the CSS snippet — add it to your global stylesheet */}
          <div className="themed-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto p-6 pt-0">
            <AIFeedbackPanel feedback={feedback} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
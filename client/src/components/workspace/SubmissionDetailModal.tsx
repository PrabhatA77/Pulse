import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import type { SubmissionDetail } from "../../types/problem.types";
import { interviewService } from "../../services/interview.service";
import { getErrorMessage } from "../../utils/getErrorMessage";
import AIFeedbackPanel from "./Aifeedbackpanel";
import { STATUS_CONFIG } from "../../utils/submissionStatus";


interface SubmissionDetailModalProps {
  interviewId: string;
  onClose: () => void;
}

const SubmissionDetailModal = ({ interviewId, onClose }: SubmissionDetailModalProps) => {
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await interviewService.getById(interviewId);
        if (!cancelled) setDetail(data);
      } catch (error) {
        if (!cancelled) {
          toast.error(getErrorMessage(error, "Couldn't load that submission"));
          onClose();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const handleAnalyze = async () => {
    if (!detail) return;
    setAnalyzing(true);
    try {
      const { data } = await interviewService.analyze(detail.id);
      setDetail({ ...detail, feedback: data.feedback });
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't get AI feedback"));
    } finally {
      setAnalyzing(false);
    }
  };

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
          className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {detail ? `${detail.language} submission` : "Submission"}
            </p>
            <button
              onClick={onClose}
              className="text-zinc-400 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="themed-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
            {loading || !detail ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-zinc-500 dark:text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div
                  className={`flex items-center justify-between rounded-xl border p-3 ${STATUS_CONFIG[detail.status].className}`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {(() => {
                      const { Icon } = STATUS_CONFIG[detail.status];
                      return <Icon className="h-4 w-4 shrink-0" />;
                    })()}
                    {STATUS_CONFIG[detail.status].label}
                  </div>
                  {detail.status !== "compile_error" && (
                    <span className="text-sm font-bold">
                      {detail.passedTestCases}/{detail.totalTestCases} passed
                    </span>
                  )}
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Code
                  </p>
                  <pre className="max-h-80 overflow-auto rounded-xl bg-zinc-50 p-3 text-xs text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                    <code>{detail.code}</code>
                  </pre>
                </div>

                {detail.status !== "compile_error" && !detail.feedback && (
                  <button
                    onClick={handleAnalyze}
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

                {detail.feedback && <AIFeedbackPanel feedback={detail.feedback} />}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubmissionDetailModal;
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Clock3, HardDrive, CheckCircle2, LoaderCircle } from "lucide-react";

import StatusCard from "./StatusCard";
import type { AnalysisResult } from "./types";

interface AnalysisPanelProps {
  result: AnalysisResult;
  finishedTyping: boolean;
  /** Called once every card has finished revealing its value. */
  onRevealComplete?: () => void;
}

// Matches the "wait ~700ms after typing" pause, then each card spends this
// long showing "Calculating..." before it flips to the real value.
const ANALYZING_PAUSE_MS = 700;
const CARD_REVEAL_STEP_MS = 550;
const TOTAL_STEPS = 4; // 1 = passed badge, 2/3/4 = time / space / insight

const AnalysisPanel = ({ result, finishedTyping, onRevealComplete }: AnalysisPanelProps) => {
  const [revealStep, setRevealStep] = useState(0);

  // Reset back to 0 the moment finishedTyping flips to false — done during
  // render (React's "adjusting state when a prop changes" pattern) rather
  // than in the Effect below, so there's no synchronous setState at the
  // top of the Effect body and no extra render+paint showing a stale step.
  const [prevFinishedTyping, setPrevFinishedTyping] = useState(finishedTyping);
  if (finishedTyping !== prevFinishedTyping) {
    setPrevFinishedTyping(finishedTyping);
    if (!finishedTyping) {
      setRevealStep(0);
    }
  }

  useEffect(() => {
    if (!finishedTyping) return;

    const timers = [1, 2, 3, 4].map((step) =>
      setTimeout(
        () => setRevealStep(step),
        ANALYZING_PAUSE_MS + (step - 1) * CARD_REVEAL_STEP_MS
      )
    );

    return () => timers.forEach(clearTimeout);
  }, [finishedTyping]);

  useEffect(() => {
    if (revealStep === TOTAL_STEPS) {
      onRevealComplete?.();
    }
  }, [revealStep, onRevealComplete]);

  const showPassed = revealStep >= 1;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col justify-start rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-800">
      <div className="shrink-0">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">AI Analysis</h3>
        <p className="mt-1 text-sm text-zinc-500">Evaluating submitted solution...</p>
      </div>

      {/* Scrollable as a safety net only (see CodeWindow's code area for
          why) — spacing below is tuned so the three cards plus the badge
          fit inside the panel's fixed height without needing it. */}
      <div className="mt-5 min-h-0 flex-1 overflow-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <AnimatePresence mode="wait">
          {revealStep === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-zinc-500"
            >
              <LoaderCircle className="animate-spin" size={22} />
              <span>Analyzing...</span>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: showPassed ? 1 : 0, scale: showPassed ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
                className="mb-4 flex items-center gap-3 rounded-xl bg-green-500/10 p-3 text-green-500"
              >
                <CheckCircle2 />
                <span className="font-semibold">{result.status}</span>
              </motion.div>

              <div className="space-y-3">
                <StatusCard
                  title="Time Complexity"
                  value={result.timeComplexity}
                  icon={Clock3}
                  delay={0.1}
                  loading={revealStep < 2}
                />
                <StatusCard
                  title="Space Complexity"
                  value={result.spaceComplexity}
                  icon={HardDrive}
                  delay={0.2}
                  loading={revealStep < 3}
                />
                <StatusCard
                  title="AI Insight"
                  value={result.insight}
                  icon={Brain}
                  delay={0.3}
                  loading={revealStep < 4}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisPanel;
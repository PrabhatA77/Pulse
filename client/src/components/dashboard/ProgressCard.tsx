import { useState } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedCounter from "../common/AnimatedCounter";

interface LeetCodeProgressCardProps {
  easySolved?: number;
  easyTotal?: number;
  mediumSolved?: number;
  mediumTotal?: number;
  hardSolved?: number;
  hardTotal?: number;
}

export const LeetCodeProgressCard = ({
  easySolved = 0,
  easyTotal = 10,
  mediumSolved = 0,
  mediumTotal = 10,
  hardSolved = 0,
  hardTotal = 10,
}: LeetCodeProgressCardProps) => {
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalProblems = easyTotal + mediumTotal + hardTotal;

  // SVG Geometry
  const size = 150;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment ratios
  const easyRatio = totalProblems > 0 ? easyTotal / totalProblems : 0.33;
  const medRatio = totalProblems > 0 ? mediumTotal / totalProblems : 0.33;
  const hardRatio = totalProblems > 0 ? hardTotal / totalProblems : 0.33;

  const easyTrackLen = circumference * easyRatio;
  const medTrackLen = circumference * medRatio;
  const hardTrackLen = circumference * hardRatio;

  const easyProgressLen =
    easyTotal > 0 ? (easySolved / easyTotal) * easyTrackLen : 0;
  const medProgressLen =
    mediumTotal > 0 ? (mediumSolved / mediumTotal) * medTrackLen : 0;
  const hardProgressLen =
    hardTotal > 0 ? (hardSolved / hardTotal) * hardTrackLen : 0;

  // Gaps & Offsets (start rotated so Easy starts at bottom-left like LeetCode)
  const offsetEasy = circumference * 0.25;
  const offsetMed = offsetEasy - easyTrackLen;
  const offsetHard = offsetMed - medTrackLen;

  type Segment = "easy" | "medium" | "hard";

  const SEGMENT_LABEL: Record<Segment, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };
  const SEGMENT_COLOR: Record<Segment, string> = {
    easy: "text-[#00b8a3]",
    medium: "text-[#ffc01e]",
    hard: "text-[#ef4743]",
  };

  const [hovered, setHovered] = useState<Segment | null>(null);

  const segmentData: Record<Segment, { solved: number; total: number }> = {
    easy: { solved: easySolved, total: easyTotal },
    medium: { solved: mediumSolved, total: mediumTotal },
    hard: { solved: hardSolved, total: hardTotal },
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl transition-all duration-300 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 sm:flex-row">
      {/* Circular Gauge */}
      {/* Circular Gauge */}
      <div className="relative flex h-37.5 w-37.5 shrink-0 items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background Tracks */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#00b8a3"
            strokeOpacity="0.15"
            strokeWidth={strokeWidth}
            strokeDasharray={`${easyTrackLen - 4} ${circumference}`}
            strokeDashoffset={-offsetEasy}
            strokeLinecap="round"
            style={{ pointerEvents: "stroke", cursor: "pointer" }}
            onMouseEnter={() => setHovered("easy")}
            onMouseLeave={() => setHovered(null)}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ffc01e"
            strokeOpacity="0.15"
            strokeWidth={strokeWidth}
            strokeDasharray={`${medTrackLen - 4} ${circumference}`}
            strokeDashoffset={-offsetMed}
            strokeLinecap="round"
            style={{ pointerEvents: "stroke", cursor: "pointer" }}
            onMouseEnter={() => setHovered("medium")}
            onMouseLeave={() => setHovered(null)}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ef4743"
            strokeOpacity="0.15"
            strokeWidth={strokeWidth}
            strokeDasharray={`${hardTrackLen - 4} ${circumference}`}
            strokeDashoffset={-offsetHard}
            strokeLinecap="round"
            style={{ pointerEvents: "stroke", cursor: "pointer" }}
            onMouseEnter={() => setHovered("hard")}
            onMouseLeave={() => setHovered(null)}
          />

          {/* Active Progress Segments (unchanged, no hover needed here) */}
          {easyProgressLen > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#00b8a3"
              strokeWidth={strokeWidth}
              strokeDasharray={`${easyProgressLen} ${circumference}`}
              strokeDashoffset={-offsetEasy}
              strokeLinecap="round"
              className="pointer-events-none transition-all duration-700 ease-out"
            />
          )}
          {medProgressLen > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#ffc01e"
              strokeWidth={strokeWidth}
              strokeDasharray={`${medProgressLen} ${circumference}`}
              strokeDashoffset={-offsetMed}
              strokeLinecap="round"
              className="pointer-events-none transition-all duration-700 ease-out"
            />
          )}
          {hardProgressLen > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#ef4743"
              strokeWidth={strokeWidth}
              strokeDasharray={`${hardProgressLen} ${circumference}`}
              strokeDashoffset={-offsetHard}
              strokeLinecap="round"
              className="pointer-events-none transition-all duration-700 ease-out"
            />
          )}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${SEGMENT_COLOR[hovered]}`}
                >
                  {SEGMENT_LABEL[hovered]}
                </span>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {segmentData[hovered].solved}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    /{segmentData[hovered].total}
                  </span>
                </div>
                <span className="mt-0.5 text-[10px] text-zinc-400">solved</span>
              </motion.div>
            ) : (
              <motion.div
                key="total"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-baseline">
                  <AnimatedCounter
                    value={totalSolved}
                    className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs font-semibold text-zinc-400">
                    /{totalProblems}
                  </span>
                </div>
                <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                  <Check className="h-3 w-3 stroke-3" /> Solved
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Difficulty Breakdown Badges */}
      <div className="flex w-full flex-1 flex-col gap-2">
        {/* Easy */}
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-3.5 py-2 dark:bg-zinc-800/60">
          <span className="text-xs font-semibold text-[#00b8a3]">Easy</span>
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            {easySolved}
            <span className="font-normal text-zinc-400">/{easyTotal}</span>
          </span>
        </div>

        {/* Medium */}
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-3.5 py-2 dark:bg-zinc-800/60">
          <span className="text-xs font-semibold text-[#ffc01e]">Med.</span>
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            {mediumSolved}
            <span className="font-normal text-zinc-400">/{mediumTotal}</span>
          </span>
        </div>

        {/* Hard */}
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 px-3.5 py-2 dark:bg-zinc-800/60">
          <span className="text-xs font-semibold text-[#ef4743]">Hard</span>
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            {hardSolved}
            <span className="font-normal text-zinc-400">/{hardTotal}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeProgressCard;

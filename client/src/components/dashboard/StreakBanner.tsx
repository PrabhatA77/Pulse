import { Flame, PartyPopper } from "lucide-react";

interface StreakBannerProps {
  currentStreak: number;
  solvedToday: boolean;
}

const StreakBanner = ({ currentStreak, solvedToday }: StreakBannerProps) => {
  if (currentStreak === 0) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 shadow-xl transition-all duration-300 ${
        solvedToday
          ? "border-emerald-200 bg-emerald-500/5 dark:border-emerald-900/50"
          : "border-amber-200 bg-amber-500/5 dark:border-amber-900/50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          solvedToday
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-amber-500/10 text-amber-500"
        }`}
      >
        {solvedToday ? <PartyPopper className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
      </div>

      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
          {currentStreak} day{currentStreak === 1 ? "" : "s"} streak
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {solvedToday
            ? "You've already kept it alive today — nice work."
            : "Solve one problem today to keep it going."}
        </p>
      </div>
    </div>
  );
};

export default StreakBanner;
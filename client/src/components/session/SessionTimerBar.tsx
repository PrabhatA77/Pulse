import { Clock } from "lucide-react";

interface SessionTimerBarProps {
  remainingMs: number;
  durationMinutes: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const SessionTimerBar = ({ remainingMs, durationMinutes }: SessionTimerBarProps) => {
  const totalMs = durationMinutes * 60 * 1000;
  const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const isLow = remainingMs < 5 * 60 * 1000;

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <Clock className={`h-4 w-4 ${isLow ? "text-red-500" : "text-[#019bf0]"}`} />
      <span className={`font-mono text-sm font-bold ${isLow ? "text-red-500" : "text-zinc-900 dark:text-white"}`}>
        {formatTime(remainingMs)}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? "bg-red-500" : "bg-[#019bf0]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default SessionTimerBar;
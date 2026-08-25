import { useMemo } from "react";
import type { ActivityDay } from "../../types/dashboard.types";
import { Flame } from "lucide-react";

interface ActivityGraphProps {
  activityByDay: ActivityDay[];
  currentStreak: number;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function colorForCount(count: number): string {
  if (count === 0) return "bg-zinc-100 dark:bg-zinc-800/80";
  if (count === 1) return "bg-[#019bf0]/30";
  if (count === 2) return "bg-[#019bf0]/65";
  return "bg-[#019bf0]";
}

interface MonthData {
  monthName: string;
  year: number;
  cells: Array<{
    date: string | null;
    count: number;
    isFuture: boolean;
  }>;
}

const ActivityGraph = ({
  activityByDay,
  currentStreak,
}: ActivityGraphProps) => {
  const countByDate = useMemo(() => {
    return new Map(activityByDay.map((d) => [d.date, d.count]));
  }, [activityByDay]);

  // Calculate total submissions and active days
  const totalSubmissions = useMemo(() => {
    return activityByDay.reduce((acc, curr) => acc + curr.count, 0);
  }, [activityByDay]);

  // Generate 12 months (from 11 months ago to current month)
  const monthsData = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const months: MonthData[] = [];

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const year = monthDate.getFullYear();
      const monthIndex = monthDate.getMonth();
      const monthName = MONTH_NAMES[monthIndex];

      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      // Day of week for 1st of month: 0 (Sunday) to 6 (Saturday)
      const startDayOfWeek = new Date(year, monthIndex, 1).getDay();

      const cells: MonthData["cells"] = [];

      // 1. Leading empty cells to align the 1st day to its weekday row
      for (let pad = 0; pad < startDayOfWeek; pad++) {
        cells.push({ date: null, count: 0, isFuture: false });
      }

      // 2. Actual days in this month
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, monthIndex, day);
        const dateStr = d.toISOString().slice(0, 10);
        const isFuture = dateStr > todayStr;

        cells.push({
          date: dateStr,
          count: countByDate.get(dateStr) ?? 0,
          isFuture,
        });
      }

      // 3. Trailing empty cells to fill the last column to 7 rows
      const remaining = (7 - (cells.length % 7)) % 7;
      for (let pad = 0; pad < remaining; pad++) {
        cells.push({ date: null, count: 0, isFuture: false });
      }

      months.push({
        monthName,
        year,
        cells,
      });
    }

    return months;
  }, [countByDate]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white sm:text-lg">
            Activity
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              {totalSubmissions} submissions in the last 12 months
            </p>
            {currentStreak > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 sm:text-sm">
                <Flame className="h-3.5 w-3.5" />
                {currentStreak} day{currentStreak === 1 ? "" : "s"} streak
              </span>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 sm:gap-1.5 sm:text-xs">
          <span>Less</span>
          <div className="h-2 w-2 rounded-xs bg-zinc-100 dark:bg-zinc-800 sm:h-2.5 sm:w-2.5" />
          <div className="h-2 w-2 rounded-xs bg-[#019bf0]/30 sm:h-2.5 sm:w-2.5" />
          <div className="h-2 w-2 rounded-xs bg-[#019bf0]/65 sm:h-2.5 sm:w-2.5" />
          <div className="h-2 w-2 rounded-xs bg-[#019bf0] sm:h-2.5 sm:w-2.5" />
          <span>More</span>
        </div>
      </div>

      {/* Scrollable Container on ultra-small screens / Perfectly spaced grid */}
      <div className="mt-4 w-full overflow-x-auto pb-1 sm:mt-6">
        <div className="flex min-w-155 items-start justify-between md:min-w-0">
          {monthsData.map((m, mIdx) => (
            <div
              key={`${m.year}-${m.monthName}-${mIdx}`}
              className="flex flex-col items-center"
            >
              {/* Scaled Month Label */}
              <span className="mb-1.5 select-none text-[9px] font-medium text-zinc-400 dark:text-zinc-500 sm:mb-2 sm:text-[11px]">
                {m.monthName}
              </span>

              {/* 7-row calendar grid */}
              <div className="grid grid-flow-col grid-rows-7 gap-[1.5px] sm:gap-[2.5px] md:gap-0.75">
                {m.cells.map((cell, cIdx) => {
                  if (!cell.date) {
                    return (
                      <div
                        key={`empty-${cIdx}`}
                        className="h-1.5 w-1.5 opacity-0 sm:h-2 sm:w-2 md:h-2.75 md:w-2.75"
                      />
                    );
                  }

                  return (
                    <div
                      key={cell.date}
                      title={
                        cell.isFuture
                          ? undefined
                          : `${cell.date}: ${cell.count} interview${
                              cell.count === 1 ? "" : "s"
                            }`
                      }
                      className={`h-1.5 w-1.5 rounded-[1.5px] transition-transform duration-150 hover:scale-125 sm:h-2 sm:w-2 sm:rounded-xs md:h-2.75 md:w-2.75 ${
                        cell.isFuture
                          ? "bg-transparent"
                          : colorForCount(cell.count)
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityGraph;

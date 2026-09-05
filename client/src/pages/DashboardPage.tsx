import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { dashboardService } from "../services/dashboard.service";
import { getErrorMessage } from "../utils/getErrorMessage";
import QuickStart from "../components/dashboard/QuickStart";
import ActivityGraph from "../components/dashboard/ActivityGraph";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import LeetCodeProgressCard from "../components/dashboard/ProgressCard";
import type { DashboardData } from "../types/dashboard.types";
import StreakBanner from "../components/dashboard/StreakBanner";
import {
  Sparkles,
  LogOut,
  Target,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import AnimatedCounter from "../components/common/AnimatedCounter";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function isSolvedToday(
  activityByDay: { date: string; count: number }[],
): boolean {
  const todayStr = new Date().toISOString().slice(0, 10);
  return activityByDay.some((d) => d.date === todayStr && d.count > 0);
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await dashboardService.get();
        setData(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't load dashboard"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 dark:bg-[#0e1316] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {/* Inline Back Button & Greeting Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </button>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#019bf0]/20 bg-[#019bf0]/10 px-2.5 py-0.5 text-xs font-semibold text-[#019bf0]">
                <Sparkles className="h-3 w-3" />
                {getTimeGreeting()}
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-[#1a3a5c] via-[#019bf0] to-[#019bf0] bg-clip-text text-transparent dark:from-white dark:via-[#019bf0] dark:to-[#019bf0]">
                {user?.username ?? "Developer"}
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              Ready to sharpen your problem-solving skills today?
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin/problems")}
                className="group flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
              >
                Manage Problems
              </button>
            )}

            <button
              onClick={handleLogout}
              className="group flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
            >
              <LogOut className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : data ? (
          <>
            <StreakBanner
              currentStreak={data.stats.currentStreak}
              solvedToday={isSolvedToday(data.activityByDay)}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Total Attempts */}
              <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl transition-all duration-300 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Total Attempts
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#019bf0]/10 text-[#019bf0]">
                    <Target className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <AnimatedCounter
                    value={data.stats.totalInterviews}
                    className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl"
                  />
                  <span className="text-xs font-medium text-zinc-400">
                    sessions
                  </span>
                </div>
              </div>

              {/* Total Solved */}
              <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl transition-all duration-300 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Total Solved
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <AnimatedCounter
                    value={data.stats.totalSolved}
                    className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl"
                  />
                  <span className="text-xs font-medium text-zinc-400">
                    accepted
                  </span>
                </div>
              </div>

              {/* LeetCode-style Progress Gauge */}
              <LeetCodeProgressCard
                easySolved={data.progress.easySolved}
                easyTotal={data.progress.easyTotal}
                mediumSolved={data.progress.mediumSolved}
                mediumTotal={data.progress.mediumTotal}
                hardSolved={data.progress.hardSolved}
                hardTotal={data.progress.hardTotal}
              />
            </div>

            <QuickStart />
            <ActivityGraph
              activityByDay={data.activityByDay}
              currentStreak={data.stats.currentStreak}
            />
            <RecentInterviews interviews={data.recentInterviews} />
          </>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Couldn't load your dashboard.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

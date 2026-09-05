import Skeleton from "../common/Skeleton";

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900";

/** Mirrors DashboardPage's real layout so the swap-in feels seamless, not jarring. */
const DashboardSkeleton = () => (
  <div className="flex flex-col gap-6">
    {/* Streak banner */}
    <Skeleton className="h-16 w-full rounded-2xl" />

    {/* Stat cards row */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className={cardClass}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-9 w-20" />
      </div>
      <div className={cardClass}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-9 w-20" />
      </div>
      <div className={`${cardClass} flex-row items-center gap-4 sm:flex`}>
        <Skeleton className="h-37.5 w-37.5 shrink-0 rounded-full" />
        <div className="flex w-full flex-1 flex-col gap-2">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </div>

    {/* Quick start */}
    <div className={cardClass}>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-2 h-3 w-64" />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-16 flex-1 rounded-xl" />
        <Skeleton className="h-16 flex-1 rounded-xl" />
        <Skeleton className="h-10.5 w-full rounded-xl sm:w-32" />
      </div>
    </div>

    {/* Activity graph */}
    <div className={cardClass}>
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-2 h-3 w-40" />
      <Skeleton className="mt-6 h-24 w-full" />
    </div>

    {/* Recent interviews */}
    <div className={cardClass}>
      <Skeleton className="h-5 w-40" />
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
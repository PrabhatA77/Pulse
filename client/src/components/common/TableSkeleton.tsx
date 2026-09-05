import Skeleton from "./Skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  /** Renders an extra right-aligned "actions" column, like the admin table has. */
  withActions?: boolean;
}

/** Generic row-shaped skeleton for any table list (Problems, Admin Problems, Topics...). */
const TableSkeleton = ({ rows = 8, columns = 3, withActions = false }: TableSkeletonProps) => (
  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center gap-4 px-5 py-4">
        <Skeleton className="h-4 w-1/4 min-w-24" />
        {Array.from({ length: Math.max(0, columns - 1) }).map((_, c) => (
          <Skeleton key={c} className="h-4 w-16" />
        ))}
        {withActions && (
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
            <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
          </div>
        )}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
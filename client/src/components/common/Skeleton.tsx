interface SkeletonProps {
  className?: string;
}

/** Base shimmer block — compose these into layout-shaped skeletons. */
const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 ${className}`} />
);

export default Skeleton;
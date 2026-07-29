import { useAuthStore } from "../../store/authStore";

const StatusBadge = () => {
  const { user } = useAuthStore();

  const isOnline = Boolean(user);
  const color = isOnline ? "bg-emerald-500" : "bg-zinc-500";
  const label = isOnline ? `${user?.username ?? 'User'} • Online` : "System Idle";

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="inline-flex items-center gap-3 rounded-full border border-gray-300/50 bg-gray-200/60 px-5 py-1.5 shadow-sm backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-800/60"
    >
      {/* Status Dot (Static) */}
      <div className="flex items-center justify-center" aria-hidden="true">
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
      </div>

      {/* Status Text */}
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-zinc-300">
        {label}
      </span>
    </div>
  );
};

export default StatusBadge;
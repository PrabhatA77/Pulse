import { useAuthStore } from "../../store/authStore";

const StatusBadge = () => {
  const { user } = useAuthStore();

  const isOnline = Boolean(user);
  const dotColor = isOnline ? "bg-emerald-500" : "bg-zinc-400";
  const pingColor = isOnline ? "bg-emerald-400" : "bg-zinc-400";
  const label = isOnline ? `${user?.username ?? "User"} • Online` : "AI Engine Ready";

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/20 bg-blue-50/50 px-4 py-1.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 dark:border-zinc-700/60 dark:bg-zinc-800/60"
    >
      {/* Animated Ping Dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${pingColor}`} />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
      </span>

      {/* Status Text */}
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
        {label}
      </span>
    </div>
  );
};

export default StatusBadge;
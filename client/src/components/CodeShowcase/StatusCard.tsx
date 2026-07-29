import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  delay?: number;
  /** Shows a "Calculating…" placeholder instead of the real value. */
  loading?: boolean;
}

const StatusCard = ({ title, value, icon: Icon, delay = 0, loading = false }: StatusCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-blue-500/10 p-2 text-blue-500">
          <Icon size={18} />
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{title}</span>

          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-1 text-base font-semibold text-zinc-400 dark:text-zinc-600"
              >
                Calculating…
              </motion.span>
            ) : (
              <motion.span
                key="value"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1 text-base font-semibold text-zinc-900 dark:text-white"
              >
                {value}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;
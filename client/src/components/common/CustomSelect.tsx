import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface Option<T extends string = string> {
  value: T;
  label: string;
  badge?: string;
  dotClass?: string;
}

interface CustomSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[] | T[];
  label?: string;
  icon?: ReactNode;
  placeholder?: string;
  className?: string;
}

export function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  icon,
  placeholder = "Select...",
  className = "",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: Option<T>[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex-1 ${className}`}>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {icon}
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between gap-2 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#019bf0]/30 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.badge && (
            <span className="flex h-5 min-w-6 items-center justify-center rounded-md bg-zinc-200 px-1 text-[10px] font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
              {selectedOption.badge}
            </span>
          )}
          {selectedOption?.dotClass && (
            <span className={`h-2.5 w-2.5 rounded-full ${selectedOption.dotClass}`} />
          )}
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full min-w-44 origin-top overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1.5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            {label && (
              <div className="px-2.5 pb-1.5 pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Select {label}
                </p>
              </div>
            )}

            {normalizedOptions.map((opt) => {
              const selected = opt.value === value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 ${
                    selected
                      ? "bg-[#019bf0]/10 font-medium text-[#019bf0]"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {opt.badge && (
                    <span
                      className={`flex h-5 min-w-6 items-center justify-center rounded-md px-1 text-[10px] font-bold ${
                        selected
                          ? "bg-[#019bf0]/15 text-[#019bf0]"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                  {opt.dotClass && (
                    <span className={`h-2 w-2 rounded-full ${opt.dotClass}`} />
                  )}

                  <span className="flex-1 truncate">{opt.label}</span>

                  {selected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Check className="h-4 w-4 text-[#019bf0]" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
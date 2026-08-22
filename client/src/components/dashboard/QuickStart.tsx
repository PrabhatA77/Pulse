import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Sparkles, Layers, Gauge } from "lucide-react";

import toast from "react-hot-toast";
import { problemService } from "../../services/problem.service";
import { getErrorMessage } from "../../utils/getErrorMessage";

// const TOPICS = [
//   "Arrays",
//   "Strings",
//   "Linked List",
//   "Stacks & Queues",
//   "Trees",
//   "Graphs",
//   "Dynamic Programming",
//   "Recursion & BackTracking",
//   "Sorting & Searching",
//   "Greedy",
// ];

const TOPIC_BADGES: Record<string, string> = {
  Arrays: "ARR",
  Strings: "STR",
  "Linked List": "LL",
  "Stacks & Queues": "STK",
  Trees: "TREE",
  Graphs: "GRP",
  "Dynamic Programming": "DP",
  "Recursion & BackTracking": "REC",
  "Sorting & Searching": "SRT",
  Greedy: "GRD",
};

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const DIFFICULTY_STYLES: Record<string, { badge: string; dot: string }> = {
  Easy: {
    badge:
      "text-green-600 bg-green-500/10 border-green-500/20 dark:text-green-400",
    dot: "bg-green-500",
  },
  Medium: {
    badge:
      "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Hard: {
    badge: "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400",
    dot: "bg-red-500",
  },
};

const QuickStart = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<string[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);

  const [topicOpen, setTopicOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);

  const topicRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (topicRef.current && !topicRef.current.contains(target)) {
        setTopicOpen(false);
      }
      if (diffRef.current && !diffRef.current.contains(target)) {
        setDiffOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await problemService.getTopics();
        setTopics(data.map((t) => t.name));
        if (data.length > 0) setTopic(data[0].name);
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't load topics"));
      } finally {
        setTopicsLoading(false);
      }
    })();
  }, []);

  const handleStart = () => {
    navigate(
      `/interview?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}`,
    );
  };

  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header with Title and Button */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#019bf0]" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Quick Start
            </h2>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Jump straight into a problem-solving session.
          </p>
        </div>

        {/* Top Right Button */}
        <button
          onClick={() => navigate("/problems")}
          className="group hidden sm:flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
        >
          Browse Problems
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Topic Selector */}
        <div ref={topicRef} className="relative flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Layers className="h-3.5 w-3.5" />
            Topic
          </label>
          <button
            type="button"
            onClick={() => {
              setTopicOpen((prev) => !prev);
              setDiffOpen(false);
            }}
            aria-expanded={topicOpen}
            disabled={topicsLoading || topics.length === 0}
            className="group flex w-full items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-[#019bf0]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="flex h-6 min-w-7 items-center justify-center rounded-md bg-zinc-200 px-1.5 text-[10px] font-bold text-zinc-700 transition-transform duration-200 group-hover:scale-105 dark:bg-zinc-700 dark:text-zinc-200">
                {TOPIC_BADGES[topic] ?? "CODE"}
              </span>
              <span className="truncate">
                {topicsLoading ? "Loading…" : topic || "No topics yet"}
              </span>
            </div>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                topicOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Animated Dropdown Menu for Topic */}
          <AnimatePresence>
            {topicOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full min-w-55 origin-top overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1.5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="px-2.5 pb-1.5 pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Select Topic
                  </p>
                </div>

                {topics.map((item) => {
                  const selected = item === topic;
                  return (
                    <motion.button
                      key={item}
                      type="button"
                      onClick={() => {
                        setTopic(item);
                        setTopicOpen(false);
                      }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 ${
                        selected
                          ? "bg-[#019bf0]/10 text-[#019bf0] font-medium"
                          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`flex h-6 min-w-7 items-center justify-center rounded-md px-1 text-[10px] font-bold ${
                          selected
                            ? "bg-[#019bf0]/15 text-[#019bf0]"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {TOPIC_BADGES[item] ?? "CODE"}
                      </span>

                      <span className="flex-1 truncate">{item}</span>

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

        {/* Difficulty Selector */}
        <div ref={diffRef} className="relative flex-1">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Gauge className="h-3.5 w-3.5" />
            Difficulty
          </label>
          <button
            type="button"
            onClick={() => {
              setDiffOpen((prev) => !prev);
              setTopicOpen(false);
            }}
            aria-expanded={diffOpen}
            className="group flex w-full items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-[#019bf0]/30 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  DIFFICULTY_STYLES[difficulty]?.dot ?? "bg-zinc-400"
                }`}
              />
              <span>{difficulty}</span>
            </div>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                diffOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Animated Dropdown Menu for Difficulty */}
          <AnimatePresence>
            {diffOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 top-full z-50 mt-2 w-full min-w-45 origin-top overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="px-2.5 pb-1.5 pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Select Difficulty
                  </p>
                </div>

                {DIFFICULTIES.map((d) => {
                  const selected = d === difficulty;
                  return (
                    <motion.button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDifficulty(d);
                        setDiffOpen(false);
                      }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 ${
                        selected
                          ? "bg-[#019bf0]/10 text-[#019bf0] font-medium"
                          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          DIFFICULTY_STYLES[d]?.dot ?? "bg-zinc-400"
                        }`}
                      />
                      <span className="flex-1">{d}</span>

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

        {/* Start Button */}
        <div className="sm:self-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            disabled={!topic}
            className="flex h-10.5 w-full items-center justify-center rounded-xl bg-[#1a3a5c] px-6 text-sm font-semibold uppercase tracking-wide text-white shadow transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0] sm:w-auto"
          >
            Start Coding
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;

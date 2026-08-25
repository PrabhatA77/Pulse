import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { SubmissionStatus } from "../types/problem.types";

export interface StatusConfigEntry {
  label: string;
  className: string;
  Icon: typeof CheckCircle2;
}

// Single source of truth for how each submission status is labeled and
// styled — was previously duplicated in ConsolePanel and
// SubmissionDetailModal, which risked the two drifting out of sync.
export const STATUS_CONFIG: { [K in SubmissionStatus]: StatusConfigEntry } = {
  accepted: {
    label: "Accepted",
    className:
      "border-green-200 bg-green-500/10 text-green-600 dark:border-green-900 dark:text-green-400",
    Icon: CheckCircle2,
  },
  wrong_answer: {
    label: "Wrong Answer",
    className:
      "border-red-200 bg-red-500/10 text-red-600 dark:border-red-900 dark:text-red-400",
    Icon: XCircle,
  },
  compile_error: {
    label: "Compile Error",
    className:
      "border-red-200 bg-red-500/10 text-red-600 dark:border-red-900 dark:text-red-400",
    Icon: XCircle,
  },
  time_limit_exceeded: {
    label: "Time/Memory Limit Exceeded",
    className:
      "border-amber-200 bg-amber-500/10 text-amber-600 dark:border-amber-900 dark:text-amber-400",
    Icon: Clock,
  },
};
import type { ReactNode } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  MessageCircleQuestion,
} from "lucide-react";
import type { InterviewFeedback } from "../../types/problem.types";

interface AIFeedbackPanelProps {
  feedback: InterviewFeedback;
}

interface FeedbackCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  accent?: boolean;
}

const FeedbackCard = ({ icon, title, children, accent }: FeedbackCardProps) => (
  <div
    className={`rounded-xl border p-4 ${
      accent
        ? "border-transparent bg-[#1a3a5c]/5 dark:bg-[#019bf0]/10"
        : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60"
    }`}
  >
    <div
      className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${
        accent ? "text-[#1a3a5c] dark:text-[#019bf0]" : "text-zinc-500 dark:text-zinc-400"
      }`}
    >
      {icon}
      {title}
    </div>
    <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{children}</div>
  </div>
);

// Renders one card per feedback field. Doesn't manage its own scroll —
// the caller (ConsolePanel / FeedbackModal) owns a single scroll region
// so you never get nested scrollbars.
const AIFeedbackPanel = ({ feedback }: AIFeedbackPanelProps) => {
  return (
    <div className="flex flex-col gap-3">
      <FeedbackCard icon={<Sparkles className="h-3.5 w-3.5" />} title="Correctness">
        {feedback.correctnessSummary}
      </FeedbackCard>

      <div className="grid grid-cols-2 gap-3">
        <FeedbackCard icon={<Clock className="h-3.5 w-3.5" />} title="Time complexity">
          <span className="text-base font-semibold text-zinc-900 dark:text-white">
            {feedback.observedTimeComplexity}
          </span>
        </FeedbackCard>
        <FeedbackCard icon={<Cpu className="h-3.5 w-3.5" />} title="Space complexity">
          <span className="text-base font-semibold text-zinc-900 dark:text-white">
            {feedback.observedSpaceComplexity}
          </span>
        </FeedbackCard>
      </div>

      <div
        className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
          feedback.complexityMatchesExpected
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        }`}
      >
        {feedback.complexityMatchesExpected ? (
          <CheckCircle2 className="h-4 w-4 shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0" />
        )}
        {feedback.complexityMatchesExpected
          ? "Matches the expected complexity for this problem."
          : "Doesn't match the optimal complexity for this problem."}
      </div>

      <FeedbackCard icon={<Sparkles className="h-3.5 w-3.5" />} title="Code quality">
        {feedback.codeQualityNotes}
      </FeedbackCard>

      {feedback.strengths.length > 0 && (
        <FeedbackCard icon={<ThumbsUp className="h-3.5 w-3.5" />} title="Strengths">
          <ul className="list-disc space-y-1 pl-4">
            {feedback.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </FeedbackCard>
      )}

      {feedback.areasToImprove.length > 0 && (
        <FeedbackCard icon={<TrendingUp className="h-3.5 w-3.5" />} title="Areas to improve">
          <ul className="list-disc space-y-1 pl-4">
            {feedback.areasToImprove.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </FeedbackCard>
      )}

      <FeedbackCard
        icon={<MessageCircleQuestion className="h-3.5 w-3.5" />}
        title="Follow-up question"
        accent
      >
        {feedback.followUpQuestion}
      </FeedbackCard>
    </div>
  );
};

export default AIFeedbackPanel;
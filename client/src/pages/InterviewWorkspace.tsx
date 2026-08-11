import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProblemPanel from "../components/workspace/ProblemPanel";
import CodeEditorPanel from "../components/workspace/CodeEditorPanel";
import ConsolePanel from "../components/workspace/ConsolePanel";
import { problemService } from "../services/problem.service";
import { executionService } from "../services/execution.service";
import { interviewService } from "../services/interview.service";
import FeedbackModal from "../components/workspace/FeedbackModal";
import type { InterviewFeedback } from "../types/problem.types";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { Problem, ExecuteResponse } from "../types/problem.types";
import { generateStarterCode } from "../utils/starterCode";

// Keep in sync with LANGUAGE_VERSIONS in server/src/services/piston.service.ts.
const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
];

const InterviewWorkspace = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>(
    {},
  );

  const [defaultCodeByLanguage, setDefaultCodeByLanguage] =
  useState<Record<string, string>>({});

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ExecuteResponse | null>(null);

  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setResult(null);
      try {
        const { data } = await problemService.getRandom(topic, difficulty);

        // console.log("Problem response:", data);
        // console.log("parameters:", data.parameters);
        // console.log("examples:", data.examples);
        // console.log("constraints:", data.constraints);

        if (cancelled) return;
        setProblem(data);
        const signature = {
          functionName: data.functionName,
          parameters: data.parameters,
          returnType: data.returnType,
        };
        const initialCode = Object.fromEntries(
          LANGUAGES.map((lang) => [
            lang.id,
            generateStarterCode(lang.id, signature),
          ]),
        );
        setCodeByLanguage(initialCode);
        setDefaultCodeByLanguage(initialCode);
      } catch (error) {
        if (!cancelled)
          toast.error(getErrorMessage(error, "Couldn't load a problem"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [topic, difficulty]);

  const code = codeByLanguage[language] ?? "";

  const handleCodeChange = (value: string) => {
    setCodeByLanguage((prev) => ({ ...prev, [language]: value }));
  };

  const handleRun = useCallback(async () => {
    if (!problem) return;

    setRunning(true);

    try {
      const { data } = await executionService.execute(
        problem.id,
        language,
        code,
        false,
      );

      setResult(data);

      if (data.compileError) {
        toast.error("Compile error — check the console");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRunning(false);
    }
  }, [problem, language, code]);

  const handleSubmit = useCallback(async () => {
    if (!problem) return;

    setSubmitting(true);

    try {
      const { data } = await interviewService.submit(
        problem.id,
        language,
        code,
      );

      //setResult(data);
      setFeedback(data.feedback);

      if (data.compileError) {
        toast.error("Compile error — check the console");
      } else if (data.feedback) {
        setShowFeedback(true);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }, [problem, language, code]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-[#0e1316]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading a problem…
        </p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center dark:bg-[#0e1316]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Couldn't find a problem for that topic/difficulty — try different
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col gap-4 overflow-hidden p-4 dark:bg-[#0e1316] md:flex-row">
      <div className="h-[40vh] w-full shrink-0 md:h-full md:w-95">
        <ProblemPanel problem={problem} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="min-h-0 flex-1">
          <CodeEditorPanel
            language={language}
            languages={LANGUAGES}
            code={code}
            defaultCode={defaultCodeByLanguage[language] ?? ""}
            onLanguageChange={setLanguage}
            onCodeChange={handleCodeChange}
          />
        </div>
        <div className="h-65 shrink-0">
          <ConsolePanel
            onRun={handleRun}
            onSubmit={handleSubmit}
            running={running}
            submitting={submitting}
            result={result}
          />
        </div>
      </div>

      {showFeedback && feedback && (
        <FeedbackModal
          feedback={feedback}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
};

export default InterviewWorkspace;

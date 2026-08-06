import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProblemPanel from "../components/workspace/ProblemPanel";
import CodeEditorPanel from "../components/workspace/CodeEditorPanel";
import ConsolePanel from "../components/workspace/ConsolePanel";
import { problemService } from "../services/problem.service";
import { executionService } from "../services/execution.service";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { Problem, ExecuteResponse } from "../types/problem.types";

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
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ExecuteResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setResult(null);
      try {
        const { data } = await problemService.getRandom(topic, difficulty);
        if (cancelled) return;
        setProblem(data);
        setCodeByLanguage(data.starterCode ?? {});
      } catch (error) {
        if (!cancelled) toast.error(getErrorMessage(error, "Couldn't load a problem"));
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

  const runOrSubmit = useCallback(
    async (includeHidden: boolean) => {
      if (!problem) return;
      const setBusy = includeHidden ? setSubmitting : setRunning;
      setBusy(true);
      try {
        const { data } = await executionService.execute(problem.id, language, code, includeHidden);
        setResult(data);
        if (data.compileError) {
          toast.error("Compile error — check the console");
        } else if (includeHidden) {
          // Doesn't trigger AI scoring yet — next phase layers that on
          // top of a successful Submit like this one.
          if (data.success) toast.success("All test cases passed!");
          else toast.error("Some test cases failed");
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setBusy(false);
      }
    },
    [problem, language, code],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-[#0e1316]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading a problem…</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center dark:bg-[#0e1316]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Couldn't find a problem for that topic/difficulty — try different filters.
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
            onLanguageChange={setLanguage}
            onCodeChange={handleCodeChange}
          />
        </div>
        <div className="h-65 shrink-0">
          <ConsolePanel
            onRun={() => runOrSubmit(false)}
            onSubmit={() => runOrSubmit(true)}
            running={running}
            submitting={submitting}
            result={result}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkspace;
import { useCallback, useEffect, useState,useRef } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProblemPanel from "../components/workspace/ProblemPanel";
import CodeEditorPanel from "../components/workspace/CodeEditorPanel";
import ConsolePanel from "../components/workspace/ConsolePanel";
import { problemService } from "../services/problem.service";
import { executionService } from "../services/execution.service";
import { interviewService } from "../services/interview.service";
import type {
  InterviewFeedback,
  Problem,
  TestRunResult,
  SubmitResult,
} from "../types/problem.types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { generateStarterCode } from "../utils/starterCode";
import { draftService } from "../services/draft.service";

const DRAFT_SAVE_DELAY_MS = 1000;

// Keep in sync with LANGUAGE_VERSIONS in server/src/services/piston.service.ts.
const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
  { id: "typescript", label: "TypeScript" },
  { id: "go", label: "Go" },
  { id: "ruby", label: "Ruby" },
  { id: "rust", label: "Rust" },
];

const InterviewWorkspace = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;
  const problemId = searchParams.get("problemId") ?? undefined;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
  const [defaultCodeByLanguage, setDefaultCodeByLanguage] = useState<Record<string, string>>({});

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestRunResult | null>(null);

  // Submit is now two phases: the verdict comes back immediately, and the
  // AI feedback is fetched separately, only when the user asks for it.
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

    const draftSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDraftRef = useRef<{ problemId: string; language: string; code: string } | null>(null);

  const flushDraftSave = useCallback(() => {
    if (draftSaveTimer.current) {
      clearTimeout(draftSaveTimer.current);
      draftSaveTimer.current = null;
    }
    if (pendingDraftRef.current) {
      const { problemId, language, code } = pendingDraftRef.current;
      pendingDraftRef.current = null;
      draftService.save(problemId, language, code).catch(() => {
        // Best-effort — a failed autosave shouldn't interrupt the user.
      });
    }
  }, []);

  // Flush any pending debounce on unmount (e.g. navigating away right
  // after typing) so the last edit isn't silently dropped.
  useEffect(() => {
    return () => flushDraftSave();
  }, [flushDraftSave]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setResult(null);
      setSubmitResult(null);
      setFeedback(null);
      try {
        const { data } = problemId
          ? await problemService.getById(problemId)
          : await problemService.getRandom(topic, difficulty);

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
        setDefaultCodeByLanguage(initialCode);

        // Overlay any saved drafts for this problem on top of the starter
        // code. A missing/failed fetch just falls back to starter code —
        // not having drafts yet isn't an error worth a toast.
        let codeToUse = initialCode;
        try {
          const { data: drafts } = await draftService.get(data.id);
          codeToUse = { ...initialCode, ...drafts };
        } catch {
          // No drafts yet, or fetch failed.
        }
        if (!cancelled) setCodeByLanguage(codeToUse);

      } catch (error) {
        if (!cancelled)
          toast.error(
            getErrorMessage(
              error,
              problemId ? "Couldn't load that problem" : "Couldn't load a problem",
            ),
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [problemId, topic, difficulty]);

  const code = codeByLanguage[language] ?? "";

    const handleCodeChange = (value: string) => {
    setCodeByLanguage((prev) => ({ ...prev, [language]: value }));
    if (!problem) return;

    pendingDraftRef.current = { problemId: problem.id, language, code: value };
    if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
    draftSaveTimer.current = setTimeout(flushDraftSave, DRAFT_SAVE_DELAY_MS);
  };

  const handleRun = useCallback(async () => {
    if (!problem) return;

    setRunning(true);
    setSubmitResult(null);
    setFeedback(null);

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
    setResult(null);
    setFeedback(null);

    try {
      const { data } = await interviewService.submit(problem.id, language, code);

      setSubmitResult(data);

      if (data.compileError) {
        toast.error("Compile error — check the console");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }, [problem, language, code]);

  const handleAnalyze = useCallback(async () => {
    if (!submitResult) return;

    setAnalyzing(true);

    try {
      const { data } = await interviewService.analyze(submitResult.interviewId);
      setFeedback(data.feedback);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't get AI feedback"));
    } finally {
      setAnalyzing(false);
    }
  }, [submitResult]);

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
  <div className="flex h-auto min-h-screen w-full flex-col gap-4 p-4 dark:bg-[#0e1316] md:h-screen md:flex-row md:overflow-hidden">
    {/* Problem Panel: compact on mobile, full height on desktop */}
    <div className="h-[30vh] w-full shrink-0 md:h-full md:w-95">
      <ProblemPanel problem={problem} />
    </div>

    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {/* Code Editor Panel: given generous height on mobile, flex on desktop */}
      <div className="h-[50vh] min-h-87.5 md:h-auto md:min-h-0 md:flex-1">
        <CodeEditorPanel
          language={language}
          languages={LANGUAGES}
          code={code}
          defaultCode={defaultCodeByLanguage[language] ?? ""}
          onLanguageChange={setLanguage}
          onCodeChange={handleCodeChange}
        />
      </div>

      {/* Console Panel: reduced to 200px (h-52) on mobile, restored to h-80 on desktop */}
      <div className="h-52 shrink-0 md:h-80">
        <ConsolePanel
          onRun={handleRun}
          onSubmit={handleSubmit}
          running={running}
          submitting={submitting}
          result={result}
          submitResult={submitResult}
          feedback={feedback}
          analyzing={analyzing}
          onAnalyze={handleAnalyze}
        />
      </div>
    </div>
  </div>
);
};

export default InterviewWorkspace;
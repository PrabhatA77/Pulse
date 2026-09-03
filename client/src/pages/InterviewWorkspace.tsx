import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProblemPanel from "../components/workspace/ProblemPanel";
import CodeEditorPanel from "../components/workspace/CodeEditorPanel";
import ConsolePanel from "../components/workspace/ConsolePanel";
import ResizableSplit from "../components/common/ResizeableSplit";
import { problemService } from "../services/problem.service";
import { executionService } from "../services/execution.service";
import { interviewService } from "../services/interview.service";
import type {
  InterviewFeedback,
  Problem,
  TestRunResult,
  SubmitResult,
  TestCaseValue,
} from "../types/problem.types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { generateStarterCode } from "../utils/starterCode";
import { draftService } from "../services/draft.service";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useEditorShortcuts } from "../hooks/useEditorShortcuts";

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
  const tag = searchParams.get("tag") ?? undefined;
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

  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const isDesktop = useIsDesktop();

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
          : await problemService.getRandom(tag, difficulty);

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
  }, [problemId, tag, difficulty]);

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

  const handleRunCustomTest = useCallback(
    async (input: Record<string, TestCaseValue>) => {
      if (!problem) throw new Error("No problem loaded");
      const { data } = await executionService.executeCustom(problem.id, language, code, input);
      return data;
    },
    [problem, language, code],
  );

  const handleLoadSubmissionCode = useCallback(
    (submissionLanguage: string, code: string) => {
      const isSupported = LANGUAGES.some((l) => l.id === submissionLanguage);
      if (!isSupported) {
        toast.error(`This submission's language (${submissionLanguage}) isn't available in the editor anymore.`);
        return;
      }

      setCodeByLanguage((prev) => ({ ...prev, [submissionLanguage]: code }));
      setLanguage(submissionLanguage);

      if (problem) {
        pendingDraftRef.current = { problemId: problem.id, language: submissionLanguage, code };
        if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
        draftSaveTimer.current = setTimeout(flushDraftSave, DRAFT_SAVE_DELAY_MS);
      }

      toast.success("Loaded that submission into the editor");
    },
    [problem, flushDraftSave],
  );

  const runIfIdle = useCallback(() => {
    if (!running && !submitting) handleRun();
  }, [running, submitting, handleRun]);

  const submitIfIdle = useCallback(() => {
    if (!running && !submitting) handleSubmit();
  }, [running, submitting, handleSubmit]);

  useEditorShortcuts(runIfIdle, submitIfIdle, Boolean(problem));

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

  const editorPane = (
    <CodeEditorPanel
      language={language}
      languages={LANGUAGES}
      code={code}
      defaultCode={defaultCodeByLanguage[language] ?? ""}
      onLanguageChange={setLanguage}
      onCodeChange={handleCodeChange}
    />
  );

  const consolePane = (
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
      problem={problem}
      onRunCustomTest={handleRunCustomTest}
    />
  );

  return (
    <div className="flex h-auto min-h-screen w-full flex-col gap-4 p-4 dark:bg-[#0e1316] md:h-screen md:overflow-hidden">
      {isDesktop ? (
        <ResizableSplit
          direction="horizontal"
          storageKey="pulse-split-h"
          defaultFirstSize={26}
          minFirstSize={18}
          maxFirstSize={45}
          first={<ProblemPanel problem={problem} onLoadInEditor={handleLoadSubmissionCode} />}
          second={
            <ResizableSplit
              direction="vertical"
              storageKey="pulse-split-v"
              defaultFirstSize={68}
              minFirstSize={30}
              maxFirstSize={85}
              className="pl-4"
              first={<div className="h-full pb-2">{editorPane}</div>}
              second={<div className="h-full pt-2">{consolePane}</div>}
            />
          }
        />
      ) : (
        <>
          <div className="h-[30vh] w-full shrink-0">
            <ProblemPanel problem={problem} onLoadInEditor={handleLoadSubmissionCode} />
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="h-[50vh] min-h-87.5">{editorPane}</div>
            <div className="h-52 shrink-0">{consolePane}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default InterviewWorkspace;
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProblemPanel from "../components/workspace/ProblemPanel";
import CodeEditorPanel from "../components/workspace/CodeEditorPanel";
import ConsolePanel from "../components/workspace/ConsolePanel";
import SessionTimerBar from "../components/session/SessionTimerBar";
import ResizableSplit from "../components/common/ResizeableSplit";
import { sessionService } from "../services/session.service";
import { executionService } from "../services/execution.service";
import { interviewService } from "../services/interview.service";
import { useCountdown } from "../hooks/useCountdown";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useEditorShortcuts } from "../hooks/useEditorShortcuts";
import { generateStarterCode } from "../utils/starterCode";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { InterviewSession } from "../types/session.types";
import type { TestRunResult, SubmissionDetail, TestCaseValue } from "../types/problem.types";
import SessionSummary from "../components/session/SessionSummary";

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

const SessionWorkspace = () => {
  const { id } = useParams<{ id: string }>();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
  const [defaultCodeByLanguage, setDefaultCodeByLanguage] = useState<Record<string, string>>({});

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestRunResult | null>(null);
  const [interviewDetail, setInterviewDetail] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const isDesktop = useIsDesktop();

  // Guards the auto-submit-on-expiry callback from firing more than once.
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await sessionService.get(id);
        if (cancelled) return;
        setSession(data);

        if (data.problem) {
          const signature = {
            functionName: data.problem.functionName,
            parameters: data.problem.parameters,
            returnType: data.problem.returnType,
          };
          const initialCode = Object.fromEntries(
            LANGUAGES.map((lang) => [lang.id, generateStarterCode(lang.id, signature)]),
          );
          setCodeByLanguage(initialCode);
          setDefaultCodeByLanguage(initialCode);
        }
        if (data.status !== "in_progress" && data.interviewId) {
          setDetailLoading(true);
          try {
            const { data: detail } = await interviewService.getById(data.interviewId);
            if (!cancelled) setInterviewDetail(detail);
          } catch (error) {
            if (!cancelled) toast.error(getErrorMessage(error, "Couldn't load your submission"));
          } finally {
            if (!cancelled) setDetailLoading(false);
          }
        }
      } catch (error) {
        if (!cancelled) toast.error(getErrorMessage(error, "Couldn't load this session"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const code = codeByLanguage[language] ?? "";
  const handleCodeChange = (value: string) => setCodeByLanguage((prev) => ({ ...prev, [language]: value }));

  const handleRun = useCallback(async () => {
    if (!session?.problem) return;
    setRunning(true);

    try {
      const { data } = await executionService.execute(session.problem.id, language, code, false);
      setResult(data);
      if (data.compileError) toast.error("Compile error — check the console");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRunning(false);
    }
  }, [session, language, code]);

  const handleSubmit = useCallback(async () => {
    if (!id || !session || session.status !== "in_progress") return;
    setSubmitting(true);
    setResult(null);
    
    try {
      const { data } = await sessionService.submit(id, language, code);

      setSession((prev) => (prev ? { ...prev, status: data.sessionStatus } : prev));

      if (data.sessionStatus === "expired") {
        toast("Time was already up — this submission was recorded as late.", { icon: "⏰" });
      } else if (data.compileError) {
        toast.error("Compile error — check the console");
      } else {
        toast.success("Submitted!");
      }

      setDetailLoading(true);
      try {
        const { data: detail } = await interviewService.getById(data.interviewId);
        setInterviewDetail(detail);
      } catch (error) {
        toast.error(getErrorMessage(error, "Submitted, but couldn't load the summary"));
      } finally {
        setDetailLoading(false);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't submit"));
    } finally {
      setSubmitting(false);
    }
  }, [id, session, language, code]);

  const handleAutoSubmit = useCallback(() => {
    if (hasAutoSubmitted.current || !session || session.status !== "in_progress") return;
    hasAutoSubmitted.current = true;
    toast("Time's up — auto-submitting your current code.", { icon: "⏰" });
    handleSubmit();
  }, [session, handleSubmit]);

  const { remainingMs } = useCountdown(
    session?.status === "in_progress" ? session.expiresAt : null,
    handleAutoSubmit,
  );

  const handleAnalyze = useCallback(async () => {
    if (!interviewDetail) return;
    setAnalyzing(true);
    try {
      const { data } = await interviewService.analyze(interviewDetail.id);
      setInterviewDetail((prev) => (prev ? { ...prev, feedback: data.feedback } : prev));
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't get AI feedback"));
    } finally {
      setAnalyzing(false);
    }
  }, [interviewDetail]);

  const handleRunCustomTest = useCallback(
    async (input: Record<string, TestCaseValue>) => {
      if (!session?.problem) throw new Error("No problem loaded");
      const { data } = await executionService.executeCustom(session.problem.id, language, code, input);
      return data;
    },
    [session, language, code],
  );

  const runIfIdle = useCallback(() => {
    if (!running && !submitting) handleRun();
  }, [running, submitting, handleRun]);

  const submitIfIdle = useCallback(() => {
    if (!running && !submitting) handleSubmit();
  }, [running, submitting, handleSubmit]);

  useEditorShortcuts(runIfIdle, submitIfIdle, session?.status === "in_progress");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-[#0e1316]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading your session…</p>
      </div>
    );
  }

  if (!session || !session.problem) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center dark:bg-[#0e1316]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Couldn't find this session.</p>
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
      submitResult={null}
      feedback={null}
      analyzing={false}
      onAnalyze={() => {}}
      problem={session.problem}
      onRunCustomTest={handleRunCustomTest}
    />
  );

  return (
    <div className="flex h-auto min-h-screen w-full flex-col gap-4 p-4 dark:bg-[#0e1316] md:h-screen md:overflow-hidden">
      {session.status !== "in_progress" ? (
        detailLoading || !interviewDetail ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading your results…</p>
          </div>
        ) : (
          <SessionSummary
            session={session}
            detail={interviewDetail}
            analyzing={analyzing}
            onAnalyze={handleAnalyze}
          />
        )
      ) : (
        <>
          <SessionTimerBar remainingMs={remainingMs} durationMinutes={session.durationMinutes} />

          {isDesktop ? (
            <ResizableSplit
              direction="horizontal"
              storageKey="pulse-split-h"
              defaultFirstSize={26}
              minFirstSize={18}
              maxFirstSize={45}
              first={<ProblemPanel problem={session.problem} isTimedSession />}
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
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="h-[30vh] w-full shrink-0">
                <ProblemPanel problem={session.problem} isTimedSession />
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="h-[50vh] min-h-87.5">{editorPane}</div>
                <div className="h-52 shrink-0">{consolePane}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionWorkspace;
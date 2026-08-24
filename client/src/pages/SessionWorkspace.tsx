import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProblemPanel from "../components/workspace/ProblemPanel";
import CodeEditorPanel from "../components/workspace/CodeEditorPanel";
import ConsolePanel from "../components/workspace/ConsolePanel";
import SessionTimerBar from "../components/session/SessionTimerBar";
import { sessionService } from "../services/session.service";
import { executionService } from "../services/execution.service";
import { interviewService } from "../services/interview.service";
import { useCountdown } from "../hooks/useCountdown";
import { generateStarterCode } from "../utils/starterCode";
import { getErrorMessage } from "../utils/getErrorMessage";
import type { InterviewSession } from "../types/session.types";
import type { InterviewFeedback, TestRunResult, SubmitResult } from "../types/problem.types";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
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
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

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
    setSubmitResult(null);
    setFeedback(null);
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
    setFeedback(null);
    try {
      const { data } = await sessionService.submit(id, language, code);
      setSubmitResult({
        interviewId: data.interviewId,
        compileError: data.compileError,
        status: data.status,
        passedTestCases: data.passedTestCases,
        totalTestCases: data.totalTestCases,
      });
      setSession((prev) => (prev ? { ...prev, status: data.sessionStatus } : prev));

      if (data.sessionStatus === "expired") {
        toast("Time was already up — this submission was recorded as late.", { icon: "⏰" });
      } else if (data.compileError) {
        toast.error("Compile error — check the console");
      } else {
        toast.success("Submitted!");
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

  return (
    <div className="flex h-auto min-h-screen w-full flex-col gap-4 p-4 dark:bg-[#0e1316] md:h-screen md:overflow-hidden">
      <SessionTimerBar
        remainingMs={session.status === "in_progress" ? remainingMs : 0}
        durationMinutes={session.durationMinutes}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
        <div className="h-[30vh] w-full shrink-0 md:h-full md:w-95">
          <ProblemPanel problem={session.problem} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4">
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
    </div>
  );
};

export default SessionWorkspace;
import type { Problem, SubmissionStatus } from "./problem.types";

export type SessionStatus = "in_progress" | "completed" | "expired";

export interface InterviewSession {
  id: string;
  status: SessionStatus;
  durationMinutes: number;
  startedAt: string;
  expiresAt: string;
  interviewId: string | null;
  problem?: Problem;
}

export interface StartSessionPayload {
  difficulty?: string;
  topic?: string;
  durationMinutes: number;
}

export interface SubmitSessionResult {
  sessionStatus: SessionStatus;
  interviewId: string;
  compileError?: string;
  status: SubmissionStatus;
  passedTestCases: number;
  totalTestCases: number;
}
import api from "../api/axios";
import type { SubmitResult, AnalyzeResult, SubmissionHistoryItem,SubmissionDetail, } from "../types/problem.types";

export const interviewService = {
  submit: (problemId: string, language: string, code: string) =>
    api.post<SubmitResult>("/interviews/submit", { problemId, language, code }),

  analyze: (interviewId: string) =>
    api.post<AnalyzeResult>(`/interviews/${interviewId}/analyze`),

  getSubmissionHistory: (problemId: string, source?: "practice" | "session") =>
    api.get<SubmissionHistoryItem[]>(`/interviews/problem/${problemId}`, { params: { source } }),

  getById: (interviewId: string) =>
    api.get<SubmissionDetail>(`/interviews/${interviewId}`),
};
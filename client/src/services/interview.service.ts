import api from "../api/axios";
import type { SubmitResult,AnalyzeResult } from "../types/problem.types";

export const interviewService = {
  submit: (problemId: string, language: string, code: string) =>
    api.post<SubmitResult>("/interviews/submit", { problemId, language, code }),
 
  analyze: (interviewId: string) =>
    api.post<AnalyzeResult>(`/interviews/${interviewId}/analyze`),
};
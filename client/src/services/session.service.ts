import api from "../api/axios";
import type { InterviewSession, StartSessionPayload, SubmitSessionResult } from "../types/session.types";

export const sessionService = {
  start: (payload: StartSessionPayload) => api.post<InterviewSession>("/sessions", payload),
  get: (id: string) => api.get<InterviewSession>(`/sessions/${id}`),
  submit: (id: string, language: string, code: string) =>
    api.post<SubmitSessionResult>(`/sessions/${id}/submit`, { language, code }),
};
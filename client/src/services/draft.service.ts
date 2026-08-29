import api from "../api/axios";

export const draftService = {
  get: (problemId: string) => api.get<Record<string, string>>(`/drafts/${problemId}`),
  save: (problemId: string, language: string, code: string) =>
    api.put(`/drafts/${problemId}`, { language, code }),
};
import api from "../api/axios";
import type { AdminProblemSummary, AdminProblemDetail, ProblemFormPayload } from "../types/admin.types";

export const adminService = {
  listProblems: () => api.get<AdminProblemSummary[]>("/admin/problems"),

  getProblem: (id: string) => api.get<AdminProblemDetail>(`/admin/problems/${id}`),

  createProblem: (data: ProblemFormPayload) =>
    api.post<AdminProblemDetail>("/admin/problems", data),

  updateProblem: (id: string, data: Partial<ProblemFormPayload>) =>
    api.put<AdminProblemDetail>(`/admin/problems/${id}`, data),

  deleteProblem: (id: string) => api.delete(`/admin/problems/${id}`),
};
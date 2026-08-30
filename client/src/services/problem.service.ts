import api from "../api/axios";
import type {
  Problem,
  ProblemTopic,
  ProblemSummary,
} from "../types/problem.types";

export const problemService = {
  list: () => api.get<ProblemSummary[]>("/problems"),

  getRandom: (tag?: string, difficulty?: string) =>
    api.get<Problem>("/problems/random", { params: { tag, difficulty } }),

  getById: (id: string) => api.get<Problem>(`/problems/${id}`),

  getTopics: () => api.get<ProblemTopic[]>("/problems/topics"),

  getHint: (id: string, level: number) =>
    api.get<{ hints: string[] }>(`/problems/${id}/hint`, { params: { level } }),
};

import api from "../api/axios";
import type { Problem,ProblemTopic,ProblemSummary } from "../types/problem.types";

export const problemService = {

    list: () => api.get<ProblemSummary[]>("/problems"),

    getRandom : (topic?:string,difficulty?:string)=>
        api.get<Problem>("/problems/random",{params:{topic,difficulty}}),

    getById: (id:string)=> api.get<Problem>(`/problems/${id}`),

    getTopics: () => api.get<ProblemTopic[]>("/problems/topics"),
};
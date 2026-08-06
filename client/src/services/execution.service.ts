import api from "../api/axios";
import type { ExecuteResponse } from "../types/problem.types";

export const executionService = {
    execute:(problemId:string,language:string,code:string,includeHidden=false) => api.post<ExecuteResponse>("/problems/execute",{problemId,language,code,includeHidden}),

};
import api from "../api/axios";
import type { ExecuteResponse, CustomTestResponse, TestCaseValue } from "../types/problem.types";

export const executionService = {
    execute:(problemId:string,language:string,code:string,includeHidden=false) => api.post<ExecuteResponse>("/problems/execute",{problemId,language,code,includeHidden}),

    executeCustom: (problemId: string, language: string, code: string, input: Record<string, TestCaseValue>) =>
        api.post<CustomTestResponse>("/problems/execute-custom", { problemId, language, code, input }),
};
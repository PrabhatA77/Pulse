import api from "../api/axios";
import type { SubmitInterviewResponse } from "../types/problem.types";

export const interviewService = {
    submit : (problemId:string,language:string,code:string)=> api.post<SubmitInterviewResponse>("/interviews/submit",{problemId,language,code})
};
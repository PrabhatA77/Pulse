import api from "../api/axios";
import type { Problem } from "../types/problem.types";

export const problemService = {
    getRandom : (topic?:string,difficulty?:string)=>
        api.get<Problem>("/problems/random",{params:{topic,difficulty}}),

    getById: (id:string)=> api.get<Problem>(`/problems/${id}`),
};
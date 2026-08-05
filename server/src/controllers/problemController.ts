import type { Request,Response } from "express";
import { Problem } from "../models/problem.model.js";
import type { ProblemDocument } from "../models/problem.model.js";
import { AppError } from "../middleware/errorHandler.js";

function toPublicProblem(problem:ProblemDocument){
    return {
        id:problem._id,
        title:problem.title,
        difficulty:problem.difficulty,
        topic:problem.topic,
        description:problem.description,
        constraints:problem.constraints,
        examples:problem.testCases
            .filter((testcase)=>!testcase.isHidden)
            .map((testcase)=>({
                input:testcase.input,
                output:testcase.expectedOutput,
                explanation:testcase.explanation,
            })),
        starterCode:problem.starterCode ? Object.fromEntries(problem.starterCode):{},
    };
}

export async function getProblem(req:Request<{id:string}>,res:Response){
    const problem = await Problem.findById(req.params.id);
    if(!problem){
        throw new AppError("Problem not found",404);
    }
    res.status(200).json(toPublicProblem(problem));
}

interface RandomProblemQuery{
    topic ?:string;
    difficulty ?:string;
}

export async function getRandomProblem(req:Request<{},{},{},RandomProblemQuery>,res:Response){
    const {topic,difficulty} = req.query;

    const filter: Record<string,string> = {};
    if(topic) filter.topic = topic;
    if(difficulty) filter.difficulty = difficulty;

    const [randomDoc] = await Problem.aggregate([{$match:filter},{$sample:{size:1}}]);
    if(!randomDoc){
        throw new AppError("No problems match that topic/difficult yet",404);
    }

    res.status(200).json(toPublicProblem(Problem.hydrate(randomDoc)));
}
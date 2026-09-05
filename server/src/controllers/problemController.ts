import type { Request,Response } from "express";
import { Types } from "mongoose";
import { Problem } from "../models/problem.model.js";
import type { ProblemDocument } from "../models/problem.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { Topic } from "../models/topic.model.js";
import { generateHint } from "../services/gemini.service.js";
import { Interview } from "../models/interview.model.js";

interface AuthedRequest<P = {}, Q = {}> extends Request<P, {}, {}, Q> {
  userId?: string;
}

export type ProblemStatus = "solved" | "attempted" | "unsolved";

// Single-problem lookup — used for the practice workspace's getProblem/getRandomProblem.
async function getProblemStatus(userId: string, problemId: Types.ObjectId): Promise<ProblemStatus> {
  const hasSolved = await Interview.exists({ user: userId, problem: problemId, allPassed: true });
  if (hasSolved) return "solved";

  const hasAttempted = await Interview.exists({ user: userId, problem: problemId });
  return hasAttempted ? "attempted" : "unsolved";
}

// Batch version for list views — one aggregation instead of N lookups.
async function getProblemStatusMap(
  userId: string,
  problemIds: Types.ObjectId[],
): Promise<Record<string, "solved" | "attempted">> {
  const rows = await Interview.aggregate<{ _id: Types.ObjectId; solved: number }>([
    { $match: { user: new Types.ObjectId(userId), problem: { $in: problemIds } } },
    { $group: { _id: "$problem", solved: { $max: { $cond: ["$allPassed", 1, 0] } } } },
  ]);

  const map: Record<string, "solved" | "attempted"> = {};
  for (const row of rows) {
    map[row._id.toString()] = row.solved === 1 ? "solved" : "attempted";
  }
  return map;
}

export function toPublicProblem(problem:ProblemDocument){
    return {
    id: problem._id,
    title: problem.title,
    difficulty: problem.difficulty,
    tags: problem.tags,
    description: problem.description,

    functionName: problem.functionName,
    parameters: problem.parameters,
    returnType: problem.returnType,

    constraints: problem.constraints,

    examples: problem.testCases
      .filter((testcase) => !testcase.isHidden)
      .map((testcase) => ({
        input: testcase.input,
        output: testcase.expectedOutput,
        explanation: testcase.explanation,
      })),
  };
}

export async function getProblem(req:AuthedRequest<{id:string}>,res:Response){
    const problem = await Problem.findById(req.params.id);
    if(!problem){
        throw new AppError("Problem not found",404);
    }
    const status = req.userId ? await getProblemStatus(req.userId, problem._id) : "unsolved";
    res.status(200).json({ ...toPublicProblem(problem), status });
}

interface RandomProblemQuery{
    tag ?:string;
    difficulty ?:string;
}

export async function getRandomProblem(req:AuthedRequest<{},RandomProblemQuery>,res:Response){
    const {tag,difficulty} = req.query;

    const filter: Record<string,string> = {};
    if(tag) filter.tags = tag;
    if(difficulty) filter.difficulty = difficulty;

    const [randomDoc] = await Problem.aggregate([{$match:filter},{$sample:{size:1}}]);
    if(!randomDoc){
        throw new AppError("No problems match that topic/difficult yet",404);
    }

    const problem = Problem.hydrate(randomDoc);
    const status = req.userId ? await getProblemStatus(req.userId, problem._id) : "unsolved";
    res.status(200).json({ ...toPublicProblem(problem), status });
}

export async function getTopics(_req: Request, res: Response) {
  const topics = await Topic.find().sort({ name: 1 });
  res.status(200).json(topics.map((t) => ({ id: t._id, name: t.name })));
}

export async function listPublicProblems(req: AuthedRequest, res: Response) {
  const problems = await Problem.find()
    .select("title difficulty tags")
    .sort({ title: 1 });

  const statusMap = req.userId
    ? await getProblemStatusMap(req.userId, problems.map((p) => p._id))
    : {};

  res.status(200).json(
    problems.map((p) => ({
      id: p._id,
      title: p.title,
      difficulty: p.difficulty,
      tags: p.tags,
      status: statusMap[p._id.toString()] ?? "unsolved",
    })),
  );
}

interface HintQuery {
  level?: string;
}

// GET /api/problems/:id/hint?level=1 — lazily generates and caches
// progressive hints on the Problem doc itself, since a hint only depends
// on the problem, not the requesting user. Regenerating levels already
// cached is skipped entirely.
export async function getHint(req: Request<{ id: string }, {}, {}, HintQuery>, res: Response) {
  const level = Math.min(3, Math.max(1, parseInt(req.query.level ?? "1", 10) || 1));

  const problem = await Problem.findById(req.params.id);
  if (!problem) throw new AppError("Problem not found", 404);

  const existing = problem.hints ?? [];
  if (existing.length >= level) {
    res.status(200).json({ hints: existing.slice(0, level) });
    return;
  }

  const generated = [...existing];
  for (let lvl = generated.length + 1; lvl <= level; lvl++) {
    const hint = await generateHint(
      { title: problem.title, description: problem.description, difficulty: problem.difficulty },
      lvl,
      generated,
    );
    generated.push(hint);
  }

  problem.hints = generated;
  await problem.save();

  res.status(200).json({ hints: generated });
}
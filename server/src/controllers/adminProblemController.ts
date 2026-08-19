import type { Request, Response } from "express";
import { Problem } from "../models/problem.model.js";
import type { ProblemDocument } from "../models/problem.model.js";
import { AppError } from "../middleware/errorHandler.js";
import type { CreateProblemInput, UpdateProblemInput } from "../validators/problem.validator.js";

// Full admin view — unlike toPublicProblem in problemController.ts, this
// includes hidden test cases and everything else, since admins need to
// see/edit the whole thing.
function toAdminProblem(problem: ProblemDocument) {
  return {
    id: problem._id,
    title: problem.title,
    difficulty: problem.difficulty,
    topic: problem.topic,
    description: problem.description,
    constraints: problem.constraints,
    functionName: problem.functionName,
    parameters: problem.parameters,
    returnType: problem.returnType,
    testCases: problem.testCases,
    expectedTimeComplexity: problem.expectedTimeComplexity,
    expectedSpaceComplexity: problem.expectedSpaceComplexity,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
  };
}

// GET /api/admin/problems — summary list for the admin table.
export async function listProblems(_req: Request, res: Response) {
  const problems = await Problem.find()
    .select("title difficulty topic testCases createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json(
    problems.map((p) => ({
      id: p._id,
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
      testCaseCount: p.testCases.length,
      createdAt: p.createdAt,
    })),
  );
}

// GET /api/admin/problems/:id — full detail, e.g. to populate an edit form.
export async function getProblemAdmin(req: Request<{ id: string }>, res: Response) {
  const problem = await Problem.findById(req.params.id);
  if (!problem) throw new AppError("Problem not found", 404);
  res.status(200).json(toAdminProblem(problem));
}

// POST /api/admin/problems — the whole point: add ONE problem without
// touching the rest of the collection or their IDs.
export async function createProblem(
  req: Request<{}, {}, CreateProblemInput>,
  res: Response,
) {
  const problem = await Problem.create(req.body);
  res.status(201).json(toAdminProblem(problem));
}

// PUT /api/admin/problems/:id
export async function updateProblem(
  req: Request<{ id: string }, {}, UpdateProblemInput>,
  res: Response,
) {
  const problem = await Problem.findById(req.params.id);
  if (!problem) throw new AppError("Problem not found", 404);

  Object.assign(problem, req.body);
  await problem.save();

  res.status(200).json(toAdminProblem(problem));
}

// DELETE /api/admin/problems/:id
export async function deleteProblem(req: Request<{ id: string }>, res: Response) {
  const problem = await Problem.findByIdAndDelete(req.params.id);
  if (!problem) throw new AppError("Problem not found", 404);
  res.status(200).json({ message: "Problem deleted" });
}
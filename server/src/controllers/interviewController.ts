import type { Request, Response } from "express";
import { Problem } from "../models/problem.model.js";
import { Interview } from "../models/interview.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { runTestCases } from "../services/testRunner.service.js";
import { evaluateSubmission } from "../services/gemini.service.js";

interface SubmitInterviewBody {
  problemId: string;
  language: string;
  code: string;
}

interface AuthedSubmitRequest extends Request<{}, {}, SubmitInterviewBody> {
  userId?: string;
}

export async function submitInterview(req: AuthedSubmitRequest, res: Response) {
  const { problemId, language, code } = req.body;

  if (!problemId || !language || !code) {
    throw new AppError("problemId, language, and code are all required", 400);
  }
  if (!req.userId) {
    throw new AppError("Not authenticated", 401);
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const signature = {
    functionName: problem.functionName,
    parameters: problem.parameters,
    returnType: problem.returnType,
  };
  const { results, compileError } = await runTestCases(
    language,
    code,
    signature,
    problem.testCases,
  );

  if (compileError) {
    res.status(200).json({ compileError, results: [], feedback: null });
    return;
  }

  const testsPassed = results.filter((r) => r.passed).length;
  const testsTotal = results.length;

  const feedback = await evaluateSubmission({
    problemTitle: problem.title,
    problemDescription: problem.description,
    expectedTimeComplexity: problem.expectedTimeComplexity,
    expectedSpaceComplexity: problem.expectedSpaceComplexity,
    language,
    code,
    testsPassed,
    testsTotal,
  });

  await Interview.create({
    user: req.userId,
    problem: problem._id,
    language,
    code,
    testsPassed,
    testsTotal,
    allPassed: testsPassed === testsTotal,
    feedback,
  });

  res.status(200).json({ compileError: undefined, results, feedback });
}

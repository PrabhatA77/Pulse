import type { Request, Response } from "express";
import { Problem } from "../models/problem.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { runTestCases } from "../services/testRunner.service.js";

interface ExecuteBody {
  problemId: string;
  language: string;
  code: string;
  includeHidden?: boolean;
}

export async function executeCode(
  req: Request<{}, {}, ExecuteBody>,
  res: Response,
) {
  const { problemId, language, code, includeHidden = false } = req.body;

  if (!problemId || !language || !code) {
    throw new AppError("problemId, language, and code are all required", 400);
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const testCases = includeHidden
    ? problem.testCases
    : problem.testCases.filter((tc) => !tc.isHidden);
  
  const signature = {functionName:problem.functionName,parameters:problem.parameters,returnType:problem.returnType};
  const { results, compileError } = await runTestCases(
    language,
    code,
    signature,
    testCases,
  );

  res.status(200).json({
    success:
      !compileError && results.length > 0 && results.every((r) => r.passed),
    compileError,
    results,
  });
}

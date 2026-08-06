import type { Request,Response } from "express";
import { Problem } from "../models/problem.model.js";
import type { TestCase } from "../models/problem.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { runCode } from "../services/piston.service.js";

interface ExecuteBody{
    problemId:string;
    language:string;
    code:string;
    includeHidden?:boolean;
}

interface TestCaseResult {
    passed:boolean;
    isHidden:boolean;

    input?: string;
    expectedOutput?: string;
    actualOutput?: string;
    stderr?: string;
}

function normalize(output: string) {
    return output.replace(/\s+/g, "").trim();
}

export async function executeCode(req:Request<{},{},ExecuteBody>,res:Response){
    const {problemId,language,code,includeHidden=false} = req.body;

    if(!problemId || !language || !code){
        throw new AppError("problemId, language, and code are all required", 400);
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  const testCases: TestCase[] = includeHidden
    ? problem.testCases
    : problem.testCases.filter((testCase) => !testCase.isHidden);

  const results: TestCaseResult[] = [];
  let compileError: string | undefined;

  // Sequential on purpose — Piston is a single self-hosted container, and
  // this is simplest to reason about while test-case counts are small.
  // Worth parallelizing (with a concurrency cap) later if it's ever slow.
  for (const testCase of testCases) {
    const result = await runCode(language, code, testCase.input);

    if (result.compileError) {
      compileError = result.compileError;
      break; // code doesn't compile — no point burning more Piston calls
    }

    const actualOutput = normalize(result.stdout);
    const passed = actualOutput === normalize(testCase.expectedOutput);

    results.push(
      testCase.isHidden
        ?{passed,isHidden:true}
        :{
          passed,
          isHidden:false,
          input:testCase.input,
          expectedOutput:testCase.expectedOutput,
          actualOutput,
          stderr:result.stderr,
        },
    );
  }

  res.status(200).json({
    success: !compileError && results.length > 0 && results.every((r) => r.passed),
    compileError,
    results,
  });
}
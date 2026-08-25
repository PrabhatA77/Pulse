import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Problem } from "../models/problem.model.js";
import type { ProblemDocument } from "../models/problem.model.js";
import { Interview } from "../models/interview.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { runTestCases,summarizeStatus } from "../services/testRunner.service.js";
import { evaluateSubmission } from "../services/gemini.service.js";

interface SubmitInterviewBody {
  problemId: string;
  language: string;
  code: string;
}

interface AuthedSubmitRequest extends Request<{}, {}, SubmitInterviewBody> {
  userId?: string;
}

interface AuthedAnalyzeRequest extends Request<{id:string}>{
  userId?: string;
}

interface AuthedHistoryRequest extends Request<{ problemId: string }> {
  userId?: string;
}

interface AuthedGetInterviewRequest extends Request<{ id: string }> {
  userId?: string;
}

// Runs the tests and saves the submission. No AI call here on purpose —
// the candidate should see pass/fail/TLE immediately instead of waiting
// on an LLM round trip before finding out if their code even worked.
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

  const passedTestCases = results.filter((r) => r.passed).length;
  const totalTestCases = results.length;
  const status = summarizeStatus(compileError,results);

  const interview = await Interview.create({
    user: req.userId,
    problem: problem._id,
    language,
    code,
    passedTestCases,
    totalTestCases,
    allPassed: status === "accepted",
    status,
  });

  // const feedback = await evaluateSubmission({
  //   problemTitle: problem.title,
  //   problemDescription: problem.description,
  //   expectedTimeComplexity: problem.expectedTimeComplexity,
  //   expectedSpaceComplexity: problem.expectedSpaceComplexity,
  //   language,
  //   code,
  //   testsPassed: passedTestCases,
  //   testsTotal: totalTestCases,
  // });


  res.status(200).json({
    interviewId: interview._id.toString(),
    compileError,
    status,
    passedTestCases,
    totalTestCases,
  });
}

// Runs the AI evaluation for an already-saved submission, on demand.
// Reuses the code/results already stored on the Interview doc — the
// candidate never has to resubmit to get feedback.
export async function analyzeInterview(req: AuthedAnalyzeRequest, res: Response) {
  const { id } = req.params;
 
  if (!req.userId) {
    throw new AppError("Not authenticated", 401);
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid interview id", 400);
  }
 
  const interview = await Interview.findOne({ _id: id, user: req.userId }).populate<{
    problem: ProblemDocument;
  }>("problem");
 
  if (!interview) {
    throw new AppError("Interview not found", 404);
  }
 
  if (interview.status === "compile_error") {
    throw new AppError("Can't analyze a submission that failed to compile", 400);
  }
 
  // Already analyzed — return the cached feedback instead of paying for
  // another LLM call.
  if (interview.feedback) {
    res.status(200).json({ feedback: interview.feedback });
    return;
  }
 
  const feedback = await evaluateSubmission({
    problemTitle: interview.problem.title,
    problemDescription: interview.problem.description,
    expectedTimeComplexity: interview.problem.expectedTimeComplexity,
    expectedSpaceComplexity: interview.problem.expectedSpaceComplexity,
    language: interview.language,
    code: interview.code,
    testsPassed: interview.passedTestCases,
    testsTotal: interview.totalTestCases,
  });
 
  interview.feedback = feedback;
  await interview.save();
 
  res.status(200).json({ feedback });
}

// Returns the current user's past submissions for a single problem —
// used by the "My Submissions" tab in ProblemPanel so a user can see
// their own progress on that specific question over time.
export async function getSubmissionHistory(req: AuthedHistoryRequest, res: Response) {
  const { problemId } = req.params;

  if (!req.userId) {
    throw new AppError("Not authenticated", 401);
  }
  if (!Types.ObjectId.isValid(problemId)) {
    throw new AppError("Invalid problem id", 400);
  }

  const submissions = await Interview.find({ user: req.userId, problem: problemId })
    .sort({ createdAt: -1 })
    .select("language status passedTestCases totalTestCases allPassed createdAt");

  res.status(200).json(
    submissions.map((s) => ({
      id: s._id.toString(),
      language: s.language,
      status: s.status,
      passedTestCases: s.passedTestCases,
      totalTestCases: s.totalTestCases,
      allPassed: s.allPassed,
      createdAt: s.createdAt.toISOString(),
    })),
  );
}

// Full detail for a single submission — includes the actual code and
// feedback (if analyzed), unlike the history list which is summary-only
// to keep that payload light. Used when a user clicks into a row in
// "My Submissions".
export async function getInterviewById(req: AuthedGetInterviewRequest, res: Response) {
  const { id } = req.params;

  if (!req.userId) {
    throw new AppError("Not authenticated", 401);
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid interview id", 400);
  }

  const interview = await Interview.findOne({ _id: id, user: req.userId });
  if (!interview) {
    throw new AppError("Submission not found", 404);
  }

  res.status(200).json({
    id: interview._id.toString(),
    language: interview.language,
    code: interview.code,
    status: interview.status,
    passedTestCases: interview.passedTestCases,
    totalTestCases: interview.totalTestCases,
    allPassed: interview.allPassed,
    feedback: interview.feedback ?? null,
    createdAt: interview.createdAt.toISOString(),
  });
}
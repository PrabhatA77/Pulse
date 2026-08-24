import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Problem } from "../models/problem.model.js";
import type { ProblemDocument } from "../models/problem.model.js";
import { toPublicProblem } from "./problemController.js";
import { Interview } from "../models/interview.model.js";
import { InterviewSession } from "../models/session.model.js";
import type { InterviewSessionDocument } from "../models/session.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { runTestCases, summarizeStatus } from "../services/testRunner.service.js";
import type { StartSessionInput } from "../validators/session.validator.js";

interface AuthedRequest<TParams = {}, TBody = {}> extends Request<TParams, {}, TBody> {
  userId?: string;
}

function toPublicSession(session: InterviewSessionDocument, problem?: ProblemDocument) {
  return {
    id: session._id.toString(),
    status: session.status,
    durationMinutes: session.durationMinutes,
    startedAt: session.startedAt,
    expiresAt: session.expiresAt,
    interviewId: session.interview?.toString() ?? null,
    problem: problem ? toPublicProblem(problem) : undefined,
  };
}

// Marks a session expired if its clock ran out and nobody submitted in
// time. Checked lazily on every read instead of a background cron job —
// nothing depends on a session's status changing the instant it expires.
async function expireIfNeeded(session: InterviewSessionDocument) {
  if (session.status === "in_progress" && session.expiresAt.getTime() < Date.now()) {
    session.status = "expired";
    await session.save();
  }
}

export async function startSession(
  req: AuthedRequest<{}, StartSessionInput>,
  res: Response,
) {
  if (!req.userId) throw new AppError("Not authenticated", 401);

  const { difficulty, topic, durationMinutes } = req.body;

  const filter: Record<string, string> = {};
  if (difficulty) filter.difficulty = difficulty;
  if (topic) filter.topic = topic;

  const [randomDoc] = await Problem.aggregate([{ $match: filter }, { $sample: { size: 1 } }]);
  if (!randomDoc) {
    throw new AppError("No problems match that topic/difficulty yet", 404);
  }
  const problem = Problem.hydrate(randomDoc);

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

  const session = await InterviewSession.create({
    user: req.userId,
    problem: problem._id,
    durationMinutes,
    startedAt,
    expiresAt,
    status: "in_progress",
  });

  res.status(201).json(toPublicSession(session, problem));
}

export async function getSession(req: AuthedRequest<{ id: string }>, res: Response) {
  if (!req.userId) throw new AppError("Not authenticated", 401);
  if (!Types.ObjectId.isValid(req.params.id)) throw new AppError("Invalid session id", 400);

  const session = await InterviewSession.findOne({ _id: req.params.id, user: req.userId });
  if (!session) throw new AppError("Session not found", 404);

  await expireIfNeeded(session);

  const problem = await Problem.findById(session.problem);
  res.status(200).json(toPublicSession(session, problem ?? undefined));
}

interface SubmitSessionBody {
  language: string;
  code: string;
}

// Runs the submission exactly like a normal interview submit, then closes
// the session out: "completed" if it landed before the deadline,
// "expired" if the clock had already run out server-side by the time
// this request was processed (e.g. it was in flight right at the wire).
export async function submitSession(
  req: AuthedRequest<{ id: string }, SubmitSessionBody>,
  res: Response,
) {
  if (!req.userId) throw new AppError("Not authenticated", 401);
  if (!Types.ObjectId.isValid(req.params.id)) throw new AppError("Invalid session id", 400);

  const { language, code } = req.body;
  if (!language || !code) throw new AppError("language and code are required", 400);

  const session = await InterviewSession.findOne({ _id: req.params.id, user: req.userId });
  if (!session) throw new AppError("Session not found", 404);
  if (session.status !== "in_progress") {
    throw new AppError(`This session is already ${session.status}`, 400);
  }

  const problem = await Problem.findById(session.problem);
  if (!problem) throw new AppError("Problem not found", 404);

  const signature = {
    functionName: problem.functionName,
    parameters: problem.parameters,
    returnType: problem.returnType,
  };
  const { results, compileError } = await runTestCases(language, code, signature, problem.testCases);

  const wasOnTime = Date.now() <= session.expiresAt.getTime();
  const passedTestCases = results.filter((r) => r.passed).length;
  const totalTestCases = results.length;
  const status = summarizeStatus(compileError, results);

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

  session.interview = interview._id;
  session.status = wasOnTime ? "completed" : "expired";
  await session.save();

  res.status(200).json({
    sessionStatus: session.status,
    interviewId: interview._id.toString(),
    compileError,
    status,
    passedTestCases,
    totalTestCases,
  });
}
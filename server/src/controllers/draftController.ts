import type { Request, Response } from "express";
import { Types } from "mongoose";
import { CodeDraft } from "../models/codeDraft.model.js";
import { AppError } from "../middleware/errorHandler.js";
import type { SaveDraftInput } from "../validators/draft.validator.js";

interface AuthedRequest<TParams = {}, TBody = {}> extends Request<TParams, {}, TBody> {
  userId?: string;
}

// GET /api/drafts/:problemId — returns saved code for every language the
// user has touched on this problem, keyed by language, so the editor can
// restore whichever one they were last on.
export async function getDrafts(req: AuthedRequest<{ problemId: string }>, res: Response) {
  if (!req.userId) throw new AppError("Not authenticated", 401);
  if (!Types.ObjectId.isValid(req.params.problemId)) throw new AppError("Invalid problem id", 400);

  const drafts = await CodeDraft.find({ user: req.userId, problem: req.params.problemId });

  const byLanguage: Record<string, string> = {};
  for (const draft of drafts) {
    byLanguage[draft.language] = draft.code;
  }

  res.status(200).json(byLanguage);
}

// PUT /api/drafts/:problemId — upsert-by-(user, problem, language), called
// on a client-side debounce so rapid typing doesn't spam writes.
export async function saveDraft(
  req: AuthedRequest<{ problemId: string }, SaveDraftInput>,
  res: Response,
) {
  if (!req.userId) throw new AppError("Not authenticated", 401);
  if (!Types.ObjectId.isValid(req.params.problemId)) throw new AppError("Invalid problem id", 400);

  const { language, code } = req.body;

  await CodeDraft.findOneAndUpdate(
    { user: req.userId, problem: req.params.problemId, language },
    { code },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({ saved: true });
}
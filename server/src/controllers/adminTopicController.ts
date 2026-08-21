import type { Request, Response } from "express";
import { Topic } from "../models/topic.model.js";
import { AppError } from "../middleware/errorHandler.js";
import type { CreateTopicInput } from "../validators/topic.validator.js";

export async function listTopics(_req: Request, res: Response) {
  const topics = await Topic.find().sort({ name: 1 });
  res.status(200).json(topics.map((t) => ({ id: t._id, name: t.name })));
}

export async function createTopic(
  req: Request<{}, {}, CreateTopicInput>,
  res: Response,
) {
  const existing = await Topic.findOne({ name: req.body.name });
  if (existing) {
    throw new AppError("Topic already exists", 409);
  }

  const topic = await Topic.create({ name: req.body.name });
  res.status(201).json({ id: topic._id, name: topic.name });
}

// No dependency check against Problem.topic on purpose — topic is stored
// as a plain string on each problem (not a ref), so deleting it here just
// removes it from future selection, same as how orphaned refs elsewhere
// (e.g. dashboardController's "Deleted problem" fallback) are tolerated
// rather than blocked.
export async function deleteTopic(req: Request<{ id: string }>, res: Response) {
  const topic = await Topic.findByIdAndDelete(req.params.id);
  if (!topic) throw new AppError("Topic not found", 404);
  res.status(200).json({ message: "Topic deleted" });
}
import type { Response, Request } from "express";
import { Types } from "mongoose";
import { Interview } from "../models/interview.model.js";
import { AppError } from "../middleware/errorHandler.js";

interface AuthedRequest extends Request {
  userId?: string;
}

const ACTIVITY_WINDOW_DAYS = 90;

// Shape of what .find().populate("problem", "title topic difficulty").lean()
// actually returns — Mongoose's own generics for lean+populate get messy
// fast, easier to just describe the real shape directly.
interface LeanInterview {
  _id: Types.ObjectId;
  problem: { _id: Types.ObjectId; title: string; topic: string; difficulty: string } | null;
  language: string;
  passedTestCases: number;
  totalTestCases: number;
  allPassed: boolean;
  feedback: {
    correctnessSummary: string;
    observedTimeComplexity: string;
    observedSpaceComplexity: string;
    complexityMatchesExpected: boolean;
    codeQualityNotes: string;
    strengths: string[];
    areasToImprove: string[];
    followUpQuestion: string;
  };
  createdAt: Date;
}

export async function getDashboard(req: AuthedRequest, res: Response) {
  if (!req.userId) {
    throw new AppError("Not authenticated", 401);
  }

  const userId = new Types.ObjectId(req.userId);
  const windowStart = new Date(Date.now() - ACTIVITY_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const [totalInterviews, solvedAgg, recent, activityAgg] = await Promise.all([
    Interview.countDocuments({ user: userId }),

    Interview.aggregate<{ _id: null; count: number }>([
      { $match: { user: userId, allPassed: true } },
      { $count: "count" },
    ]),

    Interview.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("problem", "title topic difficulty")
      .lean<LeanInterview[]>(),

    Interview.aggregate<{ _id: string; count: number }>([
      { $match: { user: userId, createdAt: { $gte: windowStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.status(200).json({
    stats: {
      totalInterviews,
      totalSolved: solvedAgg[0]?.count ?? 0,
    },
    recentInterviews: recent.map((interview) => ({
      id: interview._id.toString(),
      problemTitle: interview.problem?.title ?? "Deleted problem",
      topic: interview.problem?.topic ?? null,
      difficulty: interview.problem?.difficulty ?? null,
      language: interview.language,
      passedTestCases: interview.passedTestCases,
      totalTestCases: interview.totalTestCases,
      allPassed: interview.allPassed,
      feedback: interview.feedback,
      createdAt: interview.createdAt.toISOString(),
    })),
    activityByDay: activityAgg.map((a) => ({ date: a._id, count: a.count })),
  });
}
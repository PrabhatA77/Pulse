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
  testsPassed: number;
  testsTotal: number;
  allPassed: boolean;
  feedback: {
    score: number;
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

  const [totalInterviews, scoreAgg, recent, activityAgg] = await Promise.all([
    Interview.countDocuments({ user: userId }),

    Interview.aggregate<{ _id: null; avg: number }>([
      { $match: { user: userId } },
      { $group: { _id: null, avg: { $avg: "$feedback.score" } } },
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
      averageScore: scoreAgg[0]?.avg != null ? Math.round(scoreAgg[0].avg) : null,
    },
    recentInterviews: recent.map((interview) => ({
      id: interview._id.toString(),
      problemTitle: interview.problem?.title ?? "Deleted problem",
      topic: interview.problem?.topic ?? null,
      difficulty: interview.problem?.difficulty ?? null,
      language: interview.language,
      score: interview.feedback.score,
      testsPassed: interview.testsPassed,
      testsTotal: interview.testsTotal,
      allPassed: interview.allPassed,
      feedback: interview.feedback,
      createdAt: interview.createdAt.toISOString(),
    })),
    activityByDay: activityAgg.map((a) => ({ date: a._id, count: a.count })),
  });
}
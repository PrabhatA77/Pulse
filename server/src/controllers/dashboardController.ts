import type { Response, Request } from "express";
import { Types } from "mongoose";
import { Interview } from "../models/interview.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { Problem } from "../models/problem.model.js";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

interface AuthedRequest extends Request {
  userId?: string;
}

const ACTIVITY_WINDOW_DAYS = 365;

// Shape of what .find().populate("problem", "title topic difficulty").lean()
// actually returns — Mongoose's own generics for lean+populate get messy
// fast, easier to just describe the real shape directly.
interface LeanInterview {
  _id: Types.ObjectId;
  problem: { _id: Types.ObjectId; title: string;difficulty: string } | null;
  language: string;
  passedTestCases: number;
  totalTestCases: number;
  allPassed: boolean;
  status: "compile_error" | "time_limit_exceeded" | "wrong_answer" | "accepted";
  // Only set once the user has clicked "Analyze with AI" for that submission.
  feedback?: {
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

  const [totalInterviews, recent, activityAgg, solvedByDifficultyAgg, totalByDifficultyAgg] =
    await Promise.all([
      Interview.countDocuments({ user: userId }),

      Interview.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("problem", "title difficulty")
        .lean<LeanInterview[]>(),

      Interview.aggregate<{ _id: string; count: number }>([
        { $match: { user: userId, createdAt: { $gte: windowStart } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Unique problems this user has ever solved correctly (all test
      // cases passed on at least one submission), grouped by the
      // problem's difficulty. Grouping on `problem` FIRST is what
      // collapses repeat solves/resubmissions of the same problem down
      // to a single count — solving "Two Sum" 5 times still counts once.
      Interview.aggregate<{ _id: string; count: number }>([
        { $match: { user: userId, allPassed: true } },
        { $group: { _id: "$problem" } },
        {
          $lookup: {
            from: "problems",
            localField: "_id",
            foreignField: "_id",
            as: "problem",
          },
        },
        { $unwind: "$problem" },
        { $group: { _id: "$problem.difficulty", count: { $sum: 1 } } },
      ]),

      // Total problems that exist per difficulty — independent of the
      // user, this is the denominator for the progress gauge. Replaces
      // the previous hardcoded easyTotal={10}/mediumTotal={10}/etc.
      Problem.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      ]),
    ]);

  const solvedMap = Object.fromEntries(solvedByDifficultyAgg.map((d) => [d._id, d.count]));
  const totalMap = Object.fromEntries(totalByDifficultyAgg.map((d) => [d._id, d.count]));
  const totalSolved = DIFFICULTIES.reduce((sum, d) => sum + (solvedMap[d] ?? 0), 0);

  const { currentStreak, longestStreak } = computeStreaks(activityAgg);


  res.status(200).json({
    stats: {
      totalInterviews,
      totalSolved,
      currentStreak,
      longestStreak,
    },
    progress: {
      easySolved: solvedMap["Easy"] ?? 0,
      easyTotal: totalMap["Easy"] ?? 0,
      mediumSolved: solvedMap["Medium"] ?? 0,
      mediumTotal: totalMap["Medium"] ?? 0,
      hardSolved: solvedMap["Hard"] ?? 0,
      hardTotal: totalMap["Hard"] ?? 0,
    },
    recentInterviews: recent.map((interview) => ({
      id: interview._id.toString(),
      problemTitle: interview.problem?.title ?? "Deleted problem",
      difficulty: interview.problem?.difficulty ?? null,
      createdAt: interview.createdAt.toISOString(),
      allPassed: interview.allPassed,
      status: interview.status,
      passedTestCases: interview.passedTestCases,
      totalTestCases: interview.totalTestCases,
      feedback: interview.feedback ?? null,
    })),
    activityByDay: activityAgg.map((a) => ({ date: a._id, count: a.count })),
  });
}

function computeStreaks(activityAgg: { _id: string; count: number }[]): {
  currentStreak: number;
  longestStreak: number;
} {
  const activeDates = new Set(activityAgg.filter((a) => a.count > 0).map((a) => a._id));
  if (activeDates.size === 0) return { currentStreak: 0, longestStreak: 0 };

  const toDateStr = (d: Date) => d.toISOString().slice(0, 10);

  // Current streak: walk backward from today. If today has no activity
  // yet, that shouldn't zero out an in-progress streak — start counting
  // from yesterday instead, same way LeetCode/GitHub treat "today".
  let currentStreak = 0;
  const cursor = new Date();
  if (!activeDates.has(toDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (activeDates.has(toDateStr(cursor))) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Longest streak: scan all active dates in order, tracking the
  // longest run of consecutive days.
  const sortedDates = [...activeDates].sort();
  let longestStreak = 0;
  let run = 0;
  let prevDate: Date | null = null;
  for (const dateStr of sortedDates) {
    const d = new Date(`${dateStr}T00:00:00Z`);
    const diffDays = prevDate ? Math.round((d.getTime() - prevDate.    getTime()) / 86400000) : null;
    run = diffDays === 1 ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    prevDate = d;
  }

  return { currentStreak, longestStreak };
}
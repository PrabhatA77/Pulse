import type { InterviewFeedback, SubmissionStatus } from "./problem.types";

export interface DashboardStats {
  totalInterviews: number;
  totalSolved: number;
  currentStreak:number;
  longestStreak:number;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export interface RecentInterview {
  id: string;
  problemTitle: string;
  difficulty?: string;
  createdAt: string;
  allPassed: boolean;
  status: SubmissionStatus;
  passedTestCases: number;
  totalTestCases: number;
  // Only present once the AI analysis has been run for that submission.
  feedback?: InterviewFeedback | null;
}

export interface DashboardData {
  stats: DashboardStats;
  progress: DifficultyProgress;
  activityByDay: ActivityDay[];
  recentInterviews: RecentInterview[];
}

export interface DifficultyProgress {
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
}
import mongoose, { Schema, Document, Types } from "mongoose";

export interface InterviewFeedback {
  score: number;
  correctnessSummary: string;
  observedTimeComplexity: string;
  observedSpaceComplexity: string;
  complexityMatchesExpected: boolean;
  codeQualityNotes: string;
  strengths: string[];
  areasToImprove: string[];
  followUpQuestion: string;
}

export interface InterviewDocument extends Document {
  user: Types.ObjectId;
  problem: Types.ObjectId;
  language: string;
  code: string;
  testsPassed: number;
  testsTotal: number;
  allPassed: boolean;
  feedback: InterviewFeedback;
}

const feedbackSchema = new Schema<InterviewFeedback>(
  {
    score: { type: Number, required: true },
    correctnessSummary: { type: String, required: true },
    observedTimeComplexity: { type: String, required: true },
    observedSpaceComplexity: { type: String, required: true },
    complexityMatchesExpected: { type: Boolean, required: true },
    codeQualityNotes: { type: String, required: true },
    strengths: { type: [String], default: [] },
    areasToImprove: { type: [String], default: [] },
    followUpQuestion: { type: String, required: true },
  },
  { _id: false },
);

const interviewSchema = new Schema<InterviewDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    testsPassed: { type: Number, required: true },
    testsTotal: { type: Number, required: true },
    allPassed: { type: Boolean, required: true },
    feedback: { type: feedbackSchema, required: true },
  },
  { timestamps: true },
);

export const Interview = mongoose.model<InterviewDocument>("Interview", interviewSchema);
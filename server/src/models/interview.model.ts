import mongoose, { Schema, Document, Types } from "mongoose";
 
export interface InterviewFeedback {
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
  passedTestCases: number;
  totalTestCases: number;
  allPassed: boolean;
  feedback: InterviewFeedback;
  createdAt: Date;
}
 
const feedbackSchema = new Schema<InterviewFeedback>(
  {
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
    passedTestCases: { type: Number, required: true, default: 0 },
    totalTestCases: { type: Number, required: true, default: 0 },
    allPassed: { type: Boolean, required: true, default: false },
    feedback: { type: feedbackSchema, required: true },
  },
  { timestamps: true },
);
 
export const Interview = mongoose.model<InterviewDocument>("Interview", interviewSchema);
 
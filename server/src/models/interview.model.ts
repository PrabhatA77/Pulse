import mongoose, { Schema, Document, Types } from "mongoose";
 
export type InterviewSource = "practice" | "session";

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

export type SubmissionStatus =
  | "compile_error"
  | "time_limit_exceeded"
  | "wrong_answer"
  | "accepted";
 
export interface InterviewDocument extends Document {
  user: Types.ObjectId;
  problem: Types.ObjectId;
  language: string;
  code: string;
  passedTestCases: number;
  totalTestCases: number;
  allPassed: boolean;
  status: SubmissionStatus;
  source: InterviewSource;
  feedback?: InterviewFeedback;
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
    status:{
      type:String,
      enum:["compile_error","time_limit_exceeded","wrong_answer","accepted"],
      required:true,
    },
    source: {
      type: String,
      enum: ["practice", "session"],
      default: "practice",
      required: true,
    },
    feedback: { type: feedbackSchema, required: false },
  },
  { timestamps: true },
);
 
export const Interview = mongoose.model<InterviewDocument>("Interview", interviewSchema);
 
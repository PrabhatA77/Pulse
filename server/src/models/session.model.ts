import mongoose, { Schema, Document, Types } from "mongoose";

export type SessionStatus = "in_progress" | "completed" | "expired";

export interface InterviewSessionDocument extends Document {
  user: Types.ObjectId;
  problem: Types.ObjectId;
  durationMinutes: number;
  startedAt: Date;
  expiresAt: Date;
  status: SessionStatus;
  interview?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<InterviewSessionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    durationMinutes: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["in_progress", "completed", "expired"],
      default: "in_progress",
    },
    interview: { type: Schema.Types.ObjectId, ref: "Interview" },
  },
  { timestamps: true },
);

export const InterviewSession = mongoose.model<InterviewSessionDocument>(
  "InterviewSession",
  sessionSchema,
);
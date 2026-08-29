import mongoose, { Schema, Document, Types } from "mongoose";

export interface CodeDraftDocument extends Document {
  user: Types.ObjectId;
  problem: Types.ObjectId;
  language: string;
  code: string;
  updatedAt: Date;
}

const codeDraftSchema = new Schema<CodeDraftDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true },
);

// One draft per user+problem+language — upserts overwrite in place instead
// of accumulating history, same non-destructive-but-single-row spirit as
// your seed scripts.
codeDraftSchema.index({ user: 1, problem: 1, language: 1 }, { unique: true });

export const CodeDraft = mongoose.model<CodeDraftDocument>("CodeDraft", codeDraftSchema);
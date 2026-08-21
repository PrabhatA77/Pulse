import mongoose, { Schema, Document } from "mongoose";

export interface TopicDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<TopicDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true },
);

export const Topic = mongoose.model<TopicDocument>("Topic", topicSchema);
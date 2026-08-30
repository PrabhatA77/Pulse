import { env } from "../config/env.js";
import mongoose from "mongoose";

// One-time: every existing problem's single `topic` string becomes a
// one-item `tags` array. Safe to rerun — only touches docs that still
// have `topic` and don't have `tags` yet.
async function migrate() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB");

  const collection = mongoose.connection.db!.collection("problems");
  const cursor = collection.find({ topic: { $exists: true }, tags: { $exists: false } });

  let count = 0;
  for await (const doc of cursor) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { tags: [doc.topic] }, $unset: { topic: "" } },
    );
    count++;
  }

  console.log(`Migrated ${count} problem(s) from topic -> tags`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
import { env } from "../config/env.js";
import mongoose from "mongoose";

// Backfills `source` on Interview docs created before this feature existed.
// Anything referenced by an InterviewSession is a "session" submission;
// everything else is "practice". Safe to rerun.
async function migrate() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB");

  const interviews = mongoose.connection.db!.collection("interviews");
  const sessions = mongoose.connection.db!.collection("interviewsessions");

  const linked = await sessions
    .find({ interview: { $exists: true } })
    .project({ interview: 1 })
    .toArray();
  const sessionInterviewIds = linked.map((s) => s.interview);

  const sessionResult = await interviews.updateMany(
    { _id: { $in: sessionInterviewIds } },
    { $set: { source: "session" } },
  );
  const practiceResult = await interviews.updateMany(
    { _id: { $nin: sessionInterviewIds }, source: { $exists: false } },
    { $set: { source: "practice" } },
  );

  console.log(
    `Marked ${sessionResult.modifiedCount} interview(s) as session, ${practiceResult.modifiedCount} as practice`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
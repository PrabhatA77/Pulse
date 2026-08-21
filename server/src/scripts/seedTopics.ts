import { env } from "../config/env.js";
import mongoose from "mongoose";
import { Topic } from "../models/topic.model.js";

// The old hardcoded TOPICS values — upserted so problems already using
// these names (seed data, admin form defaults) keep working once topics
// live in the database. Upsert, not deleteMany/insertMany, so reruns
// don't wipe topics an admin has since added.
const INITIAL_TOPICS = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stacks & Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion & Backtracking",
  "Sorting & Searching",
  "Greedy",
  "Binary Search",
];

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB");

  for (const name of INITIAL_TOPICS) {
    await Topic.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
  }

  console.log(`Seeded ${INITIAL_TOPICS.length} topics`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
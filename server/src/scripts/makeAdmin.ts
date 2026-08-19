import { env } from "../config/env.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx src/scripts/makeAdmin.ts <email>");
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB");

  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true },
  );

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  console.log(`${user.username} (${user.email}) is now an admin.`);

  await mongoose.disconnect();
  process.exit(0);
}

makeAdmin().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import executionRoutes from "./routes/execution.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/problems", executionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/interviews", interviewRoutes);

app.use(errorHandler);

export default app;
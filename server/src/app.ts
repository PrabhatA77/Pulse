import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import executionRoutes from "./routes/execution.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import sessionRoutes from "./routes/session.routes.js";
import draftRoutes from "./routes/draft.routes.js";



const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/problems", executionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/drafts", draftRoutes);

app.use(errorHandler);

export default app;
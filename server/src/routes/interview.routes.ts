import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { submitInterview,analyzeInterview } from "../controllers/interviewController.js";
import { submissionLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/submit", protect,submissionLimiter, submitInterview);

router.post("/:id/analyze",protect,submissionLimiter,analyzeInterview);

export default router;
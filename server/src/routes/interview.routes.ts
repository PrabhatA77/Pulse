import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { submitInterview,analyzeInterview } from "../controllers/interviewController.js";

const router = Router();

router.post("/submit", protect, submitInterview);

router.post("/:id/analyze",protect,analyzeInterview);

export default router;
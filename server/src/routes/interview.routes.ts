import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { submitInterview } from "../controllers/interviewController.js";

const router = Router();

router.post("/submit", protect, submitInterview);

export default router;
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { submissionLimiter } from "../middleware/rateLimiter.js"; // from step 1 — drop this import + arg if you skipped it
import { startSessionSchema } from "../validators/session.validator.js";
import { startSession, getSession, submitSession } from "../controllers/sessionController.js";

const router = Router();

router.post("/", protect, validate(startSessionSchema), startSession);
router.get("/:id", protect, getSession);
router.post("/:id/submit", protect, submissionLimiter, submitSession);

export default router;
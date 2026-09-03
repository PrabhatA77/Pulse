import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { executeCode, executeCustom } from "../controllers/executionController.js";
import { executeLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/execute", protect, executeLimiter, executeCode);
router.post("/execute-custom", protect, executeLimiter, executeCustom);

export default router;
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executionController.js";
import { executeLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/execute", protect,executeLimiter, executeCode);

export default router;
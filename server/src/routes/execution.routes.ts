import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executionController.js";

const router = Router();

router.post("/execute", protect, executeCode);

export default router;
import {Router} from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProblem,getRandomProblem,getTopics,listPublicProblems,getHint } from "../controllers/problemController.js";
import { hintLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.get("/",protect,listPublicProblems);
router.get("/topics",protect,getTopics);
router.get("/random",protect,getRandomProblem);
router.get("/:id/hint",protect,hintLimiter,getHint);
router.get("/:id",protect,getProblem);

export default router;
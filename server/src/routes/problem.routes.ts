import {Router} from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProblem,getRandomProblem,getTopics,listPublicProblems } from "../controllers/problemController.js";

const router = Router();

router.get("/",protect,listPublicProblems);
router.get("/topics",protect,getTopics);
router.get("/random",protect,getRandomProblem);
router.get("/:id",protect,getProblem);

export default router;
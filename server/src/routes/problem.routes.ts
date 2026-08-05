import {Router} from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProblem,getRandomProblem } from "../controllers/problemController.js";

const router = Router();

router.get("/random",protect,getRandomProblem);
router.get("/:id",protect,getProblem);

export default router;
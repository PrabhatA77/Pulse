import { Router } from "express";
import { protect, isAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProblemSchema, updateProblemSchema } from "../validators/problem.validator.js";
import {
  listProblems,
  getProblemAdmin,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/adminProblemController.js";

const router = Router();

// Every route below requires login AND the admin role.
router.use(protect, isAdmin);

router.get("/problems", listProblems);
router.get("/problems/:id", getProblemAdmin);
router.post("/problems", validate(createProblemSchema), createProblem);
router.put("/problems/:id", validate(updateProblemSchema), updateProblem);
router.delete("/problems/:id", deleteProblem);

export default router;
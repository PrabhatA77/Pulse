import { Router } from "express";
import { protect, isAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProblemSchema, updateProblemSchema } from "../validators/problem.validator.js";
import { createTopicSchema } from "../validators/topic.validator.js";
import {
  listProblems,
  getProblemAdmin,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/adminProblemController.js";
import { listTopics, createTopic, deleteTopic } from "../controllers/adminTopicController.js";

const router = Router();

router.use(protect, isAdmin);

router.get("/problems", listProblems);
router.get("/problems/:id", getProblemAdmin);
router.post("/problems", validate(createProblemSchema), createProblem);
router.put("/problems/:id", validate(updateProblemSchema), updateProblem);
router.delete("/problems/:id", deleteProblem);

router.get("/topics", listTopics);
router.post("/topics", validate(createTopicSchema), createTopic);
router.delete("/topics/:id", deleteTopic);

export default router;
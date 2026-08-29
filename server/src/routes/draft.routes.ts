import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { saveDraftSchema } from "../validators/draft.validator.js";
import { getDrafts, saveDraft } from "../controllers/draftController.js";

const router = Router();

router.get("/:problemId", protect, getDrafts);
router.put("/:problemId", protect, validate(saveDraftSchema), saveDraft);

export default router;
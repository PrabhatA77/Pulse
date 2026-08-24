import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uploadAvatarMiddleware } from "../middleware/upload.middleware.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/profile.validator.js";
import { updateProfile, uploadAvatar, removeAvatar, changePassword,deleteAccount } from "../controllers/profileController.js";

const router = Router();

router.use(protect);

router.put("/", validate(updateProfileSchema), updateProfile);
router.post("/avatar", uploadAvatarMiddleware, uploadAvatar);
router.delete("/avatar", removeAvatar);
router.post("/change-password", validate(changePasswordSchema), changePassword);

router.delete("/", deleteAccount);

export default router;
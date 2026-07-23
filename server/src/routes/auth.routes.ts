import { Router } from "express";
import { authLimiter,otpLimiter } from "../middleware/rateLimiter.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { signupSchema,loginSchema,verifyOtpSchema,resendOtpSchema,forgotPasswordSchema,resetPasswordSchema,googleAuthSchema } from "../validators/auth.validator.js";
import { signup,verifyOtp,resendOtp,login,googleLogin,forgotPassword,resetPassword,logout,getMe } from "../controllers/authController.js";

const router = Router();

router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/verify-otp", otpLimiter, validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", otpLimiter, validate(resendOtpSchema), resendOtp);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/google", authLimiter, validate(googleAuthSchema), googleLogin);
router.post("/forgot-password", otpLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", otpLimiter, validate(resetPasswordSchema), resetPassword);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
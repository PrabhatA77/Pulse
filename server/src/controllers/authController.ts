import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  generateOtp,
  hashOtp,
  compareOtp,
  otpExpiryDate,
} from "../utils/otp.util.js";
import {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
} from "../utils/token.util.js";
import { sendOtpEmail } from "../utils/email.util.js";
import { env } from "../config/env.js";
import {
  type SignupInput,
  type VerifyOtpInput,
  type ResendOtpInput,
  type LoginInput,
  type GoogleAuthInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "../validators/auth.validator.js";

const googleClient = new OAuth2Client(env.googleClientId);

async function generateUniqueUsername(base: string): Promise<string> {
  let username = base.replace(/[^a-zA-Z0-9]/g, "");
  let suffix = 0;
  while (await User.findOne({ username })) {
    suffix++;
    username = `${base}${suffix}`;
  }
  return username;
}

function publicUser(user: any) {
  return { id: user.id, username: user.username, email: user.email,role:user.role};
}

export async function signup(req: Request<{}, {}, SignupInput>, res: Response) {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing && existing.isVerified) {
    throw new AppError("Username or email already in use", 409);
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);

  let user;
  if (existing && !existing.isVerified) {
    existing.username = username;
    existing.password = password;
    existing.otp = hashedOtp;
    existing.otpExpiry = otpExpiryDate();
    user = await existing.save();
  } else {
    user = await User.create({
      username,
      email,
      password,
      otp: hashedOtp,
      otpExpiry: otpExpiryDate(),
    });
  }

  await sendOtpEmail(email, otp, "verify");

  res.status(201).json({
    success: true,
    message:
      "Signup successful. Please check your email for the verification code.",
    email: user.email,
  });
}

export async function verifyOtp(
  req: Request<{}, {}, VerifyOtpInput>,
  res: Response,
) {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) throw new AppError("User not found", 404);
  if (user.isVerified) throw new AppError("User already verified", 400);
  if (!user.otp || !user.otpExpiry) throw new AppError("No OTP requested", 400);
  if (user.otpExpiry.getTime() < Date.now())
    throw new AppError("OTP expired", 400);

  const isValid = await compareOtp(otp, user.otp);
  if (!isValid) throw new AppError("Invalid OTP", 400);

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    user: publicUser(user),
  });
}

export async function resendOtp(
  req: Request<{}, {}, ResendOtpInput>,
  res: Response,
) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 404);
  if (user.isVerified) throw new AppError("User already verified", 400);

  const otp = generateOtp();
  user.otp = await hashOtp(otp);
  user.otpExpiry = otpExpiryDate();
  await user.save();

  await sendOtpEmail(email, otp, "verify");

  res.status(200).json({ message: "OTP resent successfully" });
}

export async function login(req:Request<{},{},LoginInput>,res:Response){
    const {identifier,password} = req.body;

    const user = await User.findOne({
        $or:[{email:identifier},{username:identifier}],
    }).select("+password");

    if(!user || user.authProvider!=="local"){
        throw new AppError("Invalid Credentials",401);
    }
    if(!user.isVerified){
        throw new AppError("Please verify your email before logging in",403);
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) throw new AppError("Invalid credentials",401);

    const token = generateToken(user._id.toString());
    setAuthCookie(res,token);

    res.status(200).json({
        success:true,
        message:"Login Successful",
        user:publicUser(user)
    });
}

export async function googleLogin(req: Request<{}, {}, GoogleAuthInput>, res: Response) {
  const { credential } = req.body;

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError("Invalid Google token", 400);

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const baseUsername = payload.email.split("@")[0] ?? "user";
    user = await User.create({
      username: await generateUniqueUsername(baseUsername),
      email: payload.email,
      authProvider: "google",
      googleId: payload.sub,
      isVerified: true,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    await user.save();
  }

  const token = generateToken(user._id.toString());
  setAuthCookie(res, token);

  res.status(200).json({ message: "Login successful", user: publicUser(user) });
}

export async function forgotPassword(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user && user.authProvider === "local") {
    const otp = generateOtp();
    user.resetOtp = await hashOtp(otp);
    user.resetOtpExpiry = otpExpiryDate();
    await user.save();
    await sendOtpEmail(email, otp, "reset");
  }

  res.status(200).json({
    message: "If an account exists for this email, a reset code has been sent.",
  });
}

export async function resetPassword(req: Request<{}, {}, ResetPasswordInput>, res: Response) {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email }).select("+resetOtp +resetOtpExpiry");
  if (!user || !user.resetOtp || !user.resetOtpExpiry) {
    throw new AppError("Invalid or expired reset request", 400);
  }
  if (user.resetOtpExpiry.getTime() < Date.now()) {
    throw new AppError("OTP expired", 400);
  }

  const isValid = await compareOtp(otp, user.resetOtp);
  if (!isValid) throw new AppError("Invalid OTP", 400);

  user.password = newPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful. Please log in." });
}

export function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);
  res.status(200).json({ user: publicUser(user) });
}
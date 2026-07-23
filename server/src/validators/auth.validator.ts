import {email, z} from "zod";

export const signupSchema = z.object({
    username:z.string().trim().min(3,"username must be at least 3 characters.").max(30,"username cannot be long then 30 characters."),
    email:z.email().trim(),
    password:z.string().trim().min(8,"password should be at least 8 characters.")
});

export const loginSchema = z.object({
    identifier:z.string().trim().min(3,"Too short length"),
    password:z.string().trim().min(8,"password should be at least 8 characters."),
});

export const verifyOtpSchema = z.object({
    email:z.email().trim(),
    otp:z.string().length(6),
});

export const resendOtpSchema = z.object({
    email:z.email().trim(),
});

export const forgotPasswordSchema = z.object({
    email:z.email().trim(),
});

export const resetPasswordSchema = z.object({
    email:z.email().trim(),
    otp:z.string().trim().length(6),
    newPassword:z.string().trim().min(8),
});

export const googleAuthSchema = z.object({
    credential:z.string(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
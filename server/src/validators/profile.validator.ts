import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().max(60, "Full name is too long").optional(),
  bio: z.string().trim().max(160, "Bio is too long").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { uploadAvatarBuffer, deleteAvatar } from "../utils/cloudinary.util.js";
import { toPublicUser } from "../utils/publicUser.util.js";
import type { UpdateProfileInput, ChangePasswordInput } from "../validators/profile.validator.js";

interface AuthedRequest<TBody = {}> extends Request<{}, {}, TBody> {
  userId?: string;
}

export async function updateProfile(req: AuthedRequest<UpdateProfileInput>, res: Response) {
  if (!req.userId) throw new AppError("Not authenticated", 401);

  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);

  if (req.body.fullName !== undefined) user.fullName = req.body.fullName;
  if (req.body.bio !== undefined) user.bio = req.body.bio;
  await user.save();

  res.status(200).json({ user: toPublicUser(user) });
}

// req.file is typed via @types/multer's global Express.Request augmentation.
export async function uploadAvatar(req: AuthedRequest, res: Response) {
  if (!req.userId) throw new AppError("Not authenticated", 401);
  if (!req.file) throw new AppError("No image file provided", 400);

  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);

  const { url } = await uploadAvatarBuffer(req.file.buffer, user.id);
  user.avatarUrl = url;
  await user.save();

  res.status(200).json({ user: toPublicUser(user) });
}

export async function removeAvatar(req: AuthedRequest, res: Response) {
  if (!req.userId) throw new AppError("Not authenticated", 401);

  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);

  if (user.avatarUrl) {
    await deleteAvatar(user.id).catch(() => {
      // Best-effort — if the Cloudinary asset is already gone for any
      // reason, don't block clearing the local reference.
    });
    user.avatarUrl = undefined;
    await user.save();
  }

  res.status(200).json({ user: toPublicUser(user) });
}

export async function changePassword(req: AuthedRequest<ChangePasswordInput>, res: Response) {
  if (!req.userId) throw new AppError("Not authenticated", 401);

  const user = await User.findById(req.userId).select("+password");
  if (!user) throw new AppError("User not found", 404);
  if (user.authProvider !== "local") {
    throw new AppError("Password changes aren't available for Google accounts", 400);
  }

  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) throw new AppError("Current password is incorrect", 401);

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
}

export async function deleteAccount(req: AuthedRequest, res: Response) {
  if (!req.userId) throw new AppError("Not authenticated", 401);

  const user = await User.findById(req.userId);
  if (!user) throw new AppError("User not found", 404);

  if (user.avatarUrl) {
    await deleteAvatar(user.id).catch(() => {
      // Best-effort, same as removeAvatar — don't block account deletion
      // if the Cloudinary asset is already gone.
    });
  }

  await user.deleteOne();

  res.clearCookie("token");
  res.status(200).json({ message: "Account deleted" });
}
import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";

const storage = multer.memoryStorage();
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const avatarUpload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new AppError("Only image files are allowed", 400));
      return;
    }
    cb(null, true);
  },
}).single("avatar");

export function uploadAvatarMiddleware(req: Request, res: Response, next: NextFunction) {
  avatarUpload(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("Image must be smaller than 5MB", 400));
      }
      return next(new AppError(err.message, 400));
    }
    if (err) return next(err);
    next();
  });
}
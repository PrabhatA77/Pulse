import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const AVATAR_FOLDER = "pulse/avatars";

export function avatarPublicId(userId: string): string {
  return `${AVATAR_FOLDER}/${userId}`;
}

export interface UploadResult {
  url: string;
}

export function uploadAvatarBuffer(buffer: Buffer, userId: string): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: avatarPublicId(userId),
        overwrite: true,
        resource_type: "image",
        // Square, face-aware crop so avatars look consistent regardless
        // of the source image's aspect ratio.
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve({ url: result.secure_url });
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

export function deleteAvatar(userId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(avatarPublicId(userId), (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
}
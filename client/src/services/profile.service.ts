import api from "../api/axios";
import type { User } from "../types/auth.types";

export const profileService = {
  update: (data: { fullName?: string; bio?: string }) =>
    api.put<{ user: User }>("/profile", data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post<{ user: User }>("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  removeAvatar: () => api.delete<{ user: User }>("/profile/avatar"),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/profile/change-password", { currentPassword, newPassword }),
};
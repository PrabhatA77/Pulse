import { create } from "zustand";
import { authService } from "../services/auth.service";
import type { User } from "../types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  checkAuth: () => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ email: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  login: (identifer: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await authService.getMe();
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  signup: async (username, email, password) => {
    const res = await authService.signup(username, email, password);
    return { email: res.data.email };
  },

  verifyOtp: async (email, otp) => {
    const res = await authService.verifyOtp(email, otp);
    set({ user: res.data.user, isAuthenticated: true });
  },

  resendOtp: async (email) => {
    await authService.resendOtp(email);
  },

  login: async (identifier, password) => {
    const res = await authService.login(identifier, password);
    set({ user: res.data.user, isAuthenticated: true });
  },

  googleLogin: async (credential) => {
    const res = await authService.googleLogin(credential);
    set({ user: res.data.user, isAuthenticated: true });
  },

  forgotPassword: async (email) => {
    await authService.forgotPassword(email);
  },

  resetPassword: async (email, otp, newPassword) => {
    await authService.resetPassword(email, otp, newPassword);
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));

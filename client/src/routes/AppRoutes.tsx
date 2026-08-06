import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import InterviewWorkspace from "../pages/InterviewWorkspace";
import SignupPage from "../pages/auth/SignupPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import PageWrapper from "../components/common/PageWrapper";
import { useAuthStore } from "../store/authStore";

export default function AppRoutes() {
  const location = useLocation();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Populates isAuthenticated/user on first load and on refresh. Nothing
  // else in the app was calling this — without it, isLoading stays true
  // forever and ProtectedRoute/PublicRoute sit on a blank screen.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    // Placed here (rather than in main.tsx, which wasn't provided) so
    // LoginPage's Google button has a provider ancestor without touching a
    // file outside what was shared. Needs VITE_GOOGLE_CLIENT_ID in your env.
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            }
          />

          <Route element={<PublicRoute />}>
            <Route
              path="/signup"
              element={
                <PageWrapper>
                  <SignupPage />
                </PageWrapper>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PageWrapper>
                  <VerifyOtpPage />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <LoginPage />
                </PageWrapper>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PageWrapper>
                  <ForgotPasswordPage />
                </PageWrapper>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PageWrapper>
                  <ResetPasswordPage />
                </PageWrapper>
              }
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <PageWrapper>
                  <DashboardPage />
                </PageWrapper>
              }
            />

            <Route
              path="/interview"
              element={
                <PageWrapper>
                  <InterviewWorkspace />
                </PageWrapper>
              }
            />
          </Route>
        </Routes>
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}

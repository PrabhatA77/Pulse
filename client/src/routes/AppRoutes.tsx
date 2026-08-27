import { Routes, Route, useLocation } from "react-router-dom";
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
import AdminRoute from "./AdminRoute";
import AdminProblemsPage from "../pages/admin/AdminProblemsPage";
import AdminProblemFormPage from "../pages/admin/AdminProblemFormPage";
import AdminTopicsPage from "../pages/admin/AdminTopicPage";
import ProblemsPage from "../pages/ProblemsPage";
import ProfilePage from "../pages/ProfilePage";
import SessionSetupPage from "../pages/SessionSetupPage";
import SessionWorkspace from "../pages/SessionWorkspace";
import AboutPage from "../pages/AboutPage";
import TermsOfServicePage from "../pages/TermsOfServicePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";

export default function AppRoutes() {
  const location = useLocation();

  return (
    // Sole GoogleOAuthProvider for the app — LoginPage's <GoogleLogin>
    // needs a provider ancestor. Needs VITE_GOOGLE_CLIENT_ID in your env.
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

            <Route
              path="/problems"
              element={
                <PageWrapper>
                  <ProblemsPage />
                </PageWrapper>
              }
            />

            <Route
              path="/profile"
              element={
                <PageWrapper>
                  <ProfilePage />
                </PageWrapper>
              }
            />

            <Route
              path="/session/new"
              element={
                <PageWrapper>
                  <SessionSetupPage />
                </PageWrapper>
              }
            />

            <Route
              path="/session/:id"
              element={
                <PageWrapper>
                  <SessionWorkspace />
                </PageWrapper>
              }
            />
          </Route>

          <Route element={<AdminRoute />}>
            <Route
              path="/admin/problems"
              element={
                <PageWrapper>
                  <AdminProblemsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/admin/problems/new"
              element={
                <PageWrapper>
                  <AdminProblemFormPage />
                </PageWrapper>
              }
            />
            <Route
              path="/admin/problems/:id"
              element={
                <PageWrapper>
                  <AdminProblemFormPage />
                </PageWrapper>
              }
            />

            <Route
              path="/admin/topics"
              element={
                <PageWrapper>
                  <AdminTopicsPage />
                </PageWrapper>
              }
            />
          </Route>

          <Route
            path="/about"
            element={
              <PageWrapper>
                <AboutPage />
              </PageWrapper>
            }
          />
          <Route
            path="/terms"
            element={
              <PageWrapper>
                <TermsOfServicePage />
              </PageWrapper>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageWrapper>
                <PrivacyPolicyPage />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}

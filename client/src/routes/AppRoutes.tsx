import { Routes,Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/DashboardPage";
import SignupPage from "../pages/auth/SignupPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import PageWrapper from "../components/common/PageWrapper";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function AppRoutes(){
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={
                <PageWrapper>
                    <LandingPage/>
                </PageWrapper>
                }/>
            
            <Route element={<PublicRoute/>}>
                <Route path="/signup" element={
                    <PageWrapper>
                        <SignupPage/>
                    </PageWrapper>
                    }/>
                <Route path="/verify-otp" element={
                    <PageWrapper>
                        <VerifyOtpPage/>
                    </PageWrapper>
                    }/>
                <Route path="/login" element={
                    <PageWrapper>
                        <LoginPage/>
                    </PageWrapper>
                    }/>
                <Route path="/forgot-password" element={
                    <PageWrapper>
                        <ForgotPasswordPage/>
                    </PageWrapper>
                    }/>
                <Route path="/reset-password" element={
                    <PageWrapper>
                        <ResetPasswordPage/>
                    </PageWrapper>
            }/>
            </Route>

            <Route element={<ProtectedRoute/>}>
                <Route path="/dashboard" element={
                    <PageWrapper>
                        <DashboardPage/>
                    </PageWrapper>
                    }/>
            </Route>
        </Routes>
        </AnimatePresence>
    )
}
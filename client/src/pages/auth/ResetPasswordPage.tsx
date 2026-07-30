import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/Authinput";
import AuthButton from "../../components/auth/Authbutton";
import OtpInput from "../../components/auth/Otpinput";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { isValidEmail,isValidPassword } from "../../utils/validation";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Enter the email you requested the reset for");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    if (!isValidPassword(newPassword)) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim(), otp, newPassword);
      toast.success("Password reset — please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        initialEmail ? `Enter the code sent to ${initialEmail}` : "Enter your email, the code, and a new password"
      }
      footer={
        <>
          Back to{" "}
          <Link to="/login" className="font-medium text-[#1a3a5c] hover:underline dark:text-[#019bf0]">
            log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {!initialEmail && (
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            autoComplete="email"
          />
        )}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Reset code</span>
          <OtpInput value={otp} onChange={setOtp} />
        </div>

        <AuthInput
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <AuthButton type="submit" loading={loading}>
          Reset password
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
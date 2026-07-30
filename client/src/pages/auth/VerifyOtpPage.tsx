import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/Authinput";
import AuthButton from "../../components/auth/Authbutton";
import OtpInput from "../../components/auth/Otpinput";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { isValidEmail } from "../../utils/validation";

const RESEND_COOLDOWN_SECONDS = 30;

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);

  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(initialEmail ? RESEND_COOLDOWN_SECONDS : 0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Enter the email you signed up with");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Email verified!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isValidEmail(email)) {
      toast.error("Enter the email you signed up with");
      return;
    }
    setResending(true);
    try {
      await resendOtp(email);
      toast.success("A new code is on its way.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        initialEmail ? `We sent a 6-digit code to ${initialEmail}` : "Enter your email and the code we sent you"
      }
      footer={
        <>
          Wrong email?{" "}
          <Link to="/signup" className="font-medium text-[#1a3a5c] hover:underline dark:text-[#019bf0]">
            Sign up again
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Verification code</span>
          <OtpInput value={otp} onChange={setOtp} />
        </div>

        <AuthButton type="submit" loading={loading}>
          Verify
        </AuthButton>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="text-sm text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-[#019bf0]"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : resending ? "Resending..." : "Resend code"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/Authinput";
import AuthButton from "../../components/auth/Authbutton";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { isValidEmail } from "../../utils/validation";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      toast.success("If that account exists, a reset code is on its way.");
      navigate("/reset-password", { state: { email: email.trim() } });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset code."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-[#1a3a5c] hover:underline dark:text-[#019bf0]">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <AuthButton type="submit" loading={loading}>
          Send reset code
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/Authinput";
import AuthButton from "../../components/auth/Authbutton";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { isValidEmail,isValidPassword,isValidUsername } from "../../utils/validation";

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = { username: "", email: "", password: "", confirmPassword: "" };

const SignupPage = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!isValidUsername(form.username)) {
      next.username = "3-20 characters, letters/numbers/underscore only";
    }
    if (!isValidEmail(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (!isValidPassword(form.password)) {
      next.password = "At least 8 characters";
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords don't match";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { email } = await signup(form.username, form.email, form.password);
      toast.success("Account created — check your email for the code.");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start practicing with your AI interviewer."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#1a3a5c] hover:underline dark:text-[#019bf0]">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <AuthInput
          label="Username"
          value={form.username}
          onChange={update("username")}
          error={errors.username}
          autoComplete="username"
        />
        <AuthInput
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <AuthButton type="submit" loading={loading} className="mt-2">
          Sign up
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
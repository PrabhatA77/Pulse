import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/Authinput";
import AuthButton from "../../components/auth/Authbutton";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/getErrorMessage";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Enter your email/username and password");
      return;
    }

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) {
      toast.error("Google sign-in didn't return a token — try again.");
      return;
    }
    setGoogleLoading(true);
    try {
      await googleLogin(credential);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Pick up your interview prep where you left off."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-[#1a3a5c] hover:underline dark:text-[#019bf0]">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <AuthInput
          label="Email or username"
          value={identifier}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
          autoComplete="username"
        />
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <div className="-mt-2 text-right">
          <Link
            to="/forgot-password"
            className="text-xs text-zinc-500 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" loading={loading}>
          Log in
        </AuthButton>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs uppercase text-zinc-400">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="flex justify-center">
        {googleLoading ? (
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Signing in…</div>
        ) : (
          <GoogleLogin
            onSuccess={(res) => handleGoogleSuccess(res.credential)}
            onError={() => toast.error("Google sign-in failed")}
          />
        )}
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
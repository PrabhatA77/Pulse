import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const AuthButton = ({ loading = false, disabled, children, className, ...props }: AuthButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a3a5c] px-4 py-2.5 font-semibold uppercase tracking-wide text-white shadow transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0] ${
        className ?? ""
      }`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default AuthButton;
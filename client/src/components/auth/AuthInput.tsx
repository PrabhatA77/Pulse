import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-xl border bg-white px-4 py-2 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:ring-2 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-600 ${
            error
              ? "border-red-400 focus:ring-red-400/30"
              : "border-zinc-300 focus:border-[#1a3a5c] focus:ring-[#1a3a5c]/30 dark:border-zinc-700 dark:focus:border-[#019bf0] dark:focus:ring-[#019bf0]/30"
          } ${className ?? ""}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
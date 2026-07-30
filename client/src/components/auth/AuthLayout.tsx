import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Shared shell for every auth page — centered card, PULSE wordmark linking
 * home, title/subtitle, and a footer slot for "already have an account?"
 * style links. Keeps the five auth pages visually consistent instead of
 * each re-implementing the same card.
 */
const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12 dark:bg-[#0e1316]">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <Link to="/" className="mb-6 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#1a3a5c] dark:text-[#019bf0]">PULSE</span>
        </Link>

        <h1 className="text-center text-xl font-semibold text-zinc-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        )}

        <div className="mt-6">{children}</div>

        {footer && (
          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">{footer}</div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
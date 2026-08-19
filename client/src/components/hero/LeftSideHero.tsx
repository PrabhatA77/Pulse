import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { useAuthStore } from "../../store/authStore";

const LeftSideHero = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const features = [
    "Simulate technical problems with an intelligent AI Analyzer",
    "Solve curated DSA problems across multiple difficulty levels",
    "Get instant feedback on correctness, runtime, and approach",
  ];

  return (
    <div className="relative flex w-full flex-col items-center gap-6 text-center xl:w-1/2 xl:items-start xl:text-left">
      {/* Soft Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-10 -left-10 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15"
        aria-hidden="true"
      />

      <StatusBadge />

      {/* Main Heading with Gradient Highlight */}
      <h1 className="max-w-xl text-3xl font-extrabold tracking-tight uppercase text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
        Think.{" "}
        <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
          Code.
        </span>{" "}
        Succeed.
      </h1>

      {/* Feature Bullet Points */}
      <div className="flex max-w-xl flex-col gap-2.5 text-left text-sm text-slate-600 sm:text-base dark:text-zinc-300">
        {features.map((text, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              ✓
            </span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* CTA Button with Hover Motion */}
      <div className="pt-2">
        <button
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
          className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98] dark:shadow-blue-900/30"
        >
          <span>{isAuthenticated ? "Go To Dashboard" : "Get Started Free"}</span>
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LeftSideHero;
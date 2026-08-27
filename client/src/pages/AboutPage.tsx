import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Code2,
  Target,
  Users,
  Zap,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const VALUES = [
  {
    icon: Target,
    title: "Practice like the real thing",
    description:
      "Every problem is paired with an AI interviewer that reacts to your actual code — not a canned answer key.",
  },
  {
    icon: Zap,
    title: "Instant, honest feedback",
    description:
      "See pass/fail results the moment you submit, then dig into complexity and code quality whenever you're ready.",
  },
  {
    icon: ShieldCheck,
    title: "Safe to experiment",
    description:
      "Every submission runs in an isolated sandbox with strict limits, so you can try bold ideas without worry.",
  },
  {
    icon: Users,
    title: "Built for growth",
    description:
      "Streaks, activity graphs, and submission history keep you honest about how consistently you're practicing.",
  },
];

const STATS = [
  { label: "Languages supported", value: "4" },
  { label: "Sandboxed execution", value: "100%" },
  { label: "AI-powered review", value: "Every submission" },
  { label: "Difficulty levels", value: "3" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const AboutPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen w-full dark:bg-[#0e1316]">
      {/* Hero */}
      <div className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl text-center">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#019bf0]/20 bg-[#019bf0]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#019bf0]">
              <Sparkles className="h-3 w-3" />
              About Pulse
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              Interview practice that{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                actually feels real.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-zinc-400">
              Pulse pairs a LeetCode-style problem set with an AI interviewer that evaluates your actual
              submitted code — correctness, complexity, and quality — so you walk into your next
              technical interview having already done the real thing.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission */}
      <section className="mx-auto max-w-5xl px-4 pb-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1a3a5c] dark:text-[#019bf0]">
            <Code2 className="h-4 w-4" />
            Our approach
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            Most practice platforms stop at a green checkmark. Pulse goes further: once your solution
            passes, an AI interviewer reads your actual code and tells you what a real interviewer would
            — how it stacks up on time and space complexity, what's clean about it, what needs work, and
            what they'd ask you next. It's built to close the gap between "I solved it" and "I could
            explain it under pressure."
          </p>
        </motion.div>
      </section>

      {/* Values grid */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            What we care about
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {VALUES.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl transition-all duration-300 hover:border-[#019bf0]/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#019bf0]/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1a3a5c]/10 text-[#1a3a5c] dark:bg-[#019bf0]/10 dark:text-[#019bf0]">
                <value.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{value.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-[#1a3a5c] dark:text-[#019bf0] sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-zinc-200 bg-linear-to-br from-[#1a3a5c]/5 to-[#019bf0]/5 p-8 shadow-xl dark:border-zinc-800 dark:from-[#019bf0]/10 dark:to-[#019bf0]/5"
        >
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
            Ready to start practicing?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Jump into a problem or start a timed mock interview — your progress is tracked automatically.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98] dark:shadow-blue-900/30"
          >
            <span>{isAuthenticated ? "Go to dashboard" : "Get started free"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

const LegalLayout = ({ title, lastUpdated, intro, sections }: LegalLayoutProps) => {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen w-full dark:bg-[#0e1316]">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-linear-to-b from-zinc-50 to-white px-4 py-12 dark:border-zinc-800 dark:from-zinc-900 dark:to-[#0e1316] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
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
              Legal
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: {lastUpdated}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-zinc-400">
              {intro}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Sticky table of contents — desktop only */}
          <nav className="hidden shrink-0 lg:block lg:w-56">
            <div className="sticky top-24 flex flex-col gap-1 border-l border-zinc-200 pl-4 dark:border-zinc-800">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleNavClick(s.id)}
                  className={`rounded-md px-2 py-1.5 text-left text-xs font-medium transition-all duration-200 ${
                    activeId === s.id
                      ? "bg-[#019bf0]/10 text-[#1a3a5c] dark:text-[#019bf0]"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </nav>

          {/* Sections */}
          <div className="flex-1 space-y-8">
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
                onViewportEnter={() => setActiveId(s.id)}
                className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {i + 1}. {s.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {s.content}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
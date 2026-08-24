import { motion, type Variants } from "framer-motion";
import { Sparkles, Code2, BarChart3, Layers, Zap, ShieldCheck } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Mock Interviews",
    shortDescription: "Get evaluated like a real technical interview.",
    longDescription:
      "Submit your solution and get an AI-generated breakdown of correctness, complexity, and code quality — plus a realistic follow-up question.",
  },
  {
    icon: Code2,
    title: "Multi-Language Execution",
    shortDescription: "Write and run code in JavaScript, Python, C++, or Java.",
    longDescription:
      "Your solution is compiled and run in a sandboxed environment against real test cases, with instant pass/fail feedback per language.",
  },
  {
    icon: BarChart3,
    title: "Real Progress Tracking",
    shortDescription: "See exactly where you stand.",
    longDescription:
      "A LeetCode-style dashboard tracks unique problems solved by difficulty, your submission history, and daily activity over the last year.",
  },
  {
    icon: Layers,
    title: "Curated DSA Library",
    shortDescription: "Practice problems organized by topic and difficulty.",
    longDescription:
      "Browse or jump into a random problem filtered by topic — Arrays, Graphs, DP, and more — each with clear constraints and examples.",
  },
  {
    icon: Zap,
    title: "Instant Complexity Analysis",
    shortDescription: "Know your Big-O, automatically.",
    longDescription:
      "The AI reads your submitted code and infers its actual time and space complexity, then compares it against the expected optimal solution.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Sandboxed",
    shortDescription: "Your code runs safely, every time.",
    longDescription:
      "Every submission executes in an isolated runtime with strict time and memory limits, so nothing you write can affect the platform.",
  },
];

// Generates directional entry: 
// Col 0 -> from left (x: -50)
// Col 1 -> from bottom-center (y: 50)
// Col 2 -> from right (x: 50)
const getCardVariants = (index: number): Variants => {
  const colIndex = index % 3;
  let initialX = 0;
  let initialY = 0;

  if (colIndex === 0) {
    initialX = -100;
  } else if (colIndex === 1) {
    initialY = 100;
  } else {
    initialX = 100;
  }

  return {
    hidden: {
      opacity: 0,
      x: initialX,
      y: initialY,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};

const Features = () => {
  return (
    <section
      id="features"
      className="scroll-mt-20 mx-auto w-full max-w-7xl overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#019bf0]/20 bg-[#019bf0]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#019bf0]">
          Features
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Everything you need to{" "}
          <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            level up
          </span>
        </h2>
        <p className="mt-3 text-sm text-slate-600 sm:text-base dark:text-zinc-400">
          Practice, get evaluated, and track your growth — all in one place.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={getCardVariants(index)}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2 }}
            className="w-full"
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
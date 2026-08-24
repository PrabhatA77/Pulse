import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  longDescription: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  shortDescription,
  longDescription,
}: FeatureCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -4 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex h-72 w-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-[border-color,box-shadow] duration-300 hover:border-[#019bf0]/40 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#019bf0]/40"
    >
      {/* Ambient glow */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.85,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl"
      />

      <div className="flex flex-col gap-4">
        {/* Icon */}
        <motion.div
          animate={{
            scale: hovered ? 1.05 : 1,
            rotate: hovered ? -2 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a3a5c]/10 text-[#1a3a5c] dark:bg-[#019bf0]/10 dark:text-[#019bf0]"
        >
          <Icon className="h-6 w-6" />
        </motion.div>

        {/* Title */}
        <h3 className="relative text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>

        {/* Fixed-height text container to prevent card resizing */}
        <div className="relative h-24 w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={hovered ? "long" : "short"}
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -4,
              }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
              className="absolute inset-0 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
            >
              {hovered ? longDescription : shortDescription}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Accent underline */}
      <motion.div
        animate={{
          scaleX: hovered ? 1 : 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          originX: 0,
        }}
        className="h-0.5 w-full rounded-full bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500"
      />
    </motion.div>
  );
};

export default FeatureCard;
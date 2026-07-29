import { motion } from "framer-motion";

/**
 * Blinking terminal-style cursor. Parent controls visibility — render
 * this only while typing is in progress; it stops rendering (and
 * therefore stops blinking) once typing finishes.
 */
const TypingCursor = () => {
  return (
    <motion.span
      aria-hidden="true"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
      className="inline-block h-4 w-0.5 translate-y-0.75 bg-blue-500"
    />
  );
};

export default TypingCursor;
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  stiffness?: number;
  damping?: number;
}

/**
 * Count-up number. Uses a Framer Motion value under the hood — `.set()`
 * pushes the target and the spring animates toward it — so the DOM text
 * updates without ever calling React's setState, avoiding any
 * render-cascade concerns on mount or on prop changes.
 */
const AnimatedCounter = ({ value, className, stiffness = 100, damping = 20 }: AnimatedCounterProps) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness, damping });
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span className={className}>{display}</motion.span>;
};

export default AnimatedCounter;
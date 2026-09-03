import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const COLORS = ["#019bf0", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#1a3a5c"];
const PARTICLE_COUNT = 32;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface ConfettiBurstProps {
  /** Bump this (e.g. a counter) to trigger a fresh burst. 0 renders nothing. */
  triggerKey: number;
}

/**
 * A brief, full-screen confetti pop — rendered via a portal to
 * document.body so it's never clipped by an ancestor's `overflow-hidden`
 * (e.g. the rounded console panel it's usually triggered from).
 */
const ConfettiBurst = ({ triggerKey }: ConfettiBurstProps) => {
  if (triggerKey <= 0 || typeof document === "undefined") return null;

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(80, 220);
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.6 - 30,
      fallY: randomBetween(180, 320),
      rotate: randomBetween(-220, 220),
      color: COLORS[i % COLORS.length],
      delay: randomBetween(0, 0.1),
      width: randomBetween(6, 10),
      height: randomBetween(8, 14),
    };
  });

  return createPortal(
    <div
      key={triggerKey}
      className="pointer-events-none fixed inset-0 z-999 flex items-start justify-center pt-32"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y + p.fallY, opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.3, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>,
    document.body,
  );
};

export default ConfettiBurst;
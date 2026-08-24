import { useEffect, useRef, useState } from "react";

interface UseCountdownResult {
  remainingMs: number;
  isExpired: boolean;
}

export function useCountdown(expiresAt: string | null, onExpire?: () => void): UseCountdownResult {
  const target = expiresAt ? new Date(expiresAt).getTime() : null;
  const [remainingMs, setRemainingMs] = useState(() => (target ? Math.max(0, target - Date.now()) : 0));
  const firedRef = useRef(false);

  useEffect(() => {
    if (!target) return;
    firedRef.current = false;

    const tick = () => {
      const remaining = Math.max(0, target - Date.now());
      setRemainingMs(remaining);
      if (remaining === 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target, onExpire]);

  return { remainingMs, isExpired: remainingMs === 0 };
}
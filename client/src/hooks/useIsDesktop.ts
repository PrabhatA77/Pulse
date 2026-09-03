import { useEffect, useState } from "react";

/** Tracks whether the viewport matches the given min-width breakpoint (default: Tailwind's `md`, 768px). */
export function useIsDesktop(minWidthPx = 768): boolean {
  const getMatch = () =>
    typeof window !== "undefined" && window.matchMedia(`(min-width: ${minWidthPx}px)`).matches;

  const [isDesktop, setIsDesktop] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidthPx}px)`);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [minWidthPx]);

  return isDesktop;
}
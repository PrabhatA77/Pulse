import { useEffect, useState } from "react";

/**
 * Tiny classnames helper — joins truthy class strings together.
 * Avoids pulling in clsx/tailwind-merge for a handful of conditional classes.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Tracks whether the app is currently in dark mode.
 *
 * Reads the `dark` class on <html> (Tailwind's `class` strategy /
 * next-themes convention) and re-checks whenever that class list changes,
 * so the syntax highlighter theme and badge colors stay in sync with the
 * rest of the app without any prop drilling.
 */
export function useIsDarkMode(): boolean {
  const getIsDark = () =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(getIsDark());
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

/** Maps a syntax-highlighter language id to a short display label for the badge. */
const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  cpp: "C++",
  typescript: "TypeScript",
  javascript: "JavaScript",
  java: "Java",
  go: "Go",
  rust: "Rust",
};

export function getLanguageLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? language;
}
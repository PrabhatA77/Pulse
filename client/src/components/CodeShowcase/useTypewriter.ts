import { useEffect, useState } from "react";

interface UseTypewriterResult {
  /** Text typed so far. */
  displayed: string;
  /** 0-indexed line the typewriter is currently on. */
  currentLine: number;
  /** True once every character has been typed. */
  finished: boolean;
  /** Whether the blinking cursor should render — false once typing finishes. */
  cursorVisible: boolean;
  /** Re-runs the typing animation for the current text from scratch. */
  restart: () => void;
}

/**
 * Types out `text` one character at a time, pausing longer after each
 * newline so multi-line code reads like a real editor typing it out.
 * Resets automatically whenever `text` changes (e.g. moving to the next
 * demo snippet).
 */
export function useTypewriter(text: string, baseSpeed = 20): UseTypewriterResult {
  const [displayed, setDisplayed] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [finished, setFinished] = useState(false);
  const [replayToken, setReplayToken] = useState(0);

  // Tracks the (text, replayToken) pair the displayed/finished state was
  // last reset for. When either changes, reset *during render* instead of
  // in an Effect — React's documented pattern for "adjusting state when a
  // prop changes" (react.dev, "You Might Not Need an Effect"). This avoids
  // an extra render+paint where stale text would still be on screen, and
  // keeps the Effect below free of a synchronous setState at the top of
  // its body (which is what the lint rule was flagging).
  const [resetKey, setResetKey] = useState({ text, replayToken });
  if (resetKey.text !== text || resetKey.replayToken !== replayToken) {
    setResetKey({ text, replayToken });
    setDisplayed("");
    setCurrentLine(0);
    setFinished(false);
  }

  const restart = () => setReplayToken((token) => token + 1);

  useEffect(() => {
    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      if (index >= text.length) {
        setFinished(true);
        return;
      }

      const char = text.charAt(index);
      index += 1;

      setDisplayed(text.slice(0, index));
      if (char === "\n") {
        setCurrentLine((line) => line + 1);
      }

      // Longer pause after a newline so each line reads distinctly;
      // small jitter on regular characters so the pace feels human.
      const delay =
        char === "\n" ? baseSpeed * 14 + Math.random() * 80 : baseSpeed + Math.random() * 12;

      timeoutId = setTimeout(typeNextChar, delay);
    };

    timeoutId = setTimeout(typeNextChar, baseSpeed);

    return () => clearTimeout(timeoutId);
  }, [text, baseSpeed, replayToken]);

  return { displayed, currentLine, finished, cursorVisible: !finished, restart };
}
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ResizableSplitProps {
  /** "horizontal" = panes side by side, dragging left/right. "vertical" = panes stacked, dragging up/down. */
  direction: "horizontal" | "vertical";
  first: ReactNode;
  second: ReactNode;
  /** Initial size of the first pane, as a percentage of the container. */
  defaultFirstSize?: number;
  minFirstSize?: number;
  maxFirstSize?: number;
  /** Persists the chosen split position across sessions under this key. */
  storageKey?: string;
  className?: string;
}

function readStoredSize(storageKey: string | undefined, fallback: number): number {
  if (!storageKey || typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(storageKey);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * A simple two-pane resizable split (VS Code / LeetCode style), driven by
 * pointer events so it works with both mouse and touch. Compose two of
 * these (one horizontal, one nested vertical) to build a 3-pane layout.
 */
const ResizableSplit = ({
  direction,
  first,
  second,
  defaultFirstSize = 30,
  minFirstSize = 15,
  maxFirstSize = 70,
  storageKey,
  className,
}: ResizableSplitProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [firstSize, setFirstSize] = useState(() => readStoredSize(storageKey, defaultFirstSize));
  const [dragging, setDragging] = useState(false);

  const isHorizontal = direction === "horizontal";

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const raw = isHorizontal
        ? ((clientX - rect.left) / rect.width) * 100
        : ((clientY - rect.top) / rect.height) * 100;
      const clamped = Math.min(maxFirstSize, Math.max(minFirstSize, raw));
      setFirstSize(clamped);
    },
    [isHorizontal, minFirstSize, maxFirstSize],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: PointerEvent) => updateFromPointer(e.clientX, e.clientY);
    const handleUp = () => {
      setDragging(false);
      if (storageKey) {
        window.localStorage.setItem(storageKey, String(firstSize));
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [dragging, updateFromPointer, storageKey, firstSize, isHorizontal]);

  return (
    <div
      ref={containerRef}
      className={`flex min-h-0 min-w-0 flex-1 ${isHorizontal ? "flex-row" : "flex-col"} ${className ?? ""}`}
    >
      <div style={{ flexBasis: `${firstSize}%` }} className="min-h-0 min-w-0 shrink-0 grow-0">
        {first}
      </div>

      <div
        role="separator"
        aria-orientation={isHorizontal ? "vertical" : "horizontal"}
        onPointerDown={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        className={`group relative shrink-0 touch-none ${
          isHorizontal ? "w-1.5 cursor-col-resize" : "h-1.5 cursor-row-resize"
        }`}
      >
        <div
          className={`absolute rounded-full transition-colors duration-150 group-hover:bg-[#019bf0]/40 ${
            dragging ? "bg-[#019bf0]/60" : "bg-transparent"
          } ${isHorizontal ? "inset-y-0 left-1/2 w-1 -translate-x-1/2" : "inset-x-0 top-1/2 h-1 -translate-y-1/2"}`}
        />
      </div>

      <div className="min-h-0 min-w-0 flex-1">{second}</div>
    </div>
  );
};

export default ResizableSplit;
import { useEffect } from "react";

/**
 * Global Cmd/Ctrl+Enter (run) and Cmd/Ctrl+Shift+Enter (submit) shortcuts.
 * Attached to `window` so it fires regardless of which element has focus,
 * including inside the Monaco editor.
 */
export function useEditorShortcuts(onRun: () => void, onSubmit: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.metaKey || e.ctrlKey;
      if (!isModifierPressed || e.key !== "Enter") return;

      e.preventDefault();
      if (e.shiftKey) {
        onSubmit();
      } else {
        onRun();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRun, onSubmit, enabled]);
}
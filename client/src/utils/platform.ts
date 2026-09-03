export function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.platform ?? "";
  return /Mac|iPod|iPhone|iPad/.test(platform) || /Mac/.test(navigator.userAgent);
}

/** Human-readable shortcut label, adapted to the user's OS. */
export function shortcutLabel(combo: "run" | "submit"): string {
  const mod = isMacPlatform() ? "⌘" : "Ctrl";
  return combo === "run" ? `${mod}+Enter` : `${mod}+Shift+Enter`;
}
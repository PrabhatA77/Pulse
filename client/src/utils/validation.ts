// Client-side validation is a first line of defense for UX only — the
// backend's own validators (auth.validator.js) are the source of truth,
// and their exact rules weren't available here, so these are reasonable
// common-sense defaults. Adjust to match your real schemas if they differ.

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidUsername(value: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(value.trim());
}

export function isValidPassword(value: string): boolean {
  return value.length >= 8;
}
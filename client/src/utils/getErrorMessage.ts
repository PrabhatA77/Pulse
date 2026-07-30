import axios from "axios";

/**
 * Pulls the backend's error message out of an Axios error (the API's
 * error handler returns `{ message }`), with sane fallbacks so a toast
 * never shows "undefined" or a raw stack trace.
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
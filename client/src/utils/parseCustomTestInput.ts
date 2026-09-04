import type { FunctionParam, ParamType, TestCaseValue } from "../types/problem.types";

export function defaultCustomValue(type: ParamType): string {
  if (type === "boolean") return "false";
  if (type.endsWith("[]")) return "[]";
  if (type === "string") return "";
  return "0";
}

/** Renders an already-typed value (e.g. from a seeded example) back into the raw text a form field would hold. */
function valueToRawString(value: TestCaseValue, type: ParamType): string {
  if (type === "string") return String(value);
  if (type === "boolean") return value ? "true" : "false";
  if (type.endsWith("[]")) return JSON.stringify(value);
  return String(value);
}

/**
 * Builds the initial custom-test form values. When an example input is
 * available (the problem's first non-hidden test case), the form is
 * pre-filled with it instead of blank/zero placeholders — so the person
 * sees a known-good, correctly-formatted value for every field instead
 * of having to guess the expected format from scratch.
 */
export function defaultCustomInputs(
  parameters: FunctionParam[],
  exampleInput?: Record<string, TestCaseValue>,
): Record<string, string> {
  return Object.fromEntries(
    parameters.map((p) => {
      if (exampleInput && p.name in exampleInput) {
        return [p.name, valueToRawString(exampleInput[p.name], p.type)];
      }
      return [p.name, defaultCustomValue(p.type)];
    }),
  );
}

/** Short "how to type this" caption shown under each field. */
export function customFieldHint(type: ParamType): string {
  if (type === "string") return "Plain text — no quotes needed.";
  if (type.endsWith("[]")) return type === "string[]" ? 'JSON array, e.g. ["a","b"]' : "JSON array, e.g. [1,2,3]";
  if (type === "float") return "Number, decimals allowed.";
  if (type === "int") return "Whole number.";
  return "";
}

/** Parses one raw form value into the TestCaseValue the backend harness expects, based on its declared type. */
export function parseCustomValue(raw: string, type: ParamType): TestCaseValue {
  if (type === "int") {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) throw new Error("Must be a whole number");
    return n;
  }
  if (type === "float") {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) throw new Error("Must be a number");
    return n;
  }
  if (type === "boolean") {
    return raw === "true";
  }
  if (type === "string") {
    // Forgiving of a common mistake — pasting the value already wrapped
    // in quotes (e.g. copying `"()[]{}"` straight out of the Example
    // block). Strip one matching pair rather than sending the quote
    // characters through as literal string content.
    const trimmed = raw.trim();
    if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1);
    }
    return raw;
  }

  // Array types — expects JSON, e.g. [1, 2, 3] or ["a", "b"]
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Must be valid JSON, e.g. ${type === "string[]" ? '["a","b"]' : "[1,2,3]"}`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Must be a JSON array");
  }
  return parsed as TestCaseValue;
}

/** Parses every field in a custom-test form, throwing a combined error listing every invalid field. */
export function parseCustomInputs(
  raw: Record<string, string>,
  parameters: FunctionParam[],
): Record<string, TestCaseValue> {
  const result: Record<string, TestCaseValue> = {};
  const errors: string[] = [];

  for (const param of parameters) {
    try {
      result[param.name] = parseCustomValue(raw[param.name] ?? "", param.type);
    } catch (err) {
      errors.push(`${param.name}: ${err instanceof Error ? err.message : "Invalid value"}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return result;
}
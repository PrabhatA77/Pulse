import type { FunctionParam, ParamType, TestCaseValue } from "../types/problem.types";

export function defaultCustomValue(type: ParamType): string {
  if (type === "boolean") return "false";
  if (type.endsWith("[]")) return "[]";
  if (type === "string") return "";
  return "0";
}

export function defaultCustomInputs(parameters: FunctionParam[]): Record<string, string> {
  return Object.fromEntries(parameters.map((p) => [p.name, defaultCustomValue(p.type)]));
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
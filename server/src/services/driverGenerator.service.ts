import type {
  FunctionParam,
  ParamType,
  TestCaseValue,
} from "../models/problem.model.js";

export interface Signature {
  functionName: string;
  parameters: FunctionParam[];
  returnType: ParamType;
}

export const SUPPORTED_LANGUAGES = [
  "javascript",
  "python",
  "cpp",
  "java",
  "typescript",
  "go",
  "ruby",
  "rust"
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function getInputValue(
  input: Record<string, TestCaseValue>,
  param: FunctionParam,
): TestCaseValue {
  const value = input[param.name];

  if (value === undefined) {
    throw new Error(`Missing input for parameter: ${param.name}`);
  }

  return value;
}

export function generateHarness(
  language: SupportedLanguage,
  userCode: string,
  signature: Signature,
  input: Record<string, TestCaseValue>,
): string {
  switch (language) {
    case "javascript":
      return generateJavascript(userCode, signature, input);
    case "python":
      return generatePython(userCode, signature, input);
    case "cpp":
      return generateCpp(userCode, signature, input);
    case "java":
      return generateJava(userCode, signature, input);
    case "typescript":
      // Valid JS is valid TS, so the existing JS harness works unchanged.
      return generateJavascript(userCode, signature, input);
    case "go":
      return generateGo(userCode, signature, input);
    case "ruby":
      return generateRuby(userCode, signature, input);
    case "rust":
      return generateRust(userCode, signature, input);
  }
}



// ---------------------------------------------------------------------------
// JavaScript — plain function, e.g. `function twoSum(nums, target) { ... }`.
// JSON.stringify produces valid JS literals directly for our value types,
// so this one needs no per-type formatting at all.
// ---------------------------------------------------------------------------

function generateJavascript(
  userCode: string,
  signature: Signature,
  input: Record<string, TestCaseValue>,
): string {
  const args = signature.parameters
  .map((p) => JSON.stringify(getInputValue(input, p)))
  .join(", ");
  return `${userCode}

const __result = ${signature.functionName}(${args});
console.log(JSON.stringify(__result));
`;
}

// ---------------------------------------------------------------------------
// Python — `class Solution:` with the method as `self.<functionName>(...)`,
// matching LeetCode's Python convention. Only real difference from JSON:
// booleans are capitalized (True/False) as Python literals.
// ---------------------------------------------------------------------------

function toPythonLiteral(value:TestCaseValue):string{
    if(typeof value === "boolean") return value ? "True":"False";
    if(Array.isArray(value)){
        return `[${value.map((v) => toPythonLiteral(v as TestCaseValue)).join(", ")}]`;
    }
    return JSON.stringify(value);
}

function generatePython(userCode: string, signature: Signature, input: Record<string, TestCaseValue>): string {
  const args = signature.parameters
  .map((p) => toPythonLiteral(getInputValue(input, p)))
  .join(", ");

  return `import json

${userCode}

__result = Solution().${signature.functionName}(${args})
print(json.dumps(__result, separators=(",", ":")))
`;
}

// ---------------------------------------------------------------------------
// C++ — `class Solution { public: ... };`. Needs explicit typed
// declarations for the test values and a small set of overloaded
// __toJson() helpers so main() can print any return type uniformly.
// ---------------------------------------------------------------------------

const CPP_TYPES: Record<ParamType, string> = {
  int: "int",
  float: "double",
  string: "string",
  boolean: "bool",
  "int[]": "vector<int>",
  "float[]": "vector<double>",
  "string[]": "vector<string>",
  "boolean[]": "vector<bool>",
};

function toCppLiteral(value: TestCaseValue, type: ParamType): string {
  if (type.endsWith("[]")) {
    const baseType = type.slice(0, -2) as ParamType;
    const items = (value as Array<number | string | boolean>).map((v) => toCppLiteral(v, baseType));
    return `{${items.join(", ")}}`;
  }
  if (type === "string") return JSON.stringify(value);
  if (type === "boolean") return value ? "true" : "false";
  return String(value);
}

const CPP_PRELUDE = `#include <bits/stdc++.h>
using namespace std;

string __toJson(int v) { return to_string(v); }
string __toJson(double v) { ostringstream oss; oss << v; return oss.str(); }
string __toJson(bool v) { return v ? "true" : "false"; }
string __toJson(const string& v) {
    string escaped;
    for (char c : v) {
        if (c == '"' || c == '\\\\') escaped += '\\\\';
        escaped += c;
    }
    return "\\"" + escaped + "\\"";
}
template<typename T>
string __toJson(const vector<T>& v) {
    string result = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) result += ",";
        result += __toJson(v[i]);
    }
    return result + "]";
}
`;

function generateCpp(userCode: string, signature: Signature, input: Record<string, TestCaseValue>): string {
  const argDeclarations = signature.parameters
  .map(
    (p) =>
      `    ${CPP_TYPES[p.type]} ${p.name} = ${toCppLiteral(
        getInputValue(input, p),
        p.type
      )};`
  )
  .join("\n");
  const argNames = signature.parameters.map((p) => p.name).join(", ");

  return `${CPP_PRELUDE}
${userCode}

int main() {
${argDeclarations}
    Solution sol;
    auto __result = sol.${signature.functionName}(${argNames});
    cout << __toJson(__result);
    return 0;
}
`;
}

// ---------------------------------------------------------------------------
// Java — `class Solution { public <ReturnType> <name>(...) { ... } }`.
// Same __toJson approach as C++, adapted to Java syntax.
// ---------------------------------------------------------------------------

const JAVA_TYPES: Record<ParamType, string> = {
  int: "int",
  float: "double",
  string: "String",
  boolean: "boolean",
  "int[]": "int[]",
  "float[]": "double[]",
  "string[]": "String[]",
  "boolean[]": "boolean[]",
};

function toJavaLiteral(value: TestCaseValue, type: ParamType): string {
  if (type.endsWith("[]")) {
    const baseType = type.slice(0, -2) as ParamType;
    const items = (value as Array<number | string | boolean>).map((v) => toJavaLiteral(v, baseType));
    return `new ${JAVA_TYPES[type]}{${items.join(", ")}}`;
  }
  if (type === "string") return JSON.stringify(value);
  if (type === "boolean") return value ? "true" : "false";
  return String(value);
}

const JAVA_PRELUDE = `import java.util.*;

class Main {
    static String __toJson(int v) { return String.valueOf(v); }
    static String __toJson(double v) { return String.valueOf(v); }
    static String __toJson(boolean v) { return v ? "true" : "false"; }
    static String __toJson(String v) { return "\\"" + v.replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"") + "\\""; }
    static String __toJson(int[] v) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < v.length; i++) { if (i > 0) sb.append(","); sb.append(v[i]); }
        return sb.append("]").toString();
    }
    static String __toJson(double[] v) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < v.length; i++) { if (i > 0) sb.append(","); sb.append(v[i]); }
        return sb.append("]").toString();
    }
    static String __toJson(boolean[] v) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < v.length; i++) { if (i > 0) sb.append(","); sb.append(v[i]); }
        return sb.append("]").toString();
    }
    static String __toJson(String[] v) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < v.length; i++) { if (i > 0) sb.append(","); sb.append(__toJson(v[i])); }
        return sb.append("]").toString();
    }
`;

function generateJava(userCode: string, signature: Signature, input: Record<string, TestCaseValue>): string {
  const argDeclarations = signature.parameters
  .map(
    (p) =>
      `        ${JAVA_TYPES[p.type]} ${p.name} = ${toJavaLiteral(
        getInputValue(input, p),
        p.type
      )};`
  )
  .join("\n");
  const argNames = signature.parameters.map((p) => p.name).join(", ");

  // The user's `class Solution { ... }` is nested as a static inner class
  // of Main so a single file can hold both — Piston, like most online
  // judges, compiles one file, not a multi-file Java project.
  const nestedUserCode = userCode.replace(/^class\s+Solution/, "static class Solution");

  return `${JAVA_PRELUDE}
    ${nestedUserCode}

    public static void main(String[] args) {
${argDeclarations}
        Solution sol = new Solution();
        var __result = sol.${signature.functionName}(${argNames});
        System.out.print(__toJson(__result));
    }
}
`;
}

// ---------------------------------------------------------------------------
// Go — plain top-level function, e.g. `func twoSum(nums []int, target int) []int { ... }`.
// No classes needed; encoding/json handles printing any return type uniformly.
// ---------------------------------------------------------------------------

const GO_TYPES: Record<ParamType, string> = {
  int: "int",
  float: "float64",
  string: "string",
  boolean: "bool",
  "int[]": "[]int",
  "float[]": "[]float64",
  "string[]": "[]string",
  "boolean[]": "[]bool",
};

function toGoLiteral(value: TestCaseValue, type: ParamType): string {
  if (type.endsWith("[]")) {
    const baseType = type.slice(0, -2) as ParamType;
    const items = (value as Array<number | string | boolean>).map((v) => toGoLiteral(v, baseType));
    return `${GO_TYPES[type]}{${items.join(", ")}}`;
  }
  if (type === "string") return JSON.stringify(value);
  if (type === "boolean") return value ? "true" : "false";
  return String(value);
}

function generateGo(userCode: string, signature: Signature, input: Record<string, TestCaseValue>): string {
  const argDeclarations = signature.parameters
    .map((p) => `\t${p.name} := ${toGoLiteral(getInputValue(input, p), p.type)}`)
    .join("\n");
  const argNames = signature.parameters.map((p) => p.name).join(", ");

  return `package main

import (
	"encoding/json"
	"fmt"
)

${userCode}

func main() {
${argDeclarations}
	__result := ${signature.functionName}(${argNames})
	__bytes, _ := json.Marshal(__result)
	fmt.Print(string(__bytes))
}
`;
}

// ---------------------------------------------------------------------------
// Ruby — plain top-level method, e.g. `def two_sum(nums, target) ... end`.
// JSON.stringify already produces valid Ruby literals for our value types
// (numbers, quoted strings, true/false, arrays), so no per-type formatting
// is needed — same reason the JS generator gets away with this.
// ---------------------------------------------------------------------------

function generateRuby(userCode: string, signature: Signature, input: Record<string, TestCaseValue>): string {
  const args = signature.parameters
    .map((p) => JSON.stringify(getInputValue(input, p)))
    .join(", ");

  return `require 'json'

${userCode}

__result = ${signature.functionName}(${args})
puts __result.to_json
`;
}

// ---------------------------------------------------------------------------
// Rust — plain top-level function using owned types (Vec<T>/String, not
// slices/&str) so there's no borrow-checker friction when the harness
// constructs literal test values. Piston compiles with plain rustc (no
// Cargo, so no serde_json) — since we know the return type at codegen
// time, we emit the exact serialization expression for it directly
// instead of a generic serializer.
// ---------------------------------------------------------------------------

const RUST_TYPES: Record<ParamType, string> = {
  int: "i32",
  float: "f64",
  string: "String",
  boolean: "bool",
  "int[]": "Vec<i32>",
  "float[]": "Vec<f64>",
  "string[]": "Vec<String>",
  "boolean[]": "Vec<bool>",
};

function toRustLiteral(value: TestCaseValue, type: ParamType): string {
  if (type.endsWith("[]")) {
    const baseType = type.slice(0, -2) as ParamType;
    const items = (value as Array<number | string | boolean>).map((v) => toRustLiteral(v, baseType));
    return `vec![${items.join(", ")}]`;
  }
  if (type === "string") return `${JSON.stringify(value)}.to_string()`;
  if (type === "boolean") return value ? "true" : "false";
  return String(value);
}

function rustToJsonExpr(returnType: ParamType): string {
  switch (returnType) {
    case "int":
    case "float":
    case "boolean":
      return "__result.to_string()";
    case "string":
      return `format!("{:?}", __result)`;
    case "int[]":
    case "float[]":
    case "boolean[]":
      return `format!("[{}]", __result.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(","))`;
    case "string[]":
      return `format!("[{}]", __result.iter().map(|x| format!("{:?}", x)).collect::<Vec<_>>().join(","))`;
  }
}

function generateRust(userCode: string, signature: Signature, input: Record<string, TestCaseValue>): string {
  const argDeclarations = signature.parameters
    .map((p) => `\tlet ${p.name}: ${RUST_TYPES[p.type]} = ${toRustLiteral(getInputValue(input, p), p.type)};`)
    .join("\n");
  const argNames = signature.parameters.map((p) => p.name).join(", ");

  return `${userCode}

fn main() {
${argDeclarations}
\tlet __result = ${signature.functionName}(${argNames});
\tprintln!("{}", ${rustToJsonExpr(signature.returnType)});
}
`;
}
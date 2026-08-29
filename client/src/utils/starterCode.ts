import type { FunctionParam,ParamType } from "../types/problem.types";

const CPP_TYPES: Record<ParamType, string> = {
  int: "int", float: "double", string: "string", boolean: "bool",
  "int[]": "vector<int>", "float[]": "vector<double>", "string[]": "vector<string>", "boolean[]": "vector<bool>",
};

const JAVA_TYPES: Record<ParamType, string> = {
  int: "int", float: "double", string: "String", boolean: "boolean",
  "int[]": "int[]", "float[]": "double[]", "string[]": "String[]", "boolean[]": "boolean[]",
};

const TS_TYPES: Record<ParamType, string> = {
  int: "number", float: "number", string: "string", boolean: "boolean",
  "int[]": "number[]", "float[]": "number[]", "string[]": "string[]", "boolean[]": "boolean[]",
};

const GO_TYPES: Record<ParamType, string> = {
  int: "int", float: "float64", string: "string", boolean: "bool",
  "int[]": "[]int", "float[]": "[]float64", "string[]": "[]string", "boolean[]": "[]bool",
};

const RUST_TYPES: Record<ParamType, string> = {
  int: "i32", float: "f64", string: "String", boolean: "bool",
  "int[]": "Vec<i32>", "float[]": "Vec<f64>", "string[]": "Vec<String>", "boolean[]": "Vec<bool>",
};

interface Signature {
  functionName: string;
  parameters: FunctionParam[];
  returnType: ParamType;
}

export function generateStarterCode(language: string, signature: Signature): string {
  const { functionName, parameters, returnType } = signature;
  const paramNames = parameters.map((p) => p.name).join(", ");

  switch (language) {
    case "javascript":
      return `function ${functionName}(${paramNames}) {\n    \n}`;
    case "python": {
      const pyParams = ["self", ...parameters.map((p) => p.name)].join(", ");
      return `class Solution:\n    def ${functionName}(${pyParams}):\n        `;
    }
    case "cpp": {
      const cppParams = parameters
        .map((p) => `${CPP_TYPES[p.type]}${p.type.endsWith("[]") ? "&" : ""} ${p.name}`)
        .join(", ");
      return `class Solution {\npublic:\n    ${CPP_TYPES[returnType]} ${functionName}(${cppParams}) {\n        \n    }\n};`;
    }
    case "java": {
      const javaParams = parameters.map((p) => `${JAVA_TYPES[p.type]} ${p.name}`).join(", ");
      return `class Solution {\n    public ${JAVA_TYPES[returnType]} ${functionName}(${javaParams}) {\n        \n    }\n}`;
    }
        case "typescript": {
      const tsParams = parameters.map((p) => `${p.name}: ${TS_TYPES[p.type]}`).join(", ");
      return `function ${functionName}(${tsParams}): ${TS_TYPES[returnType]} {\n    \n}`;
    }
    case "go": {
      const goParams = parameters.map((p) => `${p.name} ${GO_TYPES[p.type]}`).join(", ");
      return `func ${functionName}(${goParams}) ${GO_TYPES[returnType]} {\n\t\n}`;
    }
    case "ruby":
      return `def ${functionName}(${paramNames})\n  \nend`;
    case "rust": {
      const rustParams = parameters.map((p) => `${p.name}: ${RUST_TYPES[p.type]}`).join(", ");
      return `fn ${functionName}(${rustParams}) -> ${RUST_TYPES[returnType]} {\n    \n}`;
    }
    default:
      return "";
  }
}
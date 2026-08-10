import type { FunctionParam,ParamType } from "../types/problem.types";

const CPP_TYPES: Record<ParamType, string> = {
  int: "int", float: "double", string: "string", boolean: "bool",
  "int[]": "vector<int>", "float[]": "vector<double>", "string[]": "vector<string>", "boolean[]": "vector<bool>",
};

const JAVA_TYPES: Record<ParamType, string> = {
  int: "int", float: "double", string: "String", boolean: "boolean",
  "int[]": "int[]", "float[]": "double[]", "string[]": "String[]", "boolean[]": "boolean[]",
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
    default:
      return "";
  }
}
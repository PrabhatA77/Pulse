import { AppError } from "../middleware/errorHandler.js";
import { env } from "../config/env.js";

const PISTON_URL = env.pistonUri;

export const LANGUAGE_VERSIONS: Record<string, string> = {
  c: "10.2.0",
  cpp: "10.2.0",
  go: "1.16.2",
  java: "15.0.2",
  javascript: "20.11.1",
  python: "3.12.0",
  ruby: "3.0.1",
  rust: "1.68.2",
  sqlite3: "3.36.0",
  typescript: "5.0.3",
};

interface PistonRunStep {
  stdout: string;
  stderr: string;
  code: number;
  output?: string;
}

interface PistonResponse {
  compile?: PistonRunStep;
  run: PistonRunStep;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  compileError?: string;
}

export async function runCode(
  language: string,
  code: string,
  stdin: string,
): Promise<RunResult> {
  const version = LANGUAGE_VERSIONS[language];
  if (!version) {
    throw new AppError(`Unsupported language: ${language}`, 400);
  }

  let response: Response;
//   console.log("PISTON_URL =", PISTON_URL);
//   console.log("Calling:", `${PISTON_URL}/api/v2/execute`);
  try {
    response = await fetch(`${PISTON_URL}/api/v2/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: code }],
        stdin,
        run_timeout: 3000
      }),
    });
  } catch {
    throw new AppError(
      "Code execution service is unreachable — is Piston running?",
      502,
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    // console.log("Piston response:", errorText);

    throw new AppError(
        `Piston returned ${response.status}: ${errorText}`,
        502
    );
}

  const data = (await response.json()) as PistonResponse;

  // Compiled languages get a `compile` step; interpreted ones don't — only
  // check it when present, and only a non-zero code counts as a real error.
  if (data.compile && data.compile.code !== 0) {
    return {
      stdout: "",
      stderr: "",
      exitCode: data.compile.code,
      compileError:
        data.compile.stderr || data.compile.output || "Compilation failed",
    };
  }

  return {
    stdout: data.run.stdout ?? "",
    stderr: data.run.stderr ?? "",
    exitCode: data.run.code ?? 0,
  };
}

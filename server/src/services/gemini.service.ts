import OpenAI from "openai";
import { AppError } from "../middleware/errorHandler.js";
import { env } from "../config/env.js";

// Z.ai exposes an OpenAI-compatible API — same `openai` SDK works,
// just pointed at their base URL with a Z.ai key. Their global endpoint;
// swap to https://open.bigmodel.cn/api/paas/v4 if you're on the China plan.
const ZAI_BASE_URL = "https://api.z.ai/api/paas/v4";
const apiKey = env.zaiApiKey;
const MODEL = "glm-4.5-flash";

const client = apiKey ? new OpenAI({ apiKey, baseURL: ZAI_BASE_URL }) : null;

export interface EvaluationInput {
  problemTitle: string;
  problemDescription: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  language: string;
  code: string;
  testsPassed: number;
  testsTotal: number;
}

export interface EvaluationResult {
  correctnessSummary: string;
  observedTimeComplexity: string;
  observedSpaceComplexity: string;
  complexityMatchesExpected: boolean;
  codeQualityNotes: string;
  strengths: string[];
  areasToImprove: string[];
  followUpQuestion: string;
}

// Z.ai's OpenAI-compatible API doesn't reliably support OpenAI's strict
// `json_schema` structured-output mode, so instead of relying on the
// provider to enforce a schema, we ask for JSON via `response_format:
// json_object`, describe the exact shape in the prompt, and validate the
// parsed result ourselves with isEvaluationResult() below.
const EVALUATION_SHAPE_DESCRIPTION = `{
  "correctnessSummary": string (1 sentence, consistent with the given test results — do not contradict them),
  "observedTimeComplexity": string (Big-O, inferred by reading the code),
  "observedSpaceComplexity": string (Big-O, inferred by reading the code),
  "complexityMatchesExpected": boolean,
  "codeQualityNotes": string (1 sentence on readability, naming, structure),
  "strengths": string[] (1-2 short bullet points),
  "areasToImprove": string[] (1-2 short bullet points),
  "followUpQuestion": string (one follow-up question a real interviewer would ask next)
}`;

export async function generateHint(
  problem: { title: string; description: string; difficulty: string },
  level: number,
  previousHints: string[],
): Promise<string> {
  if (!client) {
    throw new AppError("ZAI_API_KEY is not set", 500);
  }

  const levelGuidance: Record<number, string> = {
    1: "A gentle nudge — point toward the right way to think about the problem (e.g. what pattern or data structure fits) without naming a specific algorithm.",
    2: "A more direct hint — name the general approach or algorithm family to use, but don't describe the exact steps.",
    3: "A concrete outline — describe the key steps of the approach in plain English, but do NOT write any code and do NOT give the full solution.",
  };
  const guidance = levelGuidance[level] ?? levelGuidance[3];

  const prompt = `You are a helpful technical interview coach giving a hint for a coding problem — not the answer.

Problem: ${problem.title} (${problem.difficulty})

${problem.description}

${
  previousHints.length > 0
    ? `Hints already given to the candidate, in order:\n${previousHints.map((h, i) => `${i + 1}. ${h}`).join("\n")}\n`
    : ""
}
Give hint #${level}. ${guidance}

Rules:
1. Keep it to 1-3 sentences.
2. Never write code or pseudocode.
3. Never reveal the full solution or exact algorithm implementation.
4. Don't repeat previous hints — build on them.
5. Return only the hint text, nothing else (no "Hint 1:" prefix).`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const hint = response.choices[0]?.message?.content?.trim();
    if (!hint) {
      throw new AppError("AI hint generator returned an empty response", 502);
    }
    return hint;
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    // Log the FULL detail so we can see what Z.ai actually said —
    // status code, error body, everything. Remove/reduce once diagnosed.
    console.error("Z.ai hint error — status:", error?.status);
    console.error("Z.ai hint error — message:", error?.message);
    console.error("Z.ai hint error — response data:", error?.error ?? error?.response?.data);

    if (error?.status === 429) {
      throw new AppError("Hint generation limit reached. Please try again later.", 429);
    }
    throw new AppError("Hint generation failed", 502);
}
}

export async function evaluateSubmission(
  input: EvaluationInput,
): Promise<EvaluationResult> {
  if (!client) {
    throw new AppError("ZAI_API_KEY is not set", 500);
  }

  const prompt = `You are an experienced technical interviewer reviewing a candidate's code submission.

Problem: ${input.problemTitle}

${input.problemDescription}

Expected complexity:
- Time: ${input.expectedTimeComplexity}
- Space: ${input.expectedSpaceComplexity}

Submitted solution (${input.language}):

\`\`\`${input.language}
${input.code}
\`\`\`

Test results (already verified by running the code — treat as fact):

${input.testsPassed}/${input.testsTotal} test cases passed.

Evaluate the submission.

Rules:
1. Infer the actual time complexity by reading the code.
2. Infer the actual space complexity by reading the code.
3. Compare the actual complexity with the expected complexity.
4. Evaluate code quality, readability, naming, and structure.
5. Keep correctnessSummary consistent with the test results.
6. Do not claim that all tests passed if they did not.
7. Do not claim that the solution is correct if the test results show failures.
8. Give practical feedback that would be useful in a technical interview.
9. Respond with ONLY a single valid JSON object — no markdown fences, no commentary — matching exactly this shape:

${EVALUATION_SHAPE_DESCRIPTION}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      throw new AppError("AI evaluator returned an empty response", 502);
    }

    let parsed: unknown;
    try {
      // Defensive strip in case the model wraps output in ```json fences
      // despite instructions not to.
      const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
      parsed = JSON.parse(cleaned);
    } catch {
      throw new AppError("AI evaluator returned invalid JSON", 502);
    }

    if (!isEvaluationResult(parsed)) {
      throw new AppError(
        "AI evaluator response didn't match the expected shape",
        502,
      );
    }

    return parsed;
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    console.error("Z.ai evaluation error — status:", error?.status);
    console.error("Z.ai evaluation error — message:", error?.message);
    console.error("Z.ai evaluation error — response data:", error?.error ?? error?.response?.data);

    if (error?.status === 429) {
      throw new AppError("AI evaluation limit reached. Please try again later.", 429);
    }
    throw new AppError("AI evaluation failed", 502);
}
}

function isEvaluationResult(value: unknown): value is EvaluationResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const v = value as Record<string, unknown>;

  return (
    typeof v.correctnessSummary === "string" &&
    typeof v.observedTimeComplexity === "string" &&
    typeof v.observedSpaceComplexity === "string" &&
    typeof v.complexityMatchesExpected === "boolean" &&
    typeof v.codeQualityNotes === "string" &&
    Array.isArray(v.strengths) &&
    Array.isArray(v.areasToImprove) &&
    typeof v.followUpQuestion === "string"
  );
}
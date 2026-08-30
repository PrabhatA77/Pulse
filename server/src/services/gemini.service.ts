import OpenAI from "openai";
import { AppError } from "../middleware/errorHandler.js";
import { env } from "../config/env.js";

const apiKey = env.openaiApiKey;
const MODEL = "gpt-5.4-mini";

const client = apiKey ? new OpenAI({ apiKey }) : null;

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

const evaluationSchema = {
  type: "object",
  properties: {
    correctnessSummary: {
      type: "string",
      description:
        "1 sentence note on correctness, consistent with the test results given - do not contradict them.",
    },

    observedTimeComplexity: {
      type: "string",
      description:
        "Big-O time complexity of the submitted code, inferred by reading it.",
    },

    observedSpaceComplexity: {
      type: "string",
      description:
        "Big-O space complexity of the submitted code, inferred by reading it.",
    },

    complexityMatchesExpected: {
      type: "boolean",
    },

    codeQualityNotes: {
      type: "string",
      description: "1 sentences on readability, naming, and structure.",
    },

    strengths: {
      type: "array",
      items: {
        type: "string",
      },
      description: "1-2 short bullet points.",
    },

    areasToImprove: {
      type: "array",
      items: {
        type: "string",
      },
      description: "1-2 short bullet points.",
    },

    followUpQuestion: {
      type: "string",
      description:
        "One follow-up question a real interviewer would ask next, based on this submission.",
    },
  },

  required: [
    "correctnessSummary",
    "observedTimeComplexity",
    "observedSpaceComplexity",
    "complexityMatchesExpected",
    "codeQualityNotes",
    "strengths",
    "areasToImprove",
    "followUpQuestion",
  ],

  additionalProperties: false,
};

export async function generateHint(
  problem: { title: string; description: string; difficulty: string },
  level: number,
  previousHints: string[],
): Promise<string> {
  if (!client) {
    throw new AppError("OPENAI_API_KEY is not set", 500);
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
    const response = await client.responses.create({
      model: MODEL,
      input: prompt,
      store: false,
    });

    const hint = response.output_text?.trim();
    if (!hint) {
      throw new AppError("AI hint generator returned an empty response", 502);
    }
    return hint;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error?.status === 429) {
      throw new AppError("Hint generation limit reached. Please try again later.", 429);
    }
    console.error("OpenAI hint error:", error);
    throw new AppError("Hint generation failed", 502);
  }
}

export async function evaluateSubmission(
  input: EvaluationInput,
): Promise<EvaluationResult> {
  if (!client) {
    throw new AppError("OPENAI_API_KEY is not set", 500);
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
9. Return only the requested structured evaluation.`;

  try {
    const response = await client.responses.create({
      model: MODEL,
      input: prompt,

      text: {
        format: {
          type: "json_schema",
          name: "evaluation_result",
          strict: true,
          schema: evaluationSchema,
        },
      },

      store: false,
    });

    if (!response.output_text) {
      throw new AppError("AI evaluator returned an empty response", 502);
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(response.output_text);
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
    // Preserve our own AppErrors
    if (error instanceof AppError) {
      throw error;
    }

    // OpenAI rate limit
    if (error?.status === 429) {
      throw new AppError(
        "AI evaluation limit reached. Please try again later.",
        429,
      );
    }

    console.error("OpenAI evaluation error:", error);

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

import { GoogleGenAI } from "@google/genai";
import { AppError } from "../middleware/errorHandler.js";
import { env } from "../config/env.js";

const apiKey = env.geminiApiKey;
const MODEL = "gemini-3.5-flash";

const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

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
  score: number;
  correctnessSummary: string;
  observedTimeComplexity: string;
  observedSpaceComplexity: string;
  complexityMatchesExpected: boolean;
  codeQualityNotes: string;
  strengths: string[];
  areaToImprove: string[];
  followUpQuestion: string;
}

const evaluationSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description: "Overall score for this submission.",
    },
    correctnessSummary: {
      type: "string",
      description:
        "1-2 sentence note on correctness, consistent with the test results given - do not contradict them.",
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
    complexityMatchesExpected: { type: "boolean" },
    codeQualityNotes: {
      type: "string",
      description: "2-3 sentences on readability, naming, structure.",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      description: "1-3 short bullet points.",
    },
    areasToImprove: {
      type: "array",
      items: { type: "string" },
      description: "1-3 short bullet points.",
    },
    followUpQuestion: {
      type: "string",
      description:
        "One follow-up question a real interviewer would ask next, based on this submission.",
    },
  },
  required: [
    "score",
    "correctnessSummary",
    "observedTimeComplexity",
    "observedSpaceComplexity",
    "complexityMatchesExpected",
    "codeQualityNotes",
    "strengths",
    "areasToImprove",
    "followUpQuestion",
  ],
};

export async function evaluateSubmission(input: EvaluationInput): Promise<EvaluationResult> {
  if (!client) {
    throw new AppError("GEMINI_API_KEY is not set", 500);
  }

  const prompt = `You are an experienced technical interviewer reviewing a candidate's code submission.

Problem: ${input.problemTitle}
${input.problemDescription}

Expected complexity: ${input.expectedTimeComplexity} time, ${input.expectedSpaceComplexity} space.

Submitted solution (${input.language}):
\`\`\`${input.language}
${input.code}
\`\`\`

Test results (already verified by running the code — treat as fact): ${input.testsPassed}/${input.testsTotal} test cases passed.

Evaluate the submission. Infer the actual time and space complexity by reading the code, compare it to the expected complexity, and comment on code quality. Keep correctnessSummary consistent with the ${input.testsPassed}/${input.testsTotal} result above — do not claim it passed all cases if it didn't, or vice versa.`;

  const interaction = await client.interactions.create({
    model: MODEL,
    input: prompt,
    response_format: { type: "text", mime_type: "application/json", schema: evaluationSchema },
  });

  if (!interaction.output_text) {
    throw new AppError("AI evaluator returned an empty response", 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(interaction.output_text);
  } catch {
    throw new AppError("AI evaluator returned invalid JSON", 502);
  }

  if (!isEvaluationResult(parsed)) {
    throw new AppError("AI evaluator response didn't match the expected shape", 502);
  }

  return parsed;
}

function isEvaluationResult(value: unknown): value is EvaluationResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.score === "number" &&
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

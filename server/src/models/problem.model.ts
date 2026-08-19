import mongoose, { Schema, Document } from "mongoose";

export const TOPICS = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stacks & Queues",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion & Backtracking",
  "Sorting & Searching",
  "Greedy",
  "Binary Search",
] as const;

export type Topic = (typeof TOPICS)[number];
export type Difficulty = "Easy" | "Medium" | "Hard";

export const PARAM_TYPES = [
  "int",
  "float",
  "string",
  "boolean",
  "int[]",
  "float[]",
  "string[]",
  "boolean[]",
] as const;
export type ParamType = (typeof PARAM_TYPES)[number];

export interface FunctionParam {
  name: string;
  type: ParamType;
}

export type TestCaseValue =
  | number
  | string
  | boolean
  | number[]
  | string[]
  | boolean[];

export interface TestCase {
  input: Record<string, TestCaseValue>;
  expectedOutput: TestCaseValue;
  isHidden: boolean;
  explanation?: string;
}

export interface ProblemDocument extends Document {
  title: string;
  difficulty: Difficulty;
  topic: Topic;
  description: string;
  constraints: string[];

  functionName: string;
  parameters: FunctionParam[];
  returnType: ParamType;
  testCases: TestCase[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;

  createdAt:Date;
  updatedAt:Date;
}

const functionParamSchema = new Schema<FunctionParam>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: PARAM_TYPES, required: true },
  },
  { _id: false },
);

const testCaseSchema = new Schema<TestCase>(
  {
    input: { type: Schema.Types.Mixed, required: true },
    expectedOutput: { type: Schema.Types.Mixed, required: true },
    isHidden: { type: Boolean, default: true },
    explanation: { type: String },
  },
  { _id: false },
);

const problemSchema = new Schema<ProblemDocument>(
  {
    title: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topic: { type: String, enum: TOPICS, required: true },
    description: { type: String, required: true },
    constraints: { type: [String], default: [] },
    functionName: { type: String, required: true, trim: true },
    parameters: {
      type: [functionParamSchema],
      validate: {
        validator: (params: FunctionParam[]) => params.length > 0,
        message: "A problem needs at least one parameter",
      },
    },
    returnType: { type: String, enum: PARAM_TYPES, required: true },
    testCases: {
      type: [testCaseSchema],
      validate: {
        validator: (cases: TestCase[]) => cases.length > 0,
        message: "A problem needs at least one test case",
      },
    },
    expectedTimeComplexity: { type: String, required: true },
    expectedSpaceComplexity: { type: String, required: true },
    // starterCode:{type:Map,of:String},
  },
  { timestamps: true },
);

problemSchema.pre("validate", function (this: ProblemDocument) {
  const paramNames = new Set(this.parameters?.map((p) => p.name) ?? []);

  for (const testCase of this.testCases ?? []) {
    const inputKeys = Object.keys(testCase.input ?? {});
    const missing = [...paramNames].filter((name) => !inputKeys.includes(name));
    const extra = inputKeys.filter((key) => !paramNames.has(key));

    if (missing.length > 0) {
      throw new Error(`Test case is missing input(s): ${missing.join(", ")}`);
    }

    if (extra.length > 0) {
      throw new Error(
        `Test case has input(s) not declared in parameters: ${extra.join(", ")}`,
      );
    }
  }
});

export const Problem = mongoose.model<ProblemDocument>(
  "Problem",
  problemSchema,
);
export type Difficulty = "Easy" | "Medium" | "Hard";
export type ParamType = "int" | "float" | "string" | "boolean" | "int[]" | "float[]" | "string[]" | "boolean[]";

export interface FunctionParam{
    name:string;
    type:ParamType;
}

export type TestCaseValue = number | string | boolean | number[] | string[] | boolean[]; 

export interface ProblemExample{
    input:Record<string,TestCaseValue>;
    output:TestCaseValue;
    explanation ?:string;
}

export interface Problem{
    id:string;
    title:string;
    difficulty:Difficulty;
    topic:string;
    description:string;
    constraints:string[];
    functionName:string;
    parameters:FunctionParam[];
    returnType:ParamType;
    examples:ProblemExample[];
}

export interface TestCaseResult{
    passed:boolean;
    isHidden:boolean;
    input?:Record<string,TestCaseValue>;
    expectedOutput?:TestCaseValue;
    actualOutput?:unknown;
    stderr?:string;
}

export interface ExecuteResponse{
    success:boolean;
    compileError?:string;
    results:TestCaseResult[];
}
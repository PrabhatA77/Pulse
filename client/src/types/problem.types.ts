export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ProblemExample{
    input:string;
    output:string;
    explanation ?:string;
}

export interface Problem{
    id:string;
    title:string;
    difficulty:Difficulty;
    topic:string;
    description:string;
    constraints:string[];
    examples:ProblemExample[];
    starterCode:Record<string,string>;
}

export interface TestCaseResult{
    passed:boolean;
    isHidden:boolean;
    input?:string;
    expectedOutput?:string;
    actualOutput?:string;
    stderr?:string;
}

export interface ExecuteResponse{
    success:boolean;
    compileError?:string;
    results:TestCaseResult[];
}
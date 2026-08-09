import type { TestCase } from "../models/problem.model.js";
import { runCode } from "./piston.service.js";

export interface TestCaseResult {
    passed:boolean;
    isHidden:boolean;
    input?:string;
    expectedOutput?:string;
    actualOutput?:string;
    stderr?:string;
}

export interface TestRunSummary {
    results:TestCaseResult[];
    compileError?:string;
}

function normalize(output: string): string {
  return output.replace(/\s+/g, "");
}

export async function runTestCases(language:string,code:string,testCases:TestCase[]):Promise<TestRunSummary> {
    const results : TestCaseResult[] = [];

    for(const testCase of testCases){
        const result = await runCode(language ,code,testCase.input);

        if(result.compileError){
            return {results,compileError:result.compileError};
        }

        const actualOutput = normalize(result.stdout);
        const passed = actualOutput === normalize(testCase.expectedOutput);

        results.push(
            testCase.isHidden
                ?{passed,isHidden:true}
                :{
                    passed,
                    isHidden:false,
                    input:testCase.input,
                    expectedOutput:testCase.expectedOutput,
                    actualOutput,
                    stderr:result.stderr,
                },
        );
    }

    return {results};
}
import type { TestCaseValue } from "../types/problem.types";

export function formatTestValue(value:unknown):string{
    if(typeof value === "string") return JSON.stringify(value);
    if(Array.isArray(value)) return `[${value.map(formatTestValue).join(",  ")}]`;
    return String(value);
}

export function formatInput(input:Record<string,TestCaseValue>):string{
    return Object.entries(input)
        .map(([name,value])=>`${name} = ${formatTestValue(value)}`)
        .join(", ");
}
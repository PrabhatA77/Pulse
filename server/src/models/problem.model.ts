import mongoose,{Schema,Document} from "mongoose";

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
] as const;

export type Topic = (typeof TOPICS)[number];
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface TestCase {
    input : string;
    expectedOutput:string;
    isHidden:boolean;
    explanation?:string;
}

export interface ProblemDocument extends Document{
    title : string;
    difficulty:Difficulty;
    topic:Topic;
    description: string;
    constraints:string[];
    testCases:TestCase[];
    expectedTimeComplexity:string;
    expectedSpaceComplexity:string;
    starterCode ?: Map<string,string>;
}

const testCaseSchema = new Schema<TestCase>(
    {
        input:{type:String,required:true},
        expectedOutput:{type:String,required:true},
        isHidden:{type:Boolean,default:true},
        explanation:{type:String},
    },
    {_id:false},
)

const problemSchema = new Schema<ProblemDocument>(
    {
        title:{type:String,required:true,trim:true},
        difficulty:{type:String,enum:["Easy","Medium","Hard"],required:true},
        topic:{type:String,enum:TOPICS,required:true},
        description:{type:String,required:true},
        constraints:{type:[String],default:[]},
        testCases:{
            type:[testCaseSchema],
            validate:{
                validator:(cases:TestCase[])=>cases.length > 0,
                message:"A problem needs at least one test case",
            },
        },
        expectedTimeComplexity:{type:String,required:true},
        expectedSpaceComplexity:{type:String,required:true},
        starterCode:{type:Map,of:String},
    },
    {timestamps:true},
);

export const Problem = mongoose.model<ProblemDocument>("Problem",problemSchema);

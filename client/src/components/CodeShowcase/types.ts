export interface AnalysisResult {
  status: string;
  timeComplexity: string;
  spaceComplexity: string;
  insight: string;
}

export interface DemoSnippet {
  title: string;
  language: string;
  code: string;
  analysis: AnalysisResult;
}
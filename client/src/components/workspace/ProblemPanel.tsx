import type { Problem } from "../../types/problem.types";

const DIFFICULTY_COLOR:Record<string,string>={
    Easy:"text-green-500 bg-green-500/10",
    Medium:"text-yellow-500 bg-yellow-500/10",
    Hard:"text-red-500 bg-red-500/10",
};

interface ProblemPanelProps{
    problem:Problem;
}

const ProblemPanel = ({problem}:ProblemPanelProps)=>{
    return (
    <div className="flex h-full flex-col overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{problem.title}</h2>

      <div className="mt-2 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {problem.topic}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {problem.description}
      </p>

      {problem.examples.map((example, index) => (
        <div key={index} className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm dark:bg-zinc-900">
          <p className="font-semibold text-zinc-900 dark:text-white">Example {index + 1}</p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Input: <code className="text-zinc-900 dark:text-white">{JSON.stringify(example.input)}</code>
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Output: <code className="text-zinc-900 dark:text-white">{JSON.stringify(example.output)}</code>
          </p>
          {example.explanation && <p className="mt-1 text-zinc-500 dark:text-zinc-500">{example.explanation}</p>}
        </div>
      ))}

      {problem.constraints.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold text-zinc-900 dark:text-white">Constraints</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>
                <code>{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemPanel;
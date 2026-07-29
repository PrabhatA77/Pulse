import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import TypingCursor from "./TypingCursor";
import { getLanguageLabel, useIsDarkMode } from "./utils";

interface CodeWindowProps {
  fileName: string;
  language: string;
  code: string;
  /** Whether the blinking cursor should render at the end of the code. */
  cursorVisible: boolean;
}

const CodeWindow = ({ fileName, language, code, cursorVisible }: CodeWindowProps) => {
  const isDark = useIsDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500 transition-transform hover:scale-125" />
          <span className="h-3 w-3 rounded-full bg-yellow-500 transition-transform hover:scale-125" />
          <span className="h-3 w-3 rounded-full bg-green-500 transition-transform hover:scale-125" />
        </div>

        <span className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {fileName}
        </span>

        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {getLanguageLabel(language)}
        </span>
      </div>

      
      <div className="min-h-0 flex-1 overflow-auto px-6 py-5 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: 0,
            fontSize: "13px",
            lineHeight: 1.55,
            background: "transparent",
            display: "inline",
            whiteSpace: "pre-wrap",
          }}
          showLineNumbers
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
        {cursorVisible && <TypingCursor />}
      </div>
    </motion.div>
  );
};

export default CodeWindow;
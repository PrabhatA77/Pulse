import Editor from "@monaco-editor/react";
import { useIsDarkMode } from "../../hooks/useIsDarkMode";

interface LanguageOption {
  id: string;
  label: string;
}

interface CodeEditorPanelProps {
  language: string;
  languages: LanguageOption[];
  code: string;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
}

const CodeEditorPanel = ({ language, languages, code, onLanguageChange, onCodeChange }: CodeEditorPanelProps) => {
  const isDark = useIsDarkMode();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none transition-all duration-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value ?? "")}
          theme={isDark ? "vs-dark" : "light"}
          options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
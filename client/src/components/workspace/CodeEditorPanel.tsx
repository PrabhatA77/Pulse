import { useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Moon,
  RotateCcw,
  Sun,
  WandSparkles,
} from "lucide-react";
import { useIsDarkMode } from "../../hooks/useIsDarkMode";

interface LanguageOption {
  id: string;
  label: string;
}

interface CodeEditorPanelProps {
  language: string;
  languages: LanguageOption[];
  code: string;
  defaultCode: string;
  onLanguageChange: (language: string) => void;
  onCodeChange: (code: string) => void;
}

const LANGUAGE_BADGES: Record<string, string> = {
  javascript: "JS",
  python: "PY",
  cpp: "C++",
  java: "JV",
  typescript: "TS",
  go: "GO",
  ruby: "RB",
  rust:"RS",
};

const CodeEditorPanel = ({
  language,
  languages,
  code,
  defaultCode,
  onLanguageChange,
  onCodeChange,
}: CodeEditorPanelProps) => {
  const isDark = useIsDarkMode();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleAppTheme = () => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
  window.dispatchEvent(new Event("theme-change"));
};

  const dropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const selectedLanguage =
    languages.find((lang) => lang.id === language) ?? languages[0];

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageId: string) => {
    onLanguageChange(languageId);
    setDropdownOpen(false);
  };

  const handleFormat = async () => {
  const editor = editorRef.current;

  if (!editor) return;

  try {
    await editor.getAction("editor.action.formatDocument")?.run();
  } catch (error) {
    console.error("Failed to format code:", error);
  }
};

  const handleReset = () => {
    onCodeChange(defaultCode);
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
        {/* Language selector */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="
              group flex items-center gap-2 rounded-lg
              border border-zinc-200 bg-zinc-50
              px-2.5 py-1.5
              text-sm font-medium text-zinc-800
              shadow-sm
              transition-all duration-200
              hover:border-zinc-300 hover:bg-zinc-100 hover:shadow
              focus:outline-none focus:ring-2 focus:ring-[#019bf0]/30
              dark:border-zinc-700 dark:bg-zinc-900
              dark:text-zinc-100
              dark:hover:border-zinc-600 dark:hover:bg-zinc-800
            "
            aria-expanded={dropdownOpen}
          >
            {/* Language badge */}
            <span
              className="
                flex h-6 min-w-7 items-center justify-center
                rounded-md bg-zinc-200 px-1.5
                text-[10px] font-bold text-zinc-700
                transition-transform duration-200
                group-hover:scale-105
                dark:bg-zinc-800 dark:text-zinc-200
              "
            >
              {LANGUAGE_BADGES[language] ?? "CODE"}
            </span>

            <span>{selectedLanguage?.label}</span>

            <ChevronDown
              className={`
                h-4 w-4 text-zinc-400
                transition-transform duration-200
                ${dropdownOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* Animated dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -6,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
                className="
                  absolute left-0 top-full z-50 mt-2 w-52
                  origin-top
                  max-h-72 overflow-y-auto
                  rounded-xl
                  border border-zinc-200
                  bg-white p-1.5
                  shadow-2xl
                  dark:border-zinc-700
                  dark:bg-zinc-900
                "
              >
                <div className="px-2.5 pb-1.5 pt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Select language
                  </p>
                </div>

                {languages.map((lang) => {
                  const selected = lang.id === language;

                  return (
                    <motion.button
                      key={lang.id}
                      type="button"
                      onClick={() => handleLanguageChange(lang.id)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex w-full items-center gap-3
                        rounded-lg px-2.5 py-2
                        text-left text-sm
                        transition-colors duration-150
                        ${
                          selected
                            ? "bg-[#019bf0]/10 text-[#019bf0]"
                            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }
                      `}
                    >
                      {/* Badge */}
                      <span
                        className={`
                          flex h-7 min-w-8 items-center justify-center
                          rounded-md px-1
                          text-[10px] font-bold
                          transition-transform duration-150
                          ${
                            selected
                              ? "bg-[#019bf0]/15 text-[#019bf0]"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }
                        `}
                      >
                        {LANGUAGE_BADGES[lang.id] ?? "CODE"}
                      </span>

                      <span className="flex-1">{lang.label}</span>

                      {/* Selected indicator */}
                      <AnimatePresence>
                        {selected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          >
                            <Check className="h-4 w-4 text-[#019bf0]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right-side editor controls */}
        <div className="flex items-center gap-1">
          {/* Format */}
          <button
            type="button"
            onClick={handleFormat}
            title="Format code"
            className="
              group flex items-center gap-1.5
              rounded-lg px-2.5 py-1.5
              text-xs font-medium
              text-zinc-500
              transition-all duration-200
              hover:bg-zinc-100 hover:text-zinc-900
              dark:text-zinc-400
              dark:hover:bg-zinc-800 dark:hover:text-white
            "
          >
            <WandSparkles className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12" />
            <span className="hidden sm:inline">Format</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset to default code"
            className="
              group flex items-center gap-1.5
              rounded-lg px-2.5 py-1.5
              text-xs font-medium
              text-zinc-500
              transition-all duration-200
              hover:bg-zinc-100 hover:text-zinc-900
              dark:text-zinc-400
              dark:hover:bg-zinc-800 dark:hover:text-white
            "
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Editor theme */}
          <button
            type="button"
            onClick={toggleAppTheme}
            title={isDark ? "Use light editor" : "Use dark editor"}
            className="
              ml-1 flex h-8 w-8 items-center justify-center
              rounded-lg
              text-zinc-500
              transition-all duration-200
              hover:bg-zinc-100 hover:text-zinc-900
              dark:text-zinc-400
              dark:hover:bg-zinc-800 dark:hover:text-white
            "
          >
            {isDark ? (
              <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>

      {/* Monaco */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value ?? "")}
          onMount={handleEditorMount}
          theme={isDark ? "vs-dark" : "light"}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: {
              top: 12,
              bottom: 12,
            },
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            cursorBlinking: "smooth",
            renderLineHighlight: "all",
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
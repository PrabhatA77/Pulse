import { useCallback, useEffect, useRef, useState } from "react";

import { useTypewriter } from "./useTypewriter";
import CodeWindow from "./CodeWindow";
import AnalysisPanel from "./AnalysisPanel";
import { demoData } from "./demoData";

// How long a finished analysis stays on screen before the showcase moves
// on to the next language demo.
const HOLD_BEFORE_NEXT_MS = 4000;

const CodeShowcase = () => {
  const [demoIndex, setDemoIndex] = useState(0);
  const demo = demoData[demoIndex];

  const { displayed, finished, cursorVisible } = useTypewriter(demo.code, 20);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRevealComplete = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setDemoIndex((i) => (i + 1) % demoData.length);
    }, HOLD_BEFORE_NEXT_MS);
  }, []);

  // Clear any pending "advance to next demo" timer on unmount.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  return (
    // Sized off its nearest `@container` ancestor's width — not the
    // viewport — so it fits correctly whether it renders full-width or
    // gets squeezed into a sidebar/column. RightSideHero already sets
    // `@container`; if you drop this somewhere else, wrap it the same way
    // (falls back to the stacked/mobile layout if there's no container).
    //
    // Fixed height at each step (tuned around the longest demo snippet)
    // so this never grows and pushes neighboring components — and,
    // combined with the hidden-but-still-functional scrollbars inside
    // CodeWindow/AnalysisPanel, shouldn't need to scroll in normal use.
    <div
      className="
        mx-auto flex w-full flex-col gap-5
        h-205
        @sm:h-190
        @md:h-175
        @lg:h-130 @lg:max-w-160 @lg:flex-row @lg:gap-6
      "
    >
      <CodeWindow
        fileName={demo.title}
        language={demo.language}
        code={displayed}
        cursorVisible={cursorVisible}
      />
      <AnalysisPanel
        result={demo.analysis}
        finishedTyping={finished}
        onRevealComplete={handleRevealComplete}
      />
    </div>
  );
};

export default CodeShowcase;
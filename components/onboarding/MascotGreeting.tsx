"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { KiwizardSprite } from "@/components/KiwizardSprite";

const TYPEWRITER_MS = 30;

const PARAGRAPHS = [
  (name: string) =>
    `Greetings young ${name}. The road has been long and your trial many. Evil is everywhere. I sense much is pressing on your mind. These burdens needn't be carried by you alone.`,
  () =>
    `I have been sent by his majesty the King Kiwi himself to guide you on your journey. I have travelled far and wide and have mastered the secret arts to bend time and space itself.`,
  () =>
    `These powers I use to fight evil and bring peace and justice to all kiwis. In this relm, I am known as KIWIZARD, but my friends call me Jeff.`,
  () =>
    `I have received word you carry documents enchanted by a very dark magic: course outlines. These scriptures tell of many foe who must be vanquished, lest peril befall us all. Quick, hand them here. My magic table can decipher them.`,
];

interface MascotGreetingProps {
  paragraphIndex: number;
  name: string;
  onNext: () => void;
}

export function MascotGreeting({
  paragraphIndex,
  name,
  onNext,
}: MascotGreetingProps) {
  const fullText = PARAGRAPHS[paragraphIndex](name);
  const [displayedLength, setDisplayedLength] = useState(0);
  const isTypingDone = displayedLength >= fullText.length;

  useEffect(() => {
    setDisplayedLength(0);
  }, [paragraphIndex]);

  useEffect(() => {
    if (displayedLength >= fullText.length) return;
    const t = setTimeout(() => {
      setDisplayedLength((n) => Math.min(n + 1, fullText.length));
    }, TYPEWRITER_MS);
    return () => clearTimeout(t);
  }, [displayedLength, fullText.length]);

  const skipToEnd = useCallback(() => {
    setDisplayedLength(fullText.length);
  }, [fullText.length]);

  const displayedText = fullText.slice(0, displayedLength);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-center items-center gap-6">
        <KiwizardSprite size={300} />
        <div
          className="p-4 w-full min-h-[120px] cursor-pointer"
          onClick={!isTypingDone ? skipToEnd : undefined}
        >
          <p className="min-w-[612px] max-w-2xl min-h-full font-pixel text-white leading-loose">
            {displayedText}
            {!isTypingDone && (
              <span className="animate-typewriter-cursor inline-block ml-0.5 w-2 h-3 bg-primary align-middle" />
            )}
          </p>
          {isTypingDone && (
            <button
              type="button"
              onClick={onNext}
              className="mt-4 flex items-center gap-1 text-white/80 hover:text-primary transition-colors cursor-pointer font-pixel text-[10px]"
              aria-label="Next"
            >
              Next
              <ChevronRight size={24} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MascotGreetingProps {
  name: string;
  onContinue: () => void;
}

export function MascotGreeting({ name, onContinue }: MascotGreetingProps) {
  const fullText = `Greetings, ${name}! I am Kiwi the Wise, guardian of knowledge and keeper of quests. Let me help you organize your academic adventures into manageable quests.`;

  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [fullText]);

  const skipToEnd = () => {
    setDisplayedText(fullText);
    setIsDone(true);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex justify-center items-center gap-12">
        <div
          className="p-4 w-full min-h-[120px] cursor-pointer"
          onClick={!isDone ? skipToEnd : undefined}
        >
          <p className="min-w-[432px] h-[224px] font-pixel text-white leading-loose">
            {displayedText}
            {!isDone && (
              <span className="animate-typewriter-cursor inline-block ml-0.5 w-2 h-3 bg-primary align-middle" />
            )}
          </p>
        </div>

        <Image
          src="/sprites/kiwi-wizard.png"
          alt="Kiwi the Wise"
          width={200}
          height={200}
          className="pixelated animate-float drop-shadow-[0_0_12px_rgba(200,170,80,0.4)]"
        />
      </div>

      <Button onClick={onContinue} disabled={!isDone}>
        Continue
      </Button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PixelContainer } from "@/components/PixelContainer";
import Image from "next/image";

interface MascotGreetingProps {
  name: string;
  onContinue: () => void;
}

export function MascotGreeting({ name, onContinue }: MascotGreetingProps) {
  const fullText = `Greetings, ${name}! I am Kiwi the Wise, guardian of knowledge and keeper of quests. Let me help you organize your academic adventures into manageable quests. Together, we shall conquer every assignment, quiz, and exam!`;

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
    <PixelContainer gold className="flex flex-col items-center gap-6">
      <Image
        src="/sprites/kiwi-wizard.png"
        alt="Kiwi the Wise"
        width={200}
        height={200}
        className="pixelated animate-float"
      />

      <div
        className="pixel-borders bg-background p-4 w-full min-h-[120px] cursor-pointer"
        onClick={!isDone ? skipToEnd : undefined}
      >
        <p className="font-pixel text-[10px] text-foreground leading-[2]">
          {displayedText}
          {!isDone && (
            <span className="animate-typewriter-cursor inline-block ml-0.5 w-2 h-3 bg-primary align-middle" />
          )}
        </p>
      </div>

      {!isDone && (
        <p className="font-pixel text-[8px] text-muted-foreground">
          Click to skip...
        </p>
      )}

      {isDone && (
        <Button
          onClick={onContinue}
          className="font-pixel text-[10px] pixel-borders-gold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          Let&apos;s Begin!
        </Button>
      )}
    </PixelContainer>
  );
}

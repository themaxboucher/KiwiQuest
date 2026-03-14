"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PixelContainer } from "@/components/PixelContainer";
import { saveUser } from "@/lib/hooks";
import Image from "next/image";

interface WelcomeStepProps {
  onComplete: (name: string) => void;
}

export function WelcomeStep({ onComplete }: WelcomeStepProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await saveUser(name.trim());
    onComplete(name.trim());
  };

  return (
    <PixelContainer gold className="flex flex-col items-center gap-8 text-center">
      <Image
        src="/sprites/kiwi-wizard.png"
        alt="Kiwi Wizard"
        width={160}
        height={160}
        className="pixelated animate-float"
        priority
      />

      <div className="space-y-3">
        <h1 className="font-pixel text-xl text-primary pixel-text-shadow leading-relaxed">
          Pixel Quest
        </h1>
        <p className="font-pixel text-[10px] text-muted-foreground leading-relaxed">
          Your magical study companion
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="space-y-2">
          <label className="font-pixel text-[10px] text-foreground">
            Enter your name, adventurer
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your name..."
            className="pixel-borders bg-background text-center font-pixel text-xs"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || loading}
          className="w-full font-pixel text-[10px] pixel-borders-gold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          {loading ? "..." : "Begin Your Quest"}
        </Button>
      </div>
    </PixelContainer>
  );
}

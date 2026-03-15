"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="flex flex-col items-center gap-12 text-center">
      <div className="w-full space-y-4">
        <div className="flex flex-col items-center gap-4">
          <label className="font-pixel text-white">
            Hello, what's your name?
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your name..."
            className="text-center max-w-[18rem]"
          />
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!name.trim() || loading}
        className="w-fit"
      >
        {loading ? "..." : "Continue"}
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/components/AudioProvider";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { play } = useAudio();

  const handleStart = async () => {
    setLoading(true);
    play();
    const user = await db.user.get(1);
    if (user?.onboardingComplete) {
      router.push("/hut");
    } else {
      router.push("/onboarding");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Full-screen pixelated fantasy background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pixelated"
        style={{ backgroundImage: "url(/sprites/onboarding-bg-day.png)" }}
      />

      {/* Dim overlay so content is readable */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Welcome content — centered */}
      <div className="relative z-10 w-full max-w-2xl px-4 mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-14 text-center w-full">
          <div className="flex flex-col items-center">
            <h1 className="font-pixel text-6xl sm:text-5xl md:text-6xl text-primary pixel-text-shadow leading-relaxed">
              KIWI QUEST
            </h1>
            <p className="font-pixel text-white leading-relaxed">
              Your magical study companion
            </p>
          </div>

          <Button
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? "..." : "Start Adventure"}
          </Button>
        </div>
      </div>
    </div>
  );
}
